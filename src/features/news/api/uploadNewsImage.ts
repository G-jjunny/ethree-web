"use server";

import { createServerSupabaseClient } from "@/shared/api/supabaseServerClient";
import type { UploadNewsImageResult } from "../model/types";

/**
 * News 이미지 업로드 Server Action.
 *
 * 커버 이미지 · 본문 삽입 이미지에 공통 사용한다. 클라이언트에서 FormData(`file`)로 호출.
 *
 * 인가: 세션 클라이언트 `getUser()`(미인증 거부). service_role 금지 —
 *   Storage `news-images` write 정책이 authenticated 롤을 요구한다.
 * 경로: `news/{uuid}.{ext}` — 원본 파일명 대신 새 uuid로 생성(충돌·경로주입 방지).
 * ext 화이트리스트로 제한. 성공 시 getPublicUrl로 public URL 반환.
 */

const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif", "avif"] as const;
const MIME_TO_EXT: Record<string, (typeof ALLOWED_EXT)[number]> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function resolveExt(file: File): string | null {
  const nameExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  if ((ALLOWED_EXT as readonly string[]).includes(nameExt)) return nameExt;
  return MIME_TO_EXT[file.type] ?? null;
}

export async function uploadNewsImage(
  formData: FormData,
): Promise<UploadNewsImageResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "업로드할 이미지 파일이 필요합니다." };
  }

  const ext = resolveExt(file);
  if (!ext) {
    return {
      ok: false,
      message: "지원하지 않는 이미지 형식입니다. (png, jpg, webp, gif, avif)",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, message: "인증이 필요합니다. 다시 로그인해 주세요." };
  }

  const path = `news/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("news-images")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) {
    return { ok: false, message: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const { data } = supabase.storage.from("news-images").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
