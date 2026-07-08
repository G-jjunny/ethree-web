/**
 * About Business 솔루션 캐러셀 fallback 데이터 (뷰-로컬 상수).
 * Supabase `solution_slides` 테이블이 비어있거나(마이그레이션 미적용) 조회 실패 시
 * BusinessSection이 이 상수로 폴백한다. 관리자 콘솔(/console/landing/solutions)에서
 * 실제 데이터를 관리하며, 이 상수는 최초 seed와 동일한 문구를 보존한다.
 */
import type { SolutionSlide } from "@/features/solution/model/types";

export const BUSINESS_SOLUTIONS: readonly SolutionSlide[] = [
  {
    id: "fallback-si",
    title: "ENVIRONMENT",
    titleAccent: "SI",
    description:
      "환경IT서비스 전문기업으로 대국민 서비스, 행정업무 통합관리 등 효율적인 시스템 구축과 환경 정보시스템에 관한 기획에서부터 개발과 구축, 운영까지의 모든 서비스를 제공합니다.",
    imageUrl: "/images/solution-slide1.png",
  },
  {
    id: "fallback-rd",
    title: "ENVIRONMENT",
    titleAccent: "R&D",
    description:
      "환경의 변화, 그것에 대응하는 기초연구와 응용화 연구를 통한 환경IT 관련 기술개발의 리스크를 줄이고 성공 가능성을 높이기 위해 전문가 그룹이 끊임없이 연구합니다.",
    imageUrl: "/images/solution-slide2.png",
  },
  {
    id: "fallback-consulting",
    title: "ENVIRONMENT",
    titleAccent: "CONSULTING",
    description:
      "환경IT 관련 기술개발 프로젝트 수행 경험이 풍부한 전문 그룹과 조직을 바탕으로 차별화된 컨설팅을 제공, 다양한 환경 분야 프로젝트에 최적화된 사업 수행을 제공합니다.",
    imageUrl: "/images/solution-slide3.png",
  },
];
