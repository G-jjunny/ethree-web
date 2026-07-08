/**
 * 히어로 캐러셀 슬라이드 데이터 (뷰-로컬 상수).
 * Eco / Environment / Education 3개 키워드로 브랜드 메시지를 순환한다.
 */
export interface HeroSlide {
  id: string;
  keyword: string;
  tagline: string;
  body: string;
  /** 슬라이드 배경 이미지. 실제 이미지 미확보 — 추후 실제 이미지로 교체. */
  imageSrc?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "eco",
    keyword: "Eco",
    tagline: "your future, our vision.",
    body: "이쓰리는 환경을 생각하는 기술로 더 나은 내일을 설계합니다. 환경 데이터 기반 정책 연구부터 시스템 구축·운영까지, 지속가능한 미래를 만듭니다.",
    imageSrc: "/images/slide1.jpg",
  },
  {
    id: "environment",
    keyword: "Environment",
    tagline: "IT solution, for nature.",
    body: "환경부와 산하기관의 대표 시스템을 기획·개발·구축·운영합니다. 국토환경성평가지도부터 환경영향평가까지, 국가 환경 인프라를 책임집니다.",
    imageSrc: "/images/slide2.jpg",
  },
  {
    id: "education",
    keyword: "Education",
    tagline: "knowledge, we share.",
    body: "기후세미나와 연구를 통해 환경 지식을 나누고, 전문가와 함께 기후위기 대응 역량을 키워갑니다.",
    imageSrc: "/images/slide3.jpg",
  },
];
