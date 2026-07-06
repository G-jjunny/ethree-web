export interface Partner {
  id: string;
  name: string;
  /**
   * 로고 이미지 경로/URL. 미지정 시 이름 텍스트 타일로 대체된다.
   * 추후 관리자 업로드 → Supabase Storage public URL로 채워진다.
   */
  logoSrc?: string;
}

/**
 * 향후 Supabase 동적 콘텐츠(관리자 CRUD) 후보. 지금은 정적 상수를 반환한다.
 * 관리자 편집 단위 = 파트너 1건(flat 배열, news/history 패턴과 동일).
 * 교체 시 getter 내부만 쿼리 로직으로 바꾸면 호출부는 변경 없음.
 *
 * 출처: 연혁·뉴스 원문에 실재하는 협력·발주·수상 기관만 추림(창작 금지).
 * logoSrc는 실물 로고 확보 전까지 생략 → 이름 텍스트 타일로 순환 렌더된다.
 */
const PARTNERS: readonly Partner[] = [
  { id: "moe", name: "환경부" },
  { id: "molit", name: "국토교통부" },
  { id: "pps", name: "조달청" },
  { id: "kei", name: "한국환경연구원" },
  { id: "rwatershed", name: "유역환경청" },
  { id: "cmk-foundation", name: "정몽구재단" },
  { id: "ku-ojeong", name: "고려대학교 오정리질리언스연구원" },
  { id: "snu-health", name: "서울대학교 보건대학원" },
  { id: "kova", name: "벤처기업협회" },
  { id: "koita", name: "한국산업기술진흥협회" },
  { id: "kosa", name: "소프트웨어산업협회" },
];

/** 함께해온 기관 목록. 상수 자체 순서를 유지한다. */
export function getPartners(): readonly Partner[] {
  return PARTNERS;
}
