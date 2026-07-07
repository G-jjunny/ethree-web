# News 스키마 계약

> supabase-agent 작성. implementer/reviewer 가 참조하는 DB 계약 문서.
> 원본 마이그레이션: `supabase/migrations/20260707120000_news.sql`
> 실행: Supabase 대시보드 > SQL Editor 에 파일 내용을 붙여넣어 owner 컨텍스트로 실행.

## 테이블 목록

| 테이블         | 설명                                          |
| -------------- | --------------------------------------------- |
| `public.news`  | 블로그형 뉴스 콘텐츠. body 는 TipTap doc JSON |

## `public.news` 컬럼

| 컬럼              | 타입          | nullable | 기본값                | 설명                                                    |
| ----------------- | ------------- | -------- | --------------------- | ------------------------------------------------------- |
| `id`              | `uuid`        | no       | `gen_random_uuid()`   | PK                                                      |
| `slug`            | `text`        | no       | —                     | URL 슬러그. **unique**. `/support/news/[slug]` 라우트   |
| `title`           | `text`        | no       | —                     | 제목                                                    |
| `excerpt`         | `text`        | **yes**  | `null`                | 목록 카드용 발췌. 없으면 FE 에서 생략 또는 body 파생     |
| `body`            | `jsonb`       | no       | `'{}'::jsonb`         | TipTap doc JSON. 렌더 시 서버에서 HTML 변환 + 새니타이즈 |
| `cover_image_url` | `text`        | **yes**  | `null`                | 커버 이미지 public URL (news-images 버킷)               |
| `published`       | `boolean`     | no       | `false`               | true 일 때만 anon 노출                                   |
| `published_at`    | `timestamptz` | **yes**  | `null`                | 공개 시각. 목록 정렬/표시 날짜 소스                      |
| `created_at`      | `timestamptz` | no       | `now()`               | 생성 시각                                               |
| `updated_at`      | `timestamptz` | no       | `now()`               | BEFORE UPDATE 트리거로 자동 갱신                         |

인덱스:

- `news_slug_key` — slug unique (자동)
- `idx_news_published_at` — `(published_at desc)`
- `idx_news_published_published_at` — `(published, published_at desc)` 공개 목록 조회용

## RLS 정책 요약

RLS 활성화됨. 정책 없는 경로는 전부 거부(seed 는 SQL Editor owner 컨텍스트에서 RLS 우회).

| 정책                | 대상 롤        | 액션   | 조건                            |
| ------------------- | -------------- | ------ | ------------------------------- |
| `public_read`       | anon           | SELECT | `published = true`              |
| `admin_read`        | authenticated  | SELECT | `true` (초안 포함 전체)         |
| `admin_insert`      | authenticated  | INSERT | `with check (true)`             |
| `admin_update`      | authenticated  | UPDATE | `using/with check (true)`       |
| `admin_delete`      | authenticated  | DELETE | `using (true)`                  |

FE 함의:

- **공개 getter** 는 anon 서버 클라이언트로 조회 → RLS 가 자동으로 `published=true` 만 반환.
  추가로 `.eq('published', true)` 를 걸어도 무방(방어적). 초안은 애초에 노출되지 않음.
- **관리자 콘솔** getter/mutation 은 `createServerSupabaseClient()`(로그인 세션) 사용 →
  authenticated 롤로 전체 조회 및 write 가능. write 전 `getUser()` 로 인가 재확인.
- service_role 키 사용 금지(클라 노출 금지). 모든 write 는 authenticated 세션 RLS 로 통과.

## Storage 버킷 `news-images`

- `public = true` 버킷. read 는 anon+authenticated 공개, write(insert/update/delete)는 authenticated 만.
- 정책은 모두 `bucket_id = 'news-images'` 로 스코프.

### 업로드 경로 규칙 (권장)

```
news/{uuid}.{ext}
```

- 예: `news/3f2a1c9e-....png`. 파일명은 클라이언트 원본명 대신 새 uuid 로 생성(충돌·경로주입 방지).
- ext 는 화이트리스트(`png|jpg|jpeg|webp|gif|avif`)로 제한 권장.
- 뉴스 단건과 강결합할 필요는 없음(커버 교체 시 새 파일 업로드 후 URL 만 갱신). 고아 파일 정리는 후순위.

### public URL 획득

```ts
const { data } = supabase.storage.from("news-images").getPublicUrl(path);
// data.publicUrl 을 news.cover_image_url 또는 body 내 image src 로 저장
```

- 업로드:
  ```ts
  await supabase.storage
    .from("news-images")
    .upload(`news/${uuid}.${ext}`, file, { upsert: false });
  ```
- 인증 세션(authenticated)에서만 성공. 공개 사이트는 getPublicUrl 로 읽기만.

## FE 반환 shape 권장 매핑 (snake_case row → camelCase `NewsItem`)

기존 `NewsItem`(id/slug/title/date)을 확장한다.

```ts
export interface NewsItem {
  id: string; // ← news.id (uuid)
  slug: string; // ← news.slug
  title: string; // ← news.title
  date: string; // ← news.published_at ?? news.created_at 를 YYYY-MM-DD 로 파생
  excerpt: string | null; // ← news.excerpt
  coverImageUrl: string | null; // ← news.cover_image_url
  body: TiptapDoc; // ← news.body (jsonb) — 상세에서만 사용, 목록은 생략 가능
}
```

매핑 규칙:

| NewsItem 필드   | DB 컬럼                                    | 비고                                              |
| --------------- | ------------------------------------------ | ------------------------------------------------- |
| `id`            | `id`                                       | uuid 문자열                                       |
| `slug`          | `slug`                                     |                                                   |
| `title`         | `title`                                    |                                                   |
| `date`          | `published_at ?? created_at` → `YYYY-MM-DD` | 표시/정렬용. published 만 노출되므로 보통 published_at 존재 |
| `excerpt`       | `excerpt`                                  | nullable                                          |
| `coverImageUrl` | `cover_image_url`                          | nullable                                          |
| `body`          | `body`                                     | jsonb. 목록 쿼리에서는 select 제외 권장(페이로드 절감) |

- 목록 select 권장: `id, slug, title, excerpt, cover_image_url, published_at, created_at`
- 상세 select 권장: 위 + `body`

## slug 규칙

- **unique, not null**. 소문자 + 하이픈(kebab-case) 권장. 예: `8th-climate-seminar-completed`.
- 자동생성 힌트: 제목 기반 slugify 후 중복 시 접미사(`-2`, `-3`) 부여, 또는 관리자 수동 입력.
  한글 제목은 자동 slugify 가 비어질 수 있으므로 폼에서 slug 필드를 별도 입력(필수)받는 것을 권장.
- slug 변경은 기존 URL 파기(리다이렉트 고려). 발행 후 변경 지양.

## body (TipTap doc JSON)

- 최소 유효 형태(seed 사용값):
  ```json
  { "type": "doc", "content": [{ "type": "paragraph" }] }
  ```
- 저장 원본은 JSON(정규화된 구조), 렌더는 서버에서 `@tiptap/html` `generateHTML(doc, extensions)` →
  `isomorphic-dompurify` 로 **반드시 새니타이즈** 후 출력(XSS 방지). 클라 저장값을 신뢰하지 않는다.
- 빈/손상 body 방어: 파싱 실패 또는 `type !== 'doc'` 이면 빈 문단으로 폴백.

## 타입 생성 커맨드

스키마 적용(SQL 실행) 후 implementer 가 실행:

```bash
npx supabase gen types typescript --local > src/shared/types/supabase.ts
```

(로컬 supabase 미사용 시 `--project-id {ref}` 로 원격 대상 생성)

## implementer 주의사항

1. 공개 getter 는 anon 서버 클라(RLS 로 published 자동 필터). 그래도 `.eq('published', true)` 방어적 추가 권장.
2. 관리자 write 는 authenticated 세션 + Server Action 내부 `getUser()` 인가. service_role 금지.
3. 마이그레이션 미적용/미연결 상황에서도 fallback(빈 목록 / notFound)로 빌드·렌더 정상 유지.
4. body 렌더 전 새니타이즈 필수(위 참조). 목록 쿼리는 body 제외해 페이로드 절감.
5. 이미지 업로드 경로 `news/{uuid}.{ext}`, ext 화이트리스트. public URL 은 getPublicUrl 로 획득해 저장.
6. `date` 는 DB 파생 필드(순수 저장 컬럼 아님) — 매핑 함수에서 `published_at ?? created_at` 로 계산.
