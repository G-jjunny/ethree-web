# Culture(기업문화) 스키마 계약

> supabase-agent 작성. implementer/reviewer 가 참조하는 DB 계약 문서.
> 원본 마이그레이션: `supabase/migrations/20260707140000_culture.sql`
> 실행: Supabase 대시보드 > SQL Editor 에 파일 내용을 붙여넣어 owner 컨텍스트로 실행.
> seed 원본: `src/views/support-culture/ui/support-culture.data.ts`

## 테이블 목록

| 테이블                 | 설명                                                        |
| ---------------------- | ----------------------------------------------------------- |
| `public.culture_items` | 기업문화 콘텐츠. `group` 으로 인재상/핵심가치/복지/복지인트로 구분 (단일 테이블) |

단일 테이블 설계. 별도 `culture_sections` 소테이블을 만들지 않았다(아래 "WELFARE 인트로 처리" 참조).

## `public.culture_items` 컬럼

| 컬럼          | 타입          | nullable | 기본값              | 설명                                                                 |
| ------------- | ------------- | -------- | ------------------- | -------------------------------------------------------------------- |
| `id`          | `uuid`        | no       | `gen_random_uuid()` | PK                                                                   |
| `group`       | `text`        | no       | —                   | 섹션 구분. **SQL 예약어 → DDL/DML 에서 `"group"` 인용**. CHECK 제약   |
| `sort_order`  | `int`         | no       | `0`                 | group 내 정렬(1-based). `(group, sort_order)` **unique**             |
| `title`       | `text`        | no       | —                   | 항목 제목 (welfare_intro 는 섹션 헤더 제목)                          |
| `description` | `text`        | no       | —                   | 항목 설명. 현재 전 항목 보유하므로 NOT NULL                          |
| `label`       | `text`        | **yes**  | `null`              | 표시 배지. talent="01".. / value="VALUE 01".. / welfare·intro=NULL   |
| `image_url`   | `text`        | **yes**  | `null`              | Storage(culture-images) public URL. seed 는 NULL                    |
| `created_at`  | `timestamptz` | no       | `now()`             | 생성 시각                                                            |
| `updated_at`  | `timestamptz` | no       | `now()`             | BEFORE UPDATE 트리거로 자동 갱신                                     |

제약:

- `culture_items_group_check` — `"group" in ('talent','value','welfare','welfare_intro')`
- `culture_items_group_sort_unique` — `unique ("group", sort_order)` (정렬 안정성 + seed 충돌 키)
- 이 unique 제약이 `(group, sort_order)` 인덱스를 겸하므로 섹션별 정렬 조회에 그대로 사용된다(별도 인덱스 없음).

> ⚠️ `group` 은 예약어다. Supabase JS 에서는 `.eq('group', 'talent')` 처럼 문자열 키라 문제 없으나,
> 원시 SQL 을 쓸 경우 반드시 `"group"` 으로 인용할 것.

## group 허용값 ↔ 화면 섹션 매핑

| `group`         | 화면 섹션                   | 카디널리티 | 비고                                             |
| --------------- | --------------------------- | ---------- | ------------------------------------------------ |
| `talent`        | 인재상 (TALENT_TRAITS)      | 다건(현재 3) | `label` = "01","02","03"                         |
| `value`         | 핵심가치 (CULTURE_VALUES)   | 다건(현재 3) | `label` = "VALUE 01".. (IconCard 그리드)         |
| `welfare`       | 복지·근무환경 benefit 카드  | 다건(현재 4) | `label` = NULL                                   |
| `welfare_intro` | 복지 섹션 **헤더 텍스트**   | 단건(1)      | title/description = 섹션 인트로. `label` = NULL   |

## support-culture.data.ts 필드 → DB 컬럼 매핑

| data.ts 소스                     | 필드          | DB `group`      | DB 컬럼        | 비고                              |
| -------------------------------- | ------------- | --------------- | -------------- | --------------------------------- |
| `TALENT_TRAITS[].no`             | `no`          | `talent`        | `label`        | "01".."03" 그대로 label 로 흡수   |
| `TALENT_TRAITS[].title`          | `title`       | `talent`        | `title`        |                                   |
| `TALENT_TRAITS[].description`    | `description` | `talent`        | `description`  |                                   |
| `CULTURE_VALUES[].label`         | `label`       | `value`         | `label`        | "VALUE 01".. 그대로               |
| `CULTURE_VALUES[].title`         | `title`       | `value`         | `title`        |                                   |
| `CULTURE_VALUES[].description`   | `description` | `value`         | `description`  |                                   |
| `WELFARE.title`                  | —             | `welfare_intro` | `title`        | 섹션 헤더 제목                    |
| `WELFARE.description`            | —             | `welfare_intro` | `description`  | 섹션 헤더 설명                    |
| `WELFARE.benefits[].title`       | `title`       | `welfare`       | `title`        |                                   |
| `WELFARE.benefits[].description` | `description` | `welfare`       | `description`  |                                   |

- `no`(talent)와 `label`(value)를 **동일한 `label` 컬럼**으로 통합했다. FE 는 `label` 이 있으면 배지로 렌더하면 되고, 굳이 sort_order 파생 로직을 둘 필요가 없다(가장 충실·유연한 매핑).
- `image_url` 은 data.ts 에 없던 신규 필드. seed 는 전부 NULL, 관리자가 업로드 시 채운다.

## WELFARE 인트로 처리 방식과 근거

**결정: 별도 소테이블(culture_sections)을 만들지 않고, `culture_items` 에 전용 `group='welfare_intro'` 단일 행으로 흡수.**

근거:

1. 사용자 요구가 "각 내용을 관리자가 수정 및 추가"이므로 인트로도 **편집 가능**해야 한다 → 상수 유지(option c) 배제.
2. news/company_info 의 단일 테이블 톤을 유지하고 과설계를 피하기 위해, 소테이블 신설(중복 트리거·중복 RLS 4정책)을 하지 않았다 → 별도 테이블(option a) 배제.
3. group CHECK 값 확장만으로 인트로를 흡수(option b). getter 는 `welfare_intro` 그룹의 단일 행을 섹션 헤더로 꺼내면 된다.

FE 함의:

- 인트로는 **항상 1행**으로 취급(추가 UI 없이 수정만 노출 권장). 조회 시 `welfare_intro` 그룹에서 `sort_order=1` 단건을 읽는다.
- 인트로 행이 없을 경우(삭제되었거나 미시드) FE 는 fallback 상수(WELFARE.title/description)로 렌더.

## RLS 정책 요약

RLS 활성화됨. 정책 없는 경로는 전부 거부(seed 는 SQL Editor owner 컨텍스트에서 RLS 우회).

| 정책            | 대상 롤            | 액션   | 조건                       |
| --------------- | ------------------ | ------ | -------------------------- |
| `public_read`   | anon, authenticated | SELECT | `true` (전량 공개, 초안 없음) |
| `admin_insert`  | authenticated      | INSERT | `with check (true)`        |
| `admin_update`  | authenticated      | UPDATE | `using/with check (true)`  |
| `admin_delete`  | authenticated      | DELETE | `using (true)`             |

FE 함의:

- **공개 getter** 는 anon 서버 클라이언트로 조회 → 전량 반환(news 의 published 필터와 달리 초안 개념 없음).
- **관리자 콘솔** getter/mutation 은 로그인 세션(`createServerSupabaseClient()`) 사용, write 전 `getUser()` 로 인가 재확인.
- **service_role 키 사용 금지**(클라 노출 금지). 모든 write 는 authenticated 세션 RLS 로 통과.

## Storage 버킷 `culture-images`

- `public = true` 버킷. read 는 anon+authenticated 공개, write(insert/update/delete)는 authenticated 만.
- 정책은 모두 `bucket_id = 'culture-images'` 로 스코프 (news-images 정책 미러).

### 업로드 경로 규칙 (권장)

```
culture/{uuid}.{ext}
```

- 예: `culture/3f2a1c9e-....webp`. 파일명은 클라 원본명 대신 새 uuid(충돌·경로주입 방지).
- ext 화이트리스트(`png|jpg|jpeg|webp|gif|avif`) 권장.
- 항목과 강결합 불필요(교체 시 새 파일 업로드 후 URL 만 갱신). 고아 파일 정리는 후순위.

### public URL 획득

```ts
const { data } = supabase.storage.from("culture-images").getPublicUrl(path);
// data.publicUrl 을 culture_items.image_url 로 저장
await supabase.storage
  .from("culture-images")
  .upload(`culture/${uuid}.${ext}`, file, { upsert: false });
```

- 인증 세션(authenticated)에서만 업로드 성공. 공개 사이트는 getPublicUrl 로 읽기만.

## FE 반환 shape 권장 매핑 (snake_case row → camelCase)

row 도메인 타입(개별 항목):

```ts
export type CultureGroup = "talent" | "value" | "welfare" | "welfare_intro";

export interface CultureItem {
  id: string;              // ← culture_items.id (uuid)
  group: CultureGroup;     // ← culture_items.group
  sortOrder: number;       // ← culture_items.sort_order
  title: string;           // ← culture_items.title
  description: string;     // ← culture_items.description
  label: string | null;    // ← culture_items.label
  imageUrl: string | null; // ← culture_items.image_url
}
```

공개 페이지 소비용으로는 group 별로 묶은 집계 shape 를 getter 가 반환하면 편하다(뷰가 기존 정적 구조와 1:1):

```ts
export interface CultureContent {
  talent: CultureItem[];               // group='talent', sortOrder asc
  values: CultureItem[];               // group='value',  sortOrder asc
  welfare: CultureItem[];              // group='welfare', sortOrder asc
  welfareIntro: CultureItem | null;    // group='welfare_intro' 단건
}
```

- 조회 권장: `select *`(컬럼 적어 페이로드 부담 없음) `order by "group", sort_order`.
- fallback: 미연결/에러 시 support-culture.data.ts 상수로 동일 shape 구성(TALENT_TRAITS→talent, CULTURE_VALUES→values, WELFARE.benefits→welfare, WELFARE.title/description→welfareIntro).
- `label` 렌더 규칙: 값이 있으면 배지 표시(talent/value), NULL 이면 미표시(welfare/intro).

## seed 내용 요약과 충돌 키

- 총 **11행**: talent 3 + value 3 + welfare_intro 1 + welfare 4.
- 값은 support-culture.data.ts 현재 텍스트 전량 이관, `image_url` 은 전부 NULL.
- **충돌 키: `(group, sort_order)`** — `on conflict ("group", sort_order) do nothing` 로 재실행 안전.
  title 은 편집 대상이라 충돌 키로 부적합, `(group, sort_order)` 가 안정적.

## 타입 생성 커맨드

스키마 적용(SQL 실행) 후 implementer 가 실행:

```bash
npx supabase gen types typescript --local > src/shared/types/supabase.ts
```

(로컬 supabase 미사용 시 `--project-id {ref}` 로 원격 대상 생성)

## implementer 주의사항

1. 공개 getter 는 anon 서버 클라. 전량 반환(published 필터 없음). group 별로 묶어 `CultureContent` 구성.
2. `welfare_intro` 는 항상 단건으로 취급 — 관리 UI 에서 "추가"는 막고 수정만 노출 권장.
3. 관리자 write 는 authenticated 세션 + Server Action 내부 `getUser()` 인가. **service_role 금지**.
4. 마이그레이션 미적용/미연결 상황에서도 fallback(정적 상수)으로 빌드·렌더 정상 유지.
5. 이미지 업로드 경로 `culture/{uuid}.{ext}`, ext 화이트리스트. public URL 은 getPublicUrl 로 획득해 `image_url` 저장.
6. `group` 은 SQL 예약어 — Supabase JS 문자열 키(`.eq('group', ...)`)는 안전, 원시 SQL 은 `"group"` 인용.
7. 새 항목 추가 시 `sort_order` 는 해당 group 의 `max(sort_order)+1` 로 부여(unique 충돌 방지).

## 사용자가 실행할 마이그레이션 파일 경로

```
supabase/migrations/20260707140000_culture.sql
```

Supabase 대시보드 > SQL Editor 에 위 파일 내용을 붙여넣어 실행(owner 컨텍스트, RLS 우회 → seed 성공).
