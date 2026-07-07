/**
 * 기업문화 정적 fallback 데이터(슬라이스 내부 전용).
 *
 * 마이그레이션 미적용/키 미연결/쿼리 에러/빈 결과 시 getCultureItems 가
 * 이 상수로 CultureContent 동일 shape 를 구성해 공개 페이지가 항상 정상 렌더되게 한다.
 * (구 `views/support-culture/ui/support-culture.data.ts` 이관 — FSD 정방향 확보.)
 *
 * 텍스트는 일반적·수정 가능한 회사문화 카피(허위 구체 수치 배제, 편집 전제).
 * 슬라이스 외부(views)는 CultureItem/CultureContent 만 소비하므로 이 파일은 배럴에 노출하지 않는다.
 */

/** 인재상 — 이쓰리가 지향하는 인재의 특성. group='talent' fallback 원본. */
export interface TalentTrait {
  no: string;
  title: string;
  description: string;
}

export const TALENT_TRAITS: readonly TalentTrait[] = [
  {
    no: "01",
    title: "환경을 생각하는 사람",
    description:
      "기술로 더 나은 환경을 만든다는 사명에 공감하고, 자신의 일이 사회에 미치는 가치를 고민하는 인재를 지향합니다.",
  },
  {
    no: "02",
    title: "함께 성장하는 사람",
    description:
      "동료와 지식을 나누고 서로의 성장을 응원하며, 협업 속에서 더 나은 결과를 만들어 가는 태도를 중요하게 생각합니다.",
  },
  {
    no: "03",
    title: "끊임없이 배우는 사람",
    description:
      "변화하는 기술과 환경에 열린 마음으로 도전하고, 스스로 학습하며 전문성을 키워 가는 자세를 응원합니다.",
  },
];

/** 핵심가치 — 조직이 일하는 방식의 기준. group='value' fallback 원본. */
export interface CultureValue {
  label: string;
  title: string;
  description: string;
}

export const CULTURE_VALUES: readonly CultureValue[] = [
  {
    label: "VALUE 01",
    title: "신뢰",
    description:
      "고객과 동료 사이의 약속을 지키고, 투명하게 소통하며 신뢰를 바탕으로 협업합니다.",
  },
  {
    label: "VALUE 02",
    title: "전문성",
    description:
      "환경IT 분야의 축적된 경험과 지속적인 학습으로 각자의 전문성을 깊이 있게 다집니다.",
  },
  {
    label: "VALUE 03",
    title: "도전",
    description:
      "새로운 기술과 방식에 열려 있고, 실패를 배움으로 삼아 더 나은 해법을 찾아 나섭니다.",
  },
];

/** 복지·근무환경 benefit 단건. group='welfare' fallback 원본. */
export interface WelfareBenefit {
  title: string;
  description: string;
}

/** 복지 섹션 인트로(헤더) + benefit 목록. title/description → group='welfare_intro'. */
export interface WelfareContent {
  title: string;
  description: string;
  benefits: readonly WelfareBenefit[];
}

export const WELFARE: WelfareContent = {
  title: "몰입할 수 있는 근무환경",
  description:
    "구성원이 일과 삶의 균형을 지키며 자신의 역량에 온전히 몰입할 수 있도록 다양한 제도와 문화를 만들어 가고 있습니다.",
  benefits: [
    {
      title: "일과 삶의 균형",
      description:
        "유연한 근무 문화를 통해 구성원이 각자의 리듬으로 최고의 성과를 낼 수 있도록 지원합니다.",
    },
    {
      title: "성장 지원",
      description:
        "교육·세미나 참여와 자기계발을 장려하여 구성원의 지속적인 성장을 함께합니다.",
    },
    {
      title: "함께하는 문화",
      description:
        "수평적인 소통과 다양한 사내 활동으로 서로를 이해하고 협업하는 문화를 지향합니다.",
    },
    {
      title: "건강한 일터",
      description:
        "구성원의 건강과 안정을 위한 복리후생으로 안심하고 일할 수 있는 환경을 갖춰 갑니다.",
    },
  ],
};
