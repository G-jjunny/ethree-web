/**
 * 전역 사이트 상수 (SSOT).
 * 브랜드/연락처/주소/네비게이션 등 모든 정적 텍스트는 여기서만 정의한다.
 * 컴포넌트에 문자열 직접 하드코딩 금지.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  /** 헤더 표시용 한글/영문 라벨 */
  label: string;
  /** 푸터 컬럼 라벨(영문 대문자) */
  footerLabel: string;
  href: string;
  children: NavItem[];
}

export const SITE = {
  name: "이쓰리",
  nameEn: "E3",
  legalName: "(주) 이쓰리",
  tagline: "ENVIRONMENT IT SOLUTION GROUP",
  url: "https://ethree.co.kr",
  description:
    "이쓰리는 10년 이상 환경 IT 분야의 전문가들이 만든 환경 IT 융합서비스 으뜸 기업입니다.",
  ceo: "조흔우",
  address: {
    line1: "서울시 성동구 아차산로 17길 49",
    line2: "생각공장 데시앙플렉스 816호",
  },
  contact: {
    tel: "02-552-1947",
    fax: "02-552-1948",
  },
  copyright: "COPYRIGHT©2014 E3. ALL RIGHT RESERVED",
} as const;

/** 전역 네비게이션 구조 (헤더 상위 메뉴 + 푸터 컬럼 공용) */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "About E3",
    footerLabel: "ABOUT E3",
    href: "/about",
    children: [
      { label: "인사말", href: "/about/greeting" },
      { label: "연혁 및 비전", href: "/about/history" },
      { label: "오시는길", href: "/about/location" },
    ],
  },
  {
    label: "About Business",
    footerLabel: "ABOUT BUSINESS",
    href: "/business",
    children: [
      { label: "사업소개", href: "/business/intro" },
      { label: "서비스소개", href: "/business/service" },
    ],
  },
  {
    label: "Customer Support",
    footerLabel: "CUSTOMER SUPPORT",
    href: "/support",
    children: [
      { label: "NEWS", href: "/support/news" },
      { label: "기업문화", href: "/support/culture" },
      { label: "인재채용", href: "/support/careers" },
    ],
  },
] as const;
