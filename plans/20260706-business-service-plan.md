# 서비스소개(/business/service) 작업 계획

## 목표

About Business 두 번째 하위 페이지 "서비스소개"를 placeholder에서 실콘텐츠로 전환한다. 17개 서비스를 좌우 교차 에디토리얼 로우로 렌더링하며, 기존 사이트 톤(밴드 리듬 · Manrope 대형 타이포 · hairline 구획 · 기존 토큰)을 유지한다.

## 범위

- 레이어/슬라이스
  - `shared/lib/services.ts` (신규) — getter-seam 상수 패턴(projects.ts/history.ts 미러). 17건 시드 + `getServices()`.
  - `shared/lib/index.ts` — services export 추가.
  - `views/business-service/` (신규) — index.ts + ui/(BusinessServiceView + 서비스 로우 컴포넌트).
  - `app/(marketing)/business/service/page.tsx` — PlaceholderPage → BusinessServiceView 조립. buildMetadata 유지.
- Supabase 스키마 변경: **없음** (getter-seam 상수 패턴, admin CRUD·Storage는 후속 단계)

## 확정 방향 (사용자)

- 관리 방식: getter-seam 상수 패턴(shared/lib). 이번엔 공개 페이지만.
- 이미지: 정적/placeholder + next/image 교체 슬롯 주석. 레거시 baked-in 텍스트 이미지 사용 금지.
- optional 필드: devLanguage(없음: 05·09·10·11·17) / year(없음: 17) / description(없음: 06). 모델·UI에서 optional 처리 필수. 값 없으면 해당 항목 미출력(빈 라벨 금지).

## 데이터 소스

- 전문 17건: `C:\Users\jjunny\AppData\Local\Temp\claude\C--Users-jjunny-Desktop-ethree\b434a2b4-639e-41cb-8291-4f89c0ad857b\scratchpad\service-normalized.md`
- implementer가 이 파일을 Read해서 services.ts 시드로 전사. 원문 보존(OCR 오탈자도 그대로: `Openlayes`, `PostgresQL` 등). 순서 01→17 유지.

## 데이터 모델 (services.ts)

```ts
export interface ServiceItem {
  id: string;                  // "01".."17"
  title: string;
  summary: string;             // 컬러 태그라인
  description?: string;        // optional (06 없음)
  features: readonly string[]; // 주요서비스 불릿
  devLanguage?: string;        // optional
  year?: string;               // optional (원문 형태 다양: "2010 ~ 현재")
  imageSrc?: string;           // 관리자 업로드 대상 — 지금은 미지정(placeholder)
}
```

상단 주석: 향후 Supabase(테이블+Storage) 스왑 대비 getter-seam · OCR 추출·관리자 편집 대상 명시.

## 위임 순서

1. implementer — service-normalized.md Read → services.ts(모델+17건 시드+getter) + index.ts export, page 조립, view 스캐폴딩·배선.
2. design (Polish) — 서비스 로우 에디토리얼 레이아웃, 이미지 슬롯, summary 강조 톤(accent/olive 계열), features 불릿, optional 푸터 메타(개발언어|연도), 밴드 리듬, 토큰 정리.
3. reviewer — 토큰·FSD·getter-seam·원문 보존·optional 필드 처리·이미지 슬롯 검토.

## UI 스펙 (요약)

- 헤더: PlaceholderHeader "ABOUT BUSINESS"/"서비스소개" + PlaceholderSubNav activeHref="/business/service".
- 리드 섹션(선택): 레거시 타이틀 "환경과 융합된 다양한 솔루션 개발" 활용 가능.
- 서비스 로우(핵심): landing ServiceSection 교차 에디토리얼 로우 패턴 재사용(이미지↔텍스트 좌우 교차, 짝수행 reverse).
  - 이미지 슬롯(placeholder, next/image 교체 주석)
  - 텍스트: title(h3급) + summary(컬러 강조) + description?(있을 때만) + features 불릿 리스트
  - 푸터 메타: `개발 언어 | 사업 수행 연도` 2열(SectionLabel 소형 라벨 + 값). 없으면 미출력.
  - 17개 스캔성 고려(hairline 구획, 넉넉한 행간). 페이지네이션 스코프 밖.
- business-service 전용 로우 컴포넌트로 둔다(landing과 유사하나 features 불릿·optional 메타 추가).

## 규칙

- 토큰 하드코딩 0(기존 토큰만), content-container 강제, any 금지, Props interface, 반응형(sm:/lg:), 원문 텍스트 무변경.
- 서버 컴포넌트 기본(정적, 상호작용 없음). FSD 정방향 import, 슬라이스 index.ts 경유. 신규 색상 생성 금지(기존 토큰).

## 참조 파일

- src/views/landing/ui/ServiceSection.tsx
- src/views/business-intro/ui/* (business-areas.data.ts getter 분리 예)
- src/shared/lib/projects.ts, history.ts (getter-seam)
- src/shared/ui/{SectionLabel,Button}.tsx, src/widgets/placeholder-page/ui/*
