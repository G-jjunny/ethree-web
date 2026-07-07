"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Button, SectionLabel } from "@/shared/ui";
import { ADMIN_BASE_PATH } from "@/shared/constants";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 features/news 배럴 대신 하위 파일에서 직접 import.
import {
  newsFormSchema,
  slugify,
  EMPTY_DOC,
  type NewsFormValues,
} from "../model/schema";
import { createNews } from "../api/createNews";
import { updateNews } from "../api/updateNews";
import { uploadNewsImage } from "../api/uploadNewsImage";
import { NewsEditor } from "./NewsEditor";

export interface NewsFormProps {
  /** create: 신규 작성 / update: 기존 글 수정. */
  mode: "create" | "update";
  /** update 모드에서 대상 글 id. */
  newsId?: string;
  /** update 모드 프리필 값. */
  initialValues?: NewsFormValues;
}

const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";
/** 라이트 카드 위 보조 버튼(취소·업로드·제거 등). Button 컴포넌트엔 라이트용 보더 variant가 없어 로컬 정의. */
const SECONDARY_BUTTON_CLASS =
  "inline-flex items-center justify-center rounded-pill border border-hairline px-5 py-2.5 text-eyebrow font-display font-bold text-ink-soft transition-colors duration-fast ease-out hover:border-brand disabled:opacity-50";

function emptyValues(): NewsFormValues {
  return {
    title: "",
    slug: "",
    excerpt: "",
    coverImageUrl: "",
    body: EMPTY_DOC,
    published: false,
  };
}

/**
 * News 작성/수정 폼("use client").
 * 제목·slug(자동생성)·발췌·커버 이미지·발행 토글 + 본문 에디터(NewsEditor)를 조합하고
 * create/update Server Action을 호출한다. 성공 시 관리 목록으로 라우팅한다.
 */
export function NewsForm({ mode, newsId, initialValues }: NewsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<NewsFormValues>(
    () => initialValues ?? emptyValues(),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (payload: NewsFormValues) =>
      mode === "update" && newsId
        ? updateNews(newsId, payload)
        : createNews(payload),
    onSuccess: (result) => {
      if (result.ok) {
        router.push(`${ADMIN_BASE_PATH}/news`);
        router.refresh();
      }
    },
  });

  const setField = <K extends keyof NewsFormValues>(
    name: K,
    value: NewsFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSlug = () => {
    setField("slug", slugify(values.title));
  };

  const handleCoverChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCoverError(null);
    setIsCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadNewsImage(formData);
      if (!result.ok) {
        setCoverError(result.message);
        return;
      }
      setField("coverImageUrl", result.url);
    } catch {
      setCoverError("커버 이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsCoverUploading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = newsFormSchema.safeParse(values);
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.",
      );
      return;
    }

    mutation.mutate(parsed.data);
  };

  const result = mutation.data;
  const isServerError = result?.ok === false;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            기본 정보
          </SectionLabel>
        </legend>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="news-title" className={LABEL_CLASS}>
              제목
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <input
              id="news-title"
              name="title"
              required
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="news-slug" className={LABEL_CLASS}>
              슬러그
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id="news-slug"
                name="slug"
                required
                value={values.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="예: 8th-climate-seminar-completed"
                className={INPUT_CLASS}
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className={SECONDARY_BUTTON_CLASS}
              >
                자동 생성
              </button>
            </div>
            <p className="text-meta text-muted">
              소문자·숫자·하이픈만. 한글 제목은 직접 입력하세요.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="news-excerpt" className={LABEL_CLASS}>
              발췌 (목록 카드 요약)
            </label>
            <textarea
              id="news-excerpt"
              name="excerpt"
              rows={3}
              value={values.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              className={`${INPUT_CLASS} resize-y`}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            커버 이미지
          </SectionLabel>
        </legend>

        <div className="flex flex-col gap-3">
          {values.coverImageUrl ? (
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-card border border-hairline">
              <Image
                src={values.coverImageUrl}
                alt="커버 이미지 미리보기"
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isCoverUploading}
              onClick={() => coverInputRef.current?.click()}
              className={SECONDARY_BUTTON_CLASS}
            >
              {isCoverUploading ? "업로드 중..." : "이미지 업로드"}
            </button>
            {values.coverImageUrl ? (
              <button
                type="button"
                onClick={() => setField("coverImageUrl", "")}
                className={SECONDARY_BUTTON_CLASS}
              >
                제거
              </button>
            ) : null}
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleCoverChange}
          />
          {coverError && (
            <p role="alert" className="text-detail text-danger">
              {coverError}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            본문
          </SectionLabel>
        </legend>
        <NewsEditor
          initialContent={values.body}
          onChange={(doc) => setField("body", doc)}
        />
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            발행
          </SectionLabel>
        </legend>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => setField("published", e.target.checked)}
            className="size-4"
          />
          공개 사이트에 발행 (체크 해제 시 초안으로 저장)
        </label>
      </fieldset>

      {validationError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          {validationError}
        </p>
      )}
      {isServerError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          {result.message}
        </p>
      )}
      {mutation.isError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-hairline pt-6">
        <Button
          type="submit"
          variant="dark"
          size="md"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "저장 중..."
            : mode === "update"
              ? "수정 저장"
              : "등록"}
        </Button>
        <button
          type="button"
          onClick={() => router.push(`${ADMIN_BASE_PATH}/news`)}
          className={SECONDARY_BUTTON_CLASS}
        >
          취소
        </button>
      </div>
    </form>
  );
}
