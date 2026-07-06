# company_info 스키마 계약 (Phase 2)

> supabase-agent 작성. implementer(FE)가 이 문서를 계약으로 참조한다.
> 마이그레이션: `supabase/migrations/20260706120000_company_info.sql`

## 테이블: `public.company_info`

싱글톤 테이블. 항상 `id = 1` 한 행만 존재한다.

| 컬럼            | 타입          | NULL | 기본값        | 설명                          |
| --------------- | ------------- | ---- | ------------- | ----------------------------- |
| `id`            | `int`         | no   | `1`           | PK, `check (id = 1)` 싱글톤   |
| `name`          | `text`        | no   | `''`          | 회사명(한글)                  |
| `name_en`       | `text`        | no   | `''`          | 브랜드명(영문)                |
| `legal_name`    | `text`        | no   | `''`          | 법인명                        |
| `ceo`           | `text`        | no   | `''`          | 대표자                        |
| `url`           | `text`        | no   | `''`          | 사이트 URL                    |
| `tagline`       | `text`        | no   | `''`          | 슬로건                        |
| `description`   | `text`        | no   | `''`          | 회사 소개                     |
| `address_line1` | `text`        | no   | `''`          | 주소 1행                      |
| `address_line2` | `text`        | no   | `''`          | 주소 2행                      |
| `tel`           | `text`        | no   | `''`          | 전화                          |
| `fax`           | `text`        | no   | `''`          | 팩스                          |
| `email`         | `text`        | no   | `''`          | 이메일(SITE에 없어 시드 `''`) |
| `copyright`     | `text`        | no   | `''`          | 카피라이트                    |
| `updated_at`    | `timestamptz` | no   | `now()`       | 수정 시각(트리거 자동 갱신)   |

- 모든 텍스트 컬럼은 `not null default ''` — FE에서 `null` 방어 불필요(단, 행 자체가 없거나 쿼리 에러인 경우는 fallback 필요, 아래 참조).
- `before update` 트리거가 매 update 시 `updated_at`을 `now()`로 자동 갱신한다. FE는 `updated_at`을 payload에 넣지 않는다.

## RLS 정책 (인가 경계)

RLS 활성화됨. 정책 요약:

| 작업     | 정책명         | 대상 롤              | 허용 여부                             |
| -------- | -------------- | -------------------- | ------------------------------------- |
| `SELECT` | `public_read`  | `anon`,`authenticated` | 전체 허용 (공개 사이트 읽기)        |
| `UPDATE` | `admin_update` | `authenticated`      | 허용, `with check (id = 1)`           |
| `INSERT` | (없음)         | —                    | 런타임 전부 거부 (싱글톤 유지)        |
| `DELETE` | (없음)         | —                    | 런타임 전부 거부 (삭제 불가)          |

- **읽기**: 인증 없이 공개. 공개 사이트(footer/header)가 anon으로 조회한다.
- **쓰기(update)**: `authenticated` 세션만. Server Action은 `createServerSupabaseClient()`의 인증된 세션으로 RLS를 통과한다. **`service_role` 키 사용 금지** — service_role은 RLS를 우회하므로 인가 경계가 무너진다. 반드시 사용자 세션 기반 클라이언트로 update.
- **seed insert**: 마이그레이션(SQL Editor owner 컨텍스트)에서만 삽입. 런타임 insert 정책이 없으므로 앱에서 새 행을 만들 수 없다.

## Supabase 조회 방식

단건(싱글톤) 조회. `id = 1` 고정 + `.single()`.

```ts
const { data, error } = await supabase
  .from("company_info")
  .select(
    "name, name_en, legal_name, ceo, url, tagline, description, address_line1, address_line2, tel, fax, email, copyright"
  )
  .eq("id", 1)
  .single();
```

## FE 반환 shape 매핑 계약 (`getCompanyInfo`)

DB flat(snake_case) → nested camelCase. plan의 "반환 shape 계약"과 동일.

| DB 컬럼 (snake)  | 반환 shape 경로 (camel) |
| ---------------- | ----------------------- |
| `name`           | `name`                  |
| `name_en`        | `nameEn`                |
| `legal_name`     | `legalName`             |
| `ceo`            | `ceo`                   |
| `url`            | `url`                   |
| `tagline`        | `tagline`               |
| `description`    | `description`           |
| `address_line1`  | `address.line1`         |
| `address_line2`  | `address.line2`         |
| `tel`            | `contact.tel`           |
| `fax`            | `contact.fax`           |
| `email`          | `contact.email`         |
| `copyright`      | `copyright`             |

반환 타입(=`SITE`와 동일 nested shape):

```ts
{
  name, nameEn, legalName, ceo, url, tagline, description,
  address: { line1, line2 },
  contact: { tel, fax, email },
  copyright
}
```

역방향(Server Action update payload): 폼(camel/nested) → DB flat(snake) 로 재매핑하여 `.update({...}).eq('id', 1)`. `id`, `updated_at`은 payload에서 제외.

## fallback 계약 (필수)

`getCompanyInfo`는 다음 경우 반드시 `SITE`(`src/shared/constants/site.ts`)로 폴백한다:

- 테이블 미존재(마이그레이션 미실행) / Supabase 키 미연결
- 쿼리 `error` 발생 / `data` 없음(행 없음)

즉 마이그레이션을 아직 실행하지 않은 상태에서도 `npm run build`와 공개 사이트 렌더가 정상이어야 한다.

`email`은 SITE에 없으므로: DB 값이 있으면 그 값, 없으면 `''`. (SITE fallback 시에도 `contact.email`은 `''` 처리)

## 타입 생성 커맨드 (implementer)

```bash
npx supabase gen types typescript --local > src/shared/types/supabase.ts
```

로컬 Supabase 미기동이면 `--project-id <ref>` 방식 사용. 타입 생성 전이라면 `company_info` 반환 타입은 위 매핑표 기준으로 수동 interface를 `features/company-info/model`에 정의(추후 gen types로 대체).

## implementer 주의사항

- **service_role 키 클라이언트/RLS 우회 금지**: update는 인증 세션(authenticated)으로만. service_role은 서버 전용이며 이 기능에는 사용하지 않는다.
- **배럴 서버유출 금지**: `getCompanyInfo`(서버 getter)와 Server Action은 `next/headers` 경유 서버 전용. 클라 폼에서 서버 export를 import하지 않도록 `features/company-info/index.ts`에서 서버/클라 export 분리.
- update payload에 `id`/`updated_at` 넣지 않기(트리거가 갱신, id는 고정).
- 싱글톤이므로 새 행 insert/delete 시도 금지 — 정책상 런타임에서 거부된다.
