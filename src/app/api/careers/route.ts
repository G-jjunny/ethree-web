import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
// service_role 클라이언트는 서버 전용 · 키 노출 방지를 위해 shared/api 배럴이 아닌
// 하위 파일에서 직접 import 한다(배럴은 클라 소비 가능하므로 유출 표면 차단).
import { createServiceRoleClient } from "@/shared/api/supabaseServiceClient";
import { careersFormSchema } from "@/features/careers";
import type {
  CareersSettingsRow,
  SubmitCareersResponse,
} from "@/features/careers";

/**
 * POST /api/careers — 인재채용 공개 폼 제출.
 *
 * schema.md "Route Handler 삽입·발송 흐름 계약" 구현:
 *   1) body → zod 검증(careersFormSchema). 실패 시 400.
 *   2) service_role 클라로 careers_settings(id=1) 읽기 → recipient/from.
 *   3) Resend 발송(graceful): recipient 빈값/키 미설정/발송 예외는 모두 스킵(email_sent=false).
 *   4) 확정한 email_sent 로 careers_submissions INSERT 1회(service_role). 발송 성공 여부 무관 항상 저장.
 *   5) 저장 성공 200/201, 저장 실패 500.
 *
 * graceful 보장: RESEND_API_KEY/service key/DB 미연결에서도 저장 흐름은 시도되고,
 *   발송만 건너뛴다. 발송 실패는 사용자 제출을 실패로 만들지 않는다(제출 유실 방지).
 *
 * Next 16 Route Handler 규약: POST 는 캐시되지 않으며, Web Request/Response(NextRequest/
 *   NextResponse)로 처리한다(node_modules/next docs 확인).
 */

const RESEND_TEST_FROM = "onboarding@resend.dev";

/** 사용자 입력을 HTML 본문에 삽입하기 전 이스케이프(주입 방지). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonResponse(body: SubmitCareersResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  // 1) body 파싱 + zod 검증
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, message: "요청 형식이 올바르지 않습니다." },
      400,
    );
  }

  const parsed = careersFormSchema.safeParse(raw);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";
    return jsonResponse({ ok: false, message: first }, 400);
  }

  const { name, email, message } = parsed.data;

  // service_role 클라(settings 읽기 + submissions INSERT 를 동일 클라로 통일)
  const supabase = createServiceRoleClient();

  // 2) settings 읽기 (anon SELECT 미허용 → service_role 로 RLS 우회)
  let recipientEmail = "";
  let settingsFromEmail: string | null = null;
  try {
    const { data } = await supabase
      .from("careers_settings")
      .select("recipient_email, from_email")
      .eq("id", 1)
      .single<Pick<CareersSettingsRow, "recipient_email" | "from_email">>();
    if (data) {
      recipientEmail = data.recipient_email ?? "";
      settingsFromEmail = data.from_email ?? null;
    }
  } catch {
    // 미연결/에러 → 빈 수신 주소로 두고 발송 스킵(저장은 계속 진행).
  }

  // 3) 이메일 발송 (graceful) — 실패/스킵해도 email_sent=false 로 저장 진행
  let emailSent = false;
  const resendApiKey = process.env.RESEND_API_KEY ?? "";
  // from 우선순위: env(CAREERS_FROM_EMAIL) → settings.from_email → Resend 테스트 발신.
  // 테스트 발신(onboarding@resend.dev)은 검증 없이 발송 가능하나, 실서비스에서는
  // Resend 대시보드에서 도메인 인증 후 인증된 주소를 CAREERS_FROM_EMAIL 로 설정해야 한다.
  const fromEmail =
    (process.env.CAREERS_FROM_EMAIL ?? "").trim() ||
    (settingsFromEmail ?? "").trim() ||
    RESEND_TEST_FROM;

  if (recipientEmail && resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: email,
        subject: `[인재채용 문의] ${name}`,
        text: `이름: ${name}\n이메일: ${email}\n\n${message}`,
        html: `<div>
  <p><strong>이름:</strong> ${safeName}</p>
  <p><strong>이메일:</strong> ${safeEmail}</p>
  <hr />
  <p>${safeMessage}</p>
</div>`,
      });

      if (error) {
        console.error("[careers] Resend 발송 실패:", error);
      } else {
        emailSent = true;
      }
    } catch (err) {
      // 키 무효/네트워크 등 예외도 graceful 스킵.
      console.error("[careers] Resend 발송 예외:", err);
    }
  } else {
    // 수신 주소 미설정 또는 RESEND_API_KEY 미설정 → 발송 스킵.
    console.warn(
      "[careers] 이메일 발송 스킵(수신 주소 또는 RESEND_API_KEY 미설정). 제출은 저장됩니다.",
    );
  }

  // 4) 저장(INSERT 1회) — 발송 성공/실패 무관 항상 수행
  try {
    const { error } = await supabase.from("careers_submissions").insert({
      name,
      email,
      message,
      email_sent: emailSent,
    });

    if (error) {
      console.error("[careers] 제출 저장 실패:", error);
      return jsonResponse(
        {
          ok: false,
          message: "제출 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        },
        500,
      );
    }
  } catch (err) {
    console.error("[careers] 제출 저장 예외:", err);
    return jsonResponse(
      {
        ok: false,
        message: "제출 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      },
      500,
    );
  }

  // 5) 저장 성공 응답(발송 스킵/실패여도 저장됐으면 성공)
  return jsonResponse(
    {
      ok: true,
      message: "지원·문의가 정상적으로 접수되었습니다.",
      emailSent,
    },
    201,
  );
}
