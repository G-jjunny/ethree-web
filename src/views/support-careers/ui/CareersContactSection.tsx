import { SectionHeader } from "@/shared/ui";
import { CareersForm } from "./CareersForm";

/**
 * 지원/문의 섹션 — 좌측 안내 리드 + 우측 지원 폼(클라이언트 경계) 2열.
 * 섹션 자체는 서버 컴포넌트이며 상호작용이 필요한 폼(CareersForm)만 클라이언트다.
 * 실제 이메일 전송은 Phase 4에서 /api/careers로 연결한다.
 */
export function CareersContactSection() {
  return (
    <section className="bg-surface-white py-16 lg:py-25">
      <div className="content-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            tone="light"
            eyebrow="APPLY"
            title="지원 · 문의하기"
            description="이쓰리와 함께하고 싶으신가요? 아래 폼으로 지원 의사나 궁금한 점을 남겨 주시면 담당자가 확인 후 회신드립니다."
            descriptionClassName="max-w-md"
          />

          <div className="rounded-card border border-hairline bg-surface p-8 lg:p-10">
            <CareersForm />
          </div>
        </div>
      </div>
    </section>
  );
}
