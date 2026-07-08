/**
 * About Business 솔루션 캐러셀 데이터 (뷰-로컬 상수).
 * SI / R&D / Consulting 3개 솔루션을 중앙 강조 3단 캐러셀로 순환한다.
 * 문구는 기존 BUSINESS_CARDS 원문을 그대로 보존한다.
 */
export interface BusinessSolution {
  no: string;
  title: string;
  description: string;
  /**
   * 솔루션 대표 이미지. 실제 이미지 미확보 — 지금은 값 미지정으로 placeholder를 쓴다.
   * 여기에 경로를 채우면 SolutionCarousel 카드의 next/image 슬롯이 placeholder 위를 덮는다.
   */
  imageSrc?: string;
}

export const BUSINESS_SOLUTIONS: readonly BusinessSolution[] = [
  {
    no: "01",
    title: "ENVIRONMENT SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
    imageSrc: "/images/solution-slide1.png",
  },
  {
    no: "02",
    title: "ENVIRONMENT R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
    imageSrc: "/images/solution-slide2.png",
  },
  {
    no: "03",
    title: "ENVIRONMENT CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    imageSrc: "/images/solution-slide3.png",
  },
];
