/**
 * features/news Public API.
 *
 * ⚠️ 배럴 서버/클라 유출 경계 (company-info/index.ts 주석과 동일 원리)
 * 이 배럴은 서버 전용 getter(unstable_cache · next/headers · anon/세션 서버 클라이언트),
 * Server Action('use server'), 서버 렌더 유틸(renderNewsBody), 그리고 클라이언트
 * 컴포넌트(NewsForm/NewsEditor/NewsAdminTable)를 함께 노출한다. 배럴에서 무엇이든
 * import하면 번들러가 배럴 모듈 그래프 전체(=서버 전용 코드)를 끌어오므로,
 * **이 배럴은 서버 컴포넌트(page/view)에서만 소비한다.**
 *
 * 클라이언트 컴포넌트(NewsForm/NewsEditor/NewsAdminTable)는 이 배럴을 import하지 않고
 * 필요한 model/Server Action/lib를 하위 파일에서 직접 import한다(각 파일 상단 주석 참조).
 */

// 서버 전용 getter (next/headers · unstable_cache 경유) — 서버 컴포넌트에서만 소비
export { getNewsList } from "./api/getNewsList";
export { getNewsBySlug } from "./api/getNewsBySlug";
export { getAdminNewsList } from "./api/getAdminNewsList";
export { getAdminNewsById } from "./api/getAdminNewsById";

// Server Actions ('use server')
export { createNews } from "./api/createNews";
export { updateNews } from "./api/updateNews";
export { deleteNews } from "./api/deleteNews";
export { uploadNewsImage } from "./api/uploadNewsImage";

// 서버 렌더 유틸 (generateHTML + DOMPurify 새니타이즈) — 상세 page에서만 호출
export { renderNewsBody } from "./lib/renderNewsBody";

// 클라이언트 컴포넌트 — 서버 컴포넌트(page)에서 렌더 지점에 배치
export { NewsForm } from "./ui/NewsForm";
export type { NewsFormProps } from "./ui/NewsForm";
export { NewsAdminTable } from "./ui/NewsAdminTable";
export type { NewsAdminTableProps } from "./ui/NewsAdminTable";

// model 타입/스키마 (순수 · 클라/서버 안전)
export type {
  NewsItem,
  NewsAdminItem,
  NewsFormValues,
  NewsMutationResult,
  UploadNewsImageResult,
} from "./model";
export { newsFormSchema, slugify, EMPTY_DOC } from "./model";
