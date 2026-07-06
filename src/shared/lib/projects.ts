/**
 * 사업실적(주요 프로젝트) 데이터.
 *
 * 출처: 레거시 ethree.co.kr 조회 요약본 기반. 발주처·프로젝트명·연도는
 * 정확도 검증이 필요하며 관리자 편집 대상이다(요약/정리된 값일 수 있음).
 *
 * 향후 Supabase 동적 콘텐츠(관리자 CRUD) 후보. 지금은 정적 상수를 반환한다.
 * 관리자 편집 단위가 프로젝트 1건이 되도록 flat 배열로 유지하고,
 * 연도 파생(getProjectYears)은 getter에서 처리한다.
 * 교체 시 getter 내부만 쿼리 로직으로 바꾸면 호출부는 변경 없음.
 *
 * 순서: reverse chronological(최신 연도가 먼저).
 */

export interface BusinessProject {
  id: string;
  /** 수행 연도(YYYY) */
  year: number;
  /** 발주처 */
  client: string;
  /** 프로젝트명 */
  title: string;
}

const BUSINESS_PROJECTS: readonly BusinessProject[] = [
  // 2025
  {
    id: "2025-1",
    year: 2025,
    client: "현대정몽구재단",
    title: "그린소사이어티 2차년도",
  },
  {
    id: "2025-2",
    year: 2025,
    client: "국립환경과학원",
    title: "환경영향평가 EIASS 이전 및 유지관리",
  },
  {
    id: "2025-3",
    year: 2025,
    client: "한국환경연구원",
    title: "국토환경정보시스템 유지관리",
  },
  {
    id: "2025-4",
    year: 2025,
    client: "환경부",
    title: "생태관광 홈페이지 유지관리",
  },
  {
    id: "2025-5",
    year: 2025,
    client: "한국교육환경보호원",
    title: "스마트교육환경정보시스템 구축",
  },

  // 2024
  {
    id: "2024-1",
    year: 2024,
    client: "현대정몽구재단",
    title: "산림재해시각화플랫폼 설계",
  },
  {
    id: "2024-2",
    year: 2024,
    client: "환경부",
    title: "토지이용 MRV 체계 구축",
  },
  {
    id: "2024-3",
    year: 2024,
    client: "한국환경연구원",
    title: "생태관광 홈페이지 운영",
  },
  {
    id: "2024-4",
    year: 2024,
    client: "국립환경과학원",
    title: "기후위험 정보지원시스템 ISP",
  },

  // 2023
  {
    id: "2023-1",
    year: 2023,
    client: "한국환경연구원",
    title: "국토환경정보시스템 유지관리",
  },
  {
    id: "2023-2",
    year: 2023,
    client: "환경부",
    title: "환경영향평가 시스템 유지보수",
  },

  // 2022
  {
    id: "2022-1",
    year: 2022,
    client: "국립환경과학원",
    title: "생태관광 홈페이지 운영",
  },
  {
    id: "2022-2",
    year: 2022,
    client: "한국환경연구원",
    title: "기후위기 적응정보 종합플랫폼",
  },

  // 2021
  {
    id: "2021-1",
    year: 2021,
    client: "한국생태관광협회",
    title: "자연환경해설사 관리시스템",
  },
  {
    id: "2021-2",
    year: 2021,
    client: "환경부",
    title: "국가생태탐방로 운영개선",
  },

  // 2020
  {
    id: "2020-1",
    year: 2020,
    client: "제주특별자치도",
    title: "제주도 환경자원총량관리계획",
  },

  // 2019
  {
    id: "2019-1",
    year: 2019,
    client: "환경부",
    title: "환경정보 융합 빅데이터 플랫폼",
  },
  {
    id: "2019-2",
    year: 2019,
    client: "한국환경공단",
    title: "폐기물직매립 제로화관리시스템",
  },

  // 2018
  {
    id: "2018-1",
    year: 2018,
    client: "한국환경정책평가연구원",
    title: "환경영향평가 데이터전환",
  },
];

/** 사업실적 flat 목록(reverse chronological). */
export function getBusinessProjects(): readonly BusinessProject[] {
  return BUSINESS_PROJECTS;
}

/**
 * 실적에 등장하는 연도 목록(내림차순, 파생).
 * 상수는 flat으로 유지하고 연도 축은 소비 시점에 파생한다.
 */
export function getProjectYears(): number[] {
  return Array.from(new Set(BUSINESS_PROJECTS.map((p) => p.year))).sort(
    (a, b) => b - a,
  );
}
