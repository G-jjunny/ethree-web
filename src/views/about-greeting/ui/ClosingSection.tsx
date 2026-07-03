import { SITE } from "@/shared/constants";

/** 맺음말(7~9문단) + 서명. */
export function ClosingSection() {
  return (
    <section className="bg-surface py-16 lg:py-25">
      <div className="content-container">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 border-t border-hairline pt-14">
          <p className="text-body-sm text-ink-soft">
            앞으로 이쓰리는 다양한 환경 데이터를 통합하고 활용하여, 기후위기
            시대에 대응하는 탄소중립형 환경 플랫폼 기업으로 성장해 나갈
            것입니다.
          </p>
          <p className="text-body-sm text-ink-soft">
            저는 직원의 정신적·물질적 행복을 최우선으로 여기며, 고객 한 분
            한 분을 평생 보호해야 할 소중한 존재로 생각합니다.
          </p>
          <p className="text-body-sm text-ink-soft">
            매일의 작은 실천이 큰 변화를 만들어낸다는 믿음으로, 오늘도 고객,
            직원, 그리고 사회를 위한 발걸음을 멈추지 않겠습니다.
          </p>

          <p className="mt-6 self-end text-item font-bold text-ink">
            대표이사 {SITE.ceo} 올림
          </p>
        </div>
      </div>
    </section>
  );
}
