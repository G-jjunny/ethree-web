import { SITE } from "@/shared/constants";

/**
 * 대중교통 노선 1건.
 * label: 노선/구분(예: "2호선", "지선") · detail: 안내 문구 또는 노선 번호 목록.
 */
export interface TransitLine {
  label: string;
  detail: string;
}

/** 교통수단(지하철/버스) 그룹. */
export interface TransitGroup {
  /** 교통수단 명(지하철/버스) */
  mode: string;
  lines: TransitLine[];
}

/** 부서별 문의 연락처. */
export interface DepartmentContact {
  name: string;
  email: string;
}

/** 오시는 길 안내 데이터(교통·부서 문의·지도 쿼리). */
export interface DirectionsInfo {
  transit: TransitGroup[];
  departments: DepartmentContact[];
  /** 구글맵 임베드 검색어(SITE 주소 파생). */
  mapQuery: string;
}

/**
 * 향후 Supabase 동적 콘텐츠(관리자 CRUD) 후보. 지금은 정적 상수를 반환한다.
 * 관리자 편집 단위가 교통 노선 1건·부서 문의 1건이 되도록 그룹/flat 배열로 유지하고,
 * 교체 시 getDirections() 내부만 쿼리 로직으로 바꾸면 호출부는 변경 없음.
 *
 * 회사 핵심 메타데이터(주소/tel/fax)는 여기 두지 않고 SITE(단일 소스)에서 소비한다.
 * mapQuery만 SITE 주소에서 파생해 지도 임베드에 사용한다.
 * 출처: ethree.co.kr/directions.do 원문 전사(요약·창작 금지).
 */
const TRANSIT: readonly TransitGroup[] = [
  {
    mode: "지하철",
    lines: [
      {
        label: "2호선",
        detail: "건대입구역 1번출구 · 성수역 2번출구에서 도보 10분",
      },
      {
        label: "7호선",
        detail: "어린이대공원역 4번출구에서 도보 10분",
      },
    ],
  },
  {
    mode: "버스",
    lines: [
      { label: "지선", detail: "3217, 4212, 3220, 2016" },
      { label: "간선", detail: "146" },
      { label: "마을", detail: "성동10" },
    ],
  },
];

const DEPARTMENTS: readonly DepartmentContact[] = [
  { name: "사이트 및 기타 문의", email: "mhkang@ethree.co.kr" },
  { name: "공공사업팀", email: "shcha@ethree.co.kr" },
  { name: "기술연구소", email: "shcha@ethree.co.kr" },
];

/**
 * 오시는 길 안내 반환. 교통/부서는 정적 상수, mapQuery는 SITE 주소에서 파생.
 * 향후 관리자 CRUD 도입 시 이 getter 내부만 교체한다.
 */
export function getDirections(): DirectionsInfo {
  return {
    transit: TRANSIT.map((group) => ({
      mode: group.mode,
      lines: [...group.lines],
    })),
    departments: [...DEPARTMENTS],
    mapQuery: `${SITE.address.line1} ${SITE.address.line2}`,
  };
}
