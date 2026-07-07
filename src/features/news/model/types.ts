import type { JSONContent } from "@tiptap/react";
import type { NewsFormValues } from "./schema";

/**
 * 공개 News 반환 shape (snake_case row → camelCase). schema.md 매핑 계약과 일치.
 * `date`는 저장 컬럼이 아니라 `published_at ?? created_at`에서 파생한 YYYY-MM-DD 표시값.
 * `body`는 상세에서만 채워지고 목록 쿼리에서는 생략된다(페이로드 절감).
 */
export interface NewsItem {
  id: string;
  /** URL 슬러그. `/support/news/[slug]` 상세 라우트에 사용. */
  slug: string;
  title: string;
  /** ISO 날짜 (YYYY-MM-DD). published_at ?? created_at 파생값. */
  date: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  /** TipTap doc JSON. 상세 조회에서만 존재. */
  body?: JSONContent;
}

/**
 * 관리자 목록 테이블용 shape(초안 포함, published 플래그 노출).
 */
export interface NewsAdminItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  published: boolean;
}

/**
 * `news` row(DB snake_case). gen types 도입 전 수동 정의 — select 컬럼 계약과 일치.
 */
export interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  body?: JSONContent;
}

/** 목록 쿼리 결과(body 제외). */
export type NewsListRow = Omit<NewsRow, "body" | "published">;

/** 상세 쿼리 결과(body 포함). */
export type NewsDetailRow = Required<Pick<NewsRow, "body">> &
  Omit<NewsRow, "body">;

/** Server Action 입력 타입(폼 값과 동일 계약). */
export type CreateNewsInput = NewsFormValues;
export type UpdateNewsInput = NewsFormValues;

/**
 * News mutation(create/update/delete) 결과 shape.
 * 성공/에러를 호출부가 판별하도록 discriminated union으로 둔다.
 */
export type NewsMutationResult = { ok: true } | { ok: false; message: string };

/** 이미지 업로드 결과 shape. 성공 시 public URL 반환. */
export type UploadNewsImageResult =
  | { ok: true; url: string }
  | { ok: false; message: string };
