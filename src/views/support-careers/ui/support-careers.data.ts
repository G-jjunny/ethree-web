/**
 * 인재채용 페이지 콘텐츠 단일 소스(뷰-로컬 상수).
 * Phase 3에서 Supabase 동적 편집 대상이 되므로 배열 단위로 구조화한다.
 * 외부 공개는 슬라이스 index.ts의 SupportCareersView만 유지한다.
 */

/** 채용 절차 단계. */
export interface RecruitStep {
  no: string;
  title: string;
  description: string;
}

export const RECRUIT_STEPS: readonly RecruitStep[] = [
  {
    no: "01",
    title: "서류 전형",
    description:
      "지원서와 이력서를 바탕으로 직무 적합성과 성장 가능성을 종합적으로 검토합니다.",
  },
  {
    no: "02",
    title: "실무 면접",
    description:
      "함께 일하게 될 실무진과의 면접을 통해 직무 역량과 협업 태도를 확인합니다.",
  },
  {
    no: "03",
    title: "처우 협의",
    description:
      "합격자와 근무 조건 및 처우를 상호 협의하여 합리적인 기준을 함께 결정합니다.",
  },
  {
    no: "04",
    title: "최종 합격",
    description:
      "입사 일정을 안내하고, 새로운 동료로서 이쓰리와 함께할 준비를 시작합니다.",
  },
];
