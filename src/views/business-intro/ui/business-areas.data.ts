/**
 * SI/R&D/Consulting 사업영역 단일 소스.
 * IntroSection(개요 번호 프리뷰)과 BusinessAreasSection(상세 로우)에서 함께 참조한다.
 * 설명 원문은 landing BusinessSection의 BUSINESS_CARDS 문구를 그대로 재사용한다(무변경).
 * Consulting 세부 6항목은 사업소개 전용 원문.
 * 향후 Supabase 동적 콘텐츠 후보이므로 뷰-로컬 상수로 분리한다.
 * 외부 공개는 슬라이스 index.ts의 BusinessIntroView만 유지(슬라이스 내부 상대 import 허용).
 */
export interface BusinessArea {
  no: string;
  title: string;
  description: string;
  /** Consulting처럼 세부 항목이 있는 경우에만 채운다 */
  bullets?: readonly string[];
}

export const BUSINESS_AREAS: readonly BusinessArea[] = [
  {
    no: "01",
    title: "ENVIRONMENT SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
  },
  {
    no: "02",
    title: "ENVIRONMENT R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
  },
  {
    no: "03",
    title: "ENVIRONMENT CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    bullets: [
      "환경분야 종합 솔루션 컨설팅",
      "법규 및 기준 적합성 컨설팅",
      "환경관리계획 수립 컨설팅",
      "정보화 전략 계획 수립 컨설팅",
      "비즈니스 프로세스 및 전략 컨설팅",
      "아웃소싱 컨설팅",
    ],
  },
];
