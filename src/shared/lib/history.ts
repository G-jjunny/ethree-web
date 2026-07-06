/**
 * 연혁 이벤트 카테고리.
 * patent 특허 · award 수상·표창 · cert 인증·등록 · business 사업·연구
 */
export type HistoryCategory = "patent" | "award" | "cert" | "business";

export interface HistoryEvent {
  id: string;
  /** 발생 연도(YYYY) */
  year: number;
  title: string;
  category: HistoryCategory;
}

/** 연도별로 묶인 파생 그룹(최신 연도 먼저). */
export interface HistoryYearGroup {
  year: number;
  events: HistoryEvent[];
}

/**
 * 향후 Supabase 동적 콘텐츠(관리자 CRUD) 후보. 지금은 정적 상수를 반환한다.
 * 관리자 편집 단위가 이벤트 1건이 되도록 flat 배열로 유지하고,
 * 연도 그룹핑은 getHistoryByYear() 파생 함수로 처리한다.
 * 교체 시 getter 내부만 쿼리 로직으로 바꾸면 호출부는 변경 없음.
 *
 * 순서: reverse chronological(최신 연도가 먼저).
 * 출처: ethree.co.kr/history.do 원문 전사(요약·창작 금지).
 */
const HISTORY_EVENTS: readonly HistoryEvent[] = [
  // 2025
  {
    id: "2025-1",
    year: 2025,
    title: "딥러닝 기반 산불연무 확산속도 예측 알고리즘 개발",
    category: "business",
  },
  {
    id: "2025-2",
    year: 2025,
    title: "그린소사이어티(정몽구재단)",
    category: "business",
  },
  {
    id: "2025-3",
    year: 2025,
    title:
      "특허등록: 산사태·산불 진단 알고리즘을 적용한 산사태·산불 예방 및 대비 목적의 플랫폼시스템",
    category: "patent",
  },
  {
    id: "2025-4",
    year: 2025,
    title: "이쓰리 X 고려대 오정리질리언스 기후세미나 개최",
    category: "business",
  },

  // 2024
  {
    id: "2024-1",
    year: 2024,
    title:
      "특허등록: AI 분석을 통해 고품질 재활용품 분류를 위한 오염도 분석과 배출 정보 제공 방법 및 장치",
    category: "patent",
  },
  {
    id: "2024-2",
    year: 2024,
    title: "벤처기업확인(혁신성장유형)",
    category: "cert",
  },
  {
    id: "2024-3",
    year: 2024,
    title: "이노비즈인증(갱신)",
    category: "cert",
  },

  // 2023
  {
    id: "2023-1",
    year: 2023,
    title:
      "특허등록: 웹 입력기를 통한 모니터링 정보 입력 및 제공방법 및 컴퓨터장치",
    category: "patent",
  },
  {
    id: "2023-2",
    year: 2023,
    title:
      "특허등록: 환경데이터를 활용한 웹지도 기반 공간분석 방법 및 컴퓨터장치",
    category: "patent",
  },

  // 2022
  {
    id: "2022-1",
    year: 2022,
    title: "인공지능학습용 데이터 구축 지원사업",
    category: "business",
  },
  {
    id: "2022-2",
    year: 2022,
    title: "전문연구사업자 신고",
    category: "cert",
  },

  // 2021
  {
    id: "2021-1",
    year: 2021,
    title:
      "혁신시제품 지정: 훼손지 관리 및 복원 우선순위 대상지역 선정서비스(조달청)",
    category: "cert",
  },
  {
    id: "2021-2",
    year: 2021,
    title: "특허등록: 훼손 인과관계를 이용하여 훼손유형을 분류하는 방법",
    category: "patent",
  },
  {
    id: "2021-3",
    year: 2021,
    title: "특허등록: 복원우선순위 대상지역을 선정하는 방법",
    category: "patent",
  },

  // 2020
  {
    id: "2020-1",
    year: 2020,
    title: "벤처기업협회 우수회원 표창",
    category: "award",
  },
  {
    id: "2020-2",
    year: 2020,
    title: "특허등록: 무인항공기를 이용한 미세먼지 측정장치",
    category: "patent",
  },
  {
    id: "2020-3",
    year: 2020,
    title: "본사이전(성수동 생각공장 데시앙플렉스 816호)",
    category: "business",
  },
  {
    id: "2020-4",
    year: 2020,
    title: "특허등록: 센서의 교체 시점을 결정하는 대기질 측정장치",
    category: "patent",
  },
  {
    id: "2020-5",
    year: 2020,
    title: "ICT기반 환경영향평가 의사결정지원 기술 개발",
    category: "business",
  },
  {
    id: "2020-6",
    year: 2020,
    title: "온실가스 저감을 위한 국토도시공간 계획 및 관리기술 개발(국토교통부)",
    category: "business",
  },

  // 2019
  {
    id: "2019-1",
    year: 2019,
    title: "광주광역시장 표창",
    category: "award",
  },
  {
    id: "2019-2",
    year: 2019,
    title: "특허등록: 환경정보기반 경로정보 제공장치 및 방법",
    category: "patent",
  },
  {
    id: "2019-3",
    year: 2019,
    title: "특허등록: 유해물질 배출시설물 예측장치",
    category: "patent",
  },

  // 2017
  {
    id: "2017-1",
    year: 2017,
    title: "과학기술정보통신부 장관 표창(조흔우)",
    category: "award",
  },

  // 2015
  {
    id: "2015-1",
    year: 2015,
    title: "특허출원: 영유아 지킴이 서비스 시스템 국제 특허 출원",
    category: "patent",
  },
  {
    id: "2015-2",
    year: 2015,
    title: "스마트환경창업대회 우수상(환경부장관상, 아이마음)",
    category: "award",
  },
  {
    id: "2015-3",
    year: 2015,
    title: "특허등록: 음식물류 폐기물 수거차량의 악취제거 시스템",
    category: "patent",
  },
  {
    id: "2015-4",
    year: 2015,
    title: "2015 에코톤(환경ICT 아이디어 공모전) 우수상",
    category: "award",
  },
  {
    id: "2015-5",
    year: 2015,
    title: "한국 오픈소스 GIS포럼 우수상",
    category: "award",
  },

  // 2014
  {
    id: "2014-1",
    year: 2014,
    title:
      "환경정보활용 창업대회 우수상(환경부장관상, 쓰레기 잘 버리기 프로젝트)",
    category: "award",
  },
  {
    id: "2014-2",
    year: 2014,
    title: "환경부장관 표창(이쓰리)",
    category: "award",
  },
  {
    id: "2014-3",
    year: 2014,
    title: "폭염건강 위해정보 어플리케이션 프로그램 등록",
    category: "cert",
  },
  {
    id: "2014-4",
    year: 2014,
    title:
      "특허등록: 폭염예측 프로그램이 기록된 기록매체 및 이를 이용한 폭염적응키트",
    category: "patent",
  },

  // 2013
  {
    id: "2013-1",
    year: 2013,
    title: "환경부장관 표창(조흔우)",
    category: "award",
  },

  // 2012
  {
    id: "2012-1",
    year: 2012,
    title: "환경 컨설팅 회사 등록(서울시)",
    category: "cert",
  },

  // 2011
  {
    id: "2011-1",
    year: 2011,
    title: "기업부설연구소 설립(한국산업기술진흥협회)",
    category: "business",
  },

  // 2010
  {
    id: "2010-1",
    year: 2010,
    title: "소프트웨어산업협회 소프트웨어 사업자 등록",
    category: "cert",
  },
  {
    id: "2010-2",
    year: 2010,
    title: "(주)이쓰리 설립",
    category: "business",
  },
];

/** 연혁 이벤트 flat 목록(reverse chronological). */
export function getHistoryEvents(): readonly HistoryEvent[] {
  return HISTORY_EVENTS;
}

/**
 * 연도별로 그룹핑한 파생 목록(최신 연도 먼저).
 * 상수는 flat으로 유지하고 UI 소비 시점에만 그룹을 만든다.
 */
export function getHistoryByYear(): HistoryYearGroup[] {
  const map = new Map<number, HistoryEvent[]>();

  for (const event of HISTORY_EVENTS) {
    const bucket = map.get(event.year);
    if (bucket) {
      bucket.push(event);
    } else {
      map.set(event.year, [event]);
    }
  }

  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, events]) => ({ year, events }));
}
