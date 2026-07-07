# Careers(인재채용 이메일 전송) 스키마 계약

> supabase-agent 작성. implementer/reviewer 가 참조하는 DB 계약 문서.
> 원본 마이그레이션: `supabase/migrations/20260707150000_careers.sql`
> 실행: Supabase 대시보드 > SQL Editor 에 파일 내용을 붙여넣어 owner 컨텍스트로 실행.
> 관련 계획: `plans/20260707-careers-email-plan.md`

## 테이블 목록

| 테이블                         | 설명                                                   |
| ------------------------------ | ------------------------------------------------------ |
| `public.careers_submissions`   | 방문자 지원/문의 제출 내역(다건). 관리자 목록 확인.    |
| `public.careers_settings`      | 수신 이메일 설정(싱글톤 id=1). 발송 대상/발신 주소.    |

## `public.careers_submissions` 컬럼

| 컬럼         | 타입          | nullable | 기본값              | 설명                                                          |
| ------------ | ------------- | -------- | ------------------- | ------------------------------------------------------------- |
| `id`         | `uuid`        | no       | `gen_random_uuid()` | PK                                                            |
| `name`       | `text`        | no       | —                   | 지원자/문의자 이름                                           |
| `email`      | `text`        | no       | —                   | 회신 이메일 주소                                            |
| `message`    | `text`        | no       | —                   | 지원/문의 내용                                              |
| `email_sent` | `boolean`     | no       | `false`             | Resend 발송 성공 여부. 발송 결과를 확정해 INSERT 시 기록     |
| `created_at` | `timestamptz` | no       | `now()`             | 제출 시각                                                   |

제약/인덱스:

- 인덱스 `idx_careers_submissions_created_at` — `(created_at desc)`. 관리자 목록 최신순 조회용.

## `public.careers_settings` 컬럼 (싱글톤)

| 컬럼              | 타입          | nullable | 기본값  | 설명                                                              |
| ----------------- | ------------- | -------- | ------- | ----------------------------------------------------------------- |
| `id`              | `int`         | no       | `1`     | PK. `check (id = 1)` 싱글톤 강제                                  |
| `recipient_email` | `text`        | no       | `''`    | 발송 수신 주소. 관리자가 설정. 초기 빈 문자열                     |
| `from_email`      | `text`        | **yes**  | `null`  | 발신 주소(선택). 미설정 시 Route Handler 가 env/테스트 발신 사용  |
| `updated_at`      | `timestamptz` | no       | `now()` | BEFORE UPDATE 트리거로 자동 갱신                                  |

제약:

- `careers_settings_singleton` — `check (id = 1)`. 오직 1행만 존재.
- seed 로 `id=1, recipient_email='', from_email=null` 1행 생성(`on conflict (id) do nothing`).

## RLS 정책 요약

두 테이블 모두 RLS 활성화. 정책 없는 경로는 전부 거부(seed 는 SQL Editor owner 컨텍스트에서 RLS 우회).

### `careers_submissions`

| 정책            | 대상 롤              | 액션   | 조건                      |
| --------------- | -------------------- | ------ | ------------------------- |
| `public_insert` | anon, authenticated  | INSERT | `with check (true)`       |
| `admin_read`    | authenticated        | SELECT | `using (true)`            |
| `admin_update`  | authenticated        | UPDATE | `using/with check (true)` |
| `admin_delete`  | authenticated        | DELETE | `using (true)`            |

- **anon 은 INSERT 만 가능**(공개 폼 제출). SELECT/UPDATE/DELETE 정책이 anon 을 포함하지 않으므로 anon 의 그 액션은 모두 거부.
- 전제: Route Handler 가 zod 검증 후 삽입한다(정책은 `with check (true)` 로 열려 있으므로 검증은 애플리케이션 책임).

### `careers_settings`

| 정책           | 대상 롤        | 액션   | 조건                     |
| -------------- | -------------- | ------ | ------------------------ |
| `admin_read`   | authenticated  | SELECT | `using (true)`           |
| `admin_update` | authenticated  | UPDATE | `using (true) with check (id = 1)` |

- **anon SELECT 미허용** → 수신 주소(recipient_email) 비노출. 아래 "settings 읽기 방식" 참조.
- INSERT/DELETE 정책 없음(의도적) → 싱글톤 유지(런타임 추가/삭제 거부). seed 로만 생성.

## settings 읽기 방식 결정 (채택 = b)

**결정: anon SELECT 미허용 + Route Handler 는 service_role 서버 전용 클라이언트로 settings 읽기.**

근거:

1. `recipient_email` 은 발송 수신 주소로, 공개 노출이 바람직하지 않다(스팸·수신자 노출 우려). anon SELECT 를 열면 브라우저에서 anon 키로 직접 조회 가능해지므로 배제.
2. Route Handler(`/api/careers`)는 서버 전용이므로 service_role 키를 안전하게 사용할 수 있다. service_role 은 RLS 를 우회하므로 anon 정책과 무관하게 settings 를 읽는다.
3. 관리자 콘솔 getter 는 authenticated 세션으로 읽으므로 `admin_read`(authenticated SELECT)로 충분히 커버된다.

## email_sent 확정 방식 결정 (채택 = insert 1회)

**결정: 발송 결과를 확정해 INSERT 한 번으로 기록. 별도 UPDATE 단계 없음.**

근거: anon write 표면을 INSERT 로만 한정할 수 있어 단순·안전하다. anon UPDATE 정책이 불필요해진다.

## Route Handler 삽입·발송 흐름 계약 (implementer 구현 기준)

`POST /api/careers` 흐름(권장 순서):

```
1. body 파싱 → zod 검증(name/email/message). 실패 시 400.
2. settings 읽기: service_role 클라이언트로 careers_settings(id=1) 조회
   → recipient_email, from_email 획득.
   (anon 세션 클라로는 settings SELECT 불가 — 위 RLS 참조.)
3. 이메일 발송:
   - recipient_email 이 빈 문자열이면 발송 스킵(graceful). email_sent = false.
   - RESEND_API_KEY 미설정/미연결/발송 예외도 graceful 스킵. email_sent = false.
   - 발송 성공 시 email_sent = true.
   - 본문에 사용자 입력 삽입 시 HTML 이스케이프/새니타이즈(계획서 제약).
4. 저장: 위에서 확정한 email_sent 값을 담아 careers_submissions 에 INSERT 1회.
   - 저장 클라이언트 선택(둘 다 정책상 허용):
     (권장) service_role 로 INSERT — settings 읽기와 동일 서버 클라 재사용, 일관성.
     (대안) anon 서버 클라로 INSERT — public_insert 정책으로 허용됨.
   - 저장은 발송 성공 여부와 무관하게 항상 수행(제출 유실 방지).
5. 응답: 저장 성공 시 200/201. 발송 스킵/실패여도 저장됐다면 성공 응답(emailSent 플래그로 구분 가능).
```

- **핵심**: 발송 → 결과로 `email_sent` 확정 → INSERT 1회. 삽입 후 UPDATE 하지 않는다.
- 관리자 콘솔의 UPDATE 정책(`admin_update`)은 관리자가 목록에서 발송 여부를 수동 정정하는 용도로만 존재. Route Handler 는 UPDATE 를 쓰지 않는다.

## service_role 사용 여부와 이유

- **settings 읽기: service_role 필요**(서버 전용, Route Handler 만). anon SELECT 를 막았기 때문에 Route Handler 가 recipient_email 을 읽으려면 service_role 로 RLS 를 우회해야 한다.
- **submissions INSERT: service_role 불필요**(anon `public_insert` 정책으로 가능). 다만 settings 읽기용 service_role 클라를 이미 만들었으므로 INSERT 도 동일 클라로 통일하는 것을 권장(일관성). anon 서버 클라로 INSERT 해도 무방.
- **email_sent 기록: service_role 불필요**(INSERT 시점에 값 확정 → UPDATE 없음).
- **service_role 키는 서버 전용. Route Handler(및 서버 코드)에서만 사용. 클라이언트 노출 절대 금지.**
  환경변수: `SUPABASE_SERVICE_ROLE_KEY`(계획서/CLAUDE.md 규정). 클라 번들에 포함되지 않도록 서버 전용 모듈에서만 import.

## 관리자 콘솔 접근 (authenticated)

- 제출 목록 getter: authenticated 세션(`createServerSupabaseClient()`)으로 `careers_submissions` 를 `created_at desc` 로 조회(`admin_read`).
- 수신 설정 getter/update: authenticated 세션으로 `careers_settings(id=1)` SELECT/UPDATE(`admin_read`/`admin_update`). write 전 Server Action 내부 `getUser()` 인가 재확인(company-info 패턴).
- 발송 여부 수동 정정(선택 기능): `admin_update` 로 `email_sent` 갱신 가능.

## FE 반환 shape 권장 매핑 (snake_case row → camelCase)

```ts
export interface CareersSubmission {
  id: string;          // ← careers_submissions.id (uuid)
  name: string;        // ← careers_submissions.name
  email: string;       // ← careers_submissions.email
  message: string;     // ← careers_submissions.message
  emailSent: boolean;  // ← careers_submissions.email_sent
  createdAt: string;   // ← careers_submissions.created_at (ISO)
}

export interface CareersSettings {
  recipientEmail: string;      // ← careers_settings.recipient_email
  fromEmail: string | null;    // ← careers_settings.from_email
  updatedAt: string;           // ← careers_settings.updated_at (ISO)
}
```

## fallback 지침 (테이블 미존재/미연결 시 안전 반환)

- 제출 목록 getter: 조회 에러(테이블 없음/미연결) 시 **빈 배열 `[]`** 반환. 관리자 페이지는 "제출 없음" 상태로 정상 렌더.
- settings getter: 조회 에러/행 없음 시 **기본 settings**(`{ recipientEmail: '', fromEmail: null, updatedAt: '' }`) 반환. 폼은 빈 값으로 렌더.
- Route Handler: settings 미연결/RESEND_API_KEY 미설정에서도 저장은 시도하되, 발송은 graceful 스킵(email_sent=false). 전 구간에서 빌드·렌더·제출저장 정상 유지.

## 타입 생성 커맨드

스키마 적용(SQL 실행) 후 implementer 가 실행:

```bash
npx supabase gen types typescript --local > src/shared/types/supabase.ts
```

(로컬 supabase 미사용 시 `--project-id {ref}` 로 원격 대상 생성)

## implementer 주의사항

1. **settings 읽기는 Route Handler 에서 service_role 로만.** anon 세션 클라로는 settings SELECT 가 거부된다(RLS). service_role 키는 서버 전용, 클라 노출 금지.
2. **email_sent 는 INSERT 시점에 확정**(발송 → 결과 → insert 1회). 삽입 후 UPDATE 금지. UPDATE 정책은 관리자 수동 정정용.
3. submissions INSERT 는 anon 정책으로도 되지만, service_role 클라로 통일 권장(settings 읽기와 동일 클라).
4. 저장은 발송 성공/실패와 무관하게 항상 수행(제출 유실 방지). recipient 미설정·발송 실패는 graceful 스킵.
5. 이메일 본문에 사용자 입력 삽입 시 HTML 이스케이프/새니타이즈(계획서 제약).
6. 관리자 콘솔 write 는 authenticated 세션 + Server Action 내부 `getUser()` 인가 재확인.
7. 미연결/에러 시 getter 는 빈 배열/기본 settings 로 안전 반환(빌드·렌더 정상).

## 사용자가 실행할 마이그레이션 파일 경로

```
supabase/migrations/20260707150000_careers.sql
```

Supabase 대시보드 > SQL Editor 에 위 파일 내용을 붙여넣어 실행(owner 컨텍스트, RLS 우회 → seed 성공).
