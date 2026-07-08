"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Button, SectionLabel } from "@/shared/ui";
import { ADMIN_BASE_PATH } from "@/shared/constants";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 features/solution 배럴 대신 하위 파일에서 직접 import.
import { solutionFormSchema, type SolutionFormValues } from "../model/schema";
import { createSolutionSlide } from "../api/createSolutionSlide";
import { updateSolutionSlide } from "../api/updateSolutionSlide";
import { uploadSolutionImage } from "../api/uploadSolutionImage";

export interface SolutionFormProps {
  /** create: 신규 등록 / update: 기존 슬라이드 수정. */
  mode: "create" | "update";
  /** update 모드에서 대상 슬라이드 id. */
  slideId?: string;
  /** update 모드 프리필 값. */
  initialValues?: SolutionFormValues;
}

const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";

function emptyValues(): SolutionFormValues {
  return {
    title: "",
    titleAccent: "",
    description: "",
    imageUrl: "",
    isActive: true,
  };
}

/**
 * Solution 슬라이드 등록/수정 폼("use client").
 * 제목·강조 텍스트·설명·이미지 업로드·노출 토글을 조합하고 create/update
 * Server Action을 호출한다. 성공 시 관리 목록으로 라우팅한다.
 */
export function SolutionForm({
  mode,
  slideId,
  initialValues,
}: SolutionFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SolutionFormValues>(
    () => initialValues ?? emptyValues(),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (payload: SolutionFormValues) =>
      mode === "update" && slideId
        ? updateSolutionSlide(slideId, payload)
        : createSolutionSlide(payload),
    onSuccess: (result) => {
      if (result.ok) {
        router.push(`${ADMIN_BASE_PATH}/landing/solutions`);
        router.refresh();
      }
    },
  });

  const setField = <K extends keyof SolutionFormValues>(
    name: K,
    value: SolutionFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageError(null);
    setIsImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadSolutionImage(formData);
      if (!result.ok) {
        setImageError(result.message);
        return;
      }
      setField("imageUrl", result.url);
    } catch {
      setImageError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = solutionFormSchema.safeParse(values);
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
            <label htmlFor="solution-title" className={LABEL_CLASS}>
              제목
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <input
              id="solution-title"
              name="title"
              required
              value={values.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="예: ENVIRONMENT"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="solution-title-accent" className={LABEL_CLASS}>
              강조 텍스트 (브랜드 색상)
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <input
              id="solution-title-accent"
              name="titleAccent"
              required
              value={values.titleAccent}
              onChange={(e) => setField("titleAccent", e.target.value)}
              placeholder="예: SI"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="solution-description" className={LABEL_CLASS}>
              설명
              <span className="text-danger" aria-hidden>
                {" *"}
              </span>
            </label>
            <textarea
              id="solution-description"
              name="description"
              required
              rows={4}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`${INPUT_CLASS} resize-y`}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            이미지
          </SectionLabel>
        </legend>

        <div className="flex flex-col gap-3">
          {values.imageUrl ? (
            <div className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-card border border-hairline">
              <Image
                src={values.imageUrl}
                alt="슬라이드 이미지 미리보기"
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline-light"
              size="sm"
              disabled={isImageUploading}
              onClick={() => imageInputRef.current?.click()}
            >
              {isImageUploading ? "업로드 중..." : "이미지 업로드"}
            </Button>
            {values.imageUrl ? (
              <Button
                type="button"
                variant="outline-light"
                size="sm"
                onClick={() => setField("imageUrl", "")}
              >
                제거
              </Button>
            ) : null}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageError && (
            <p role="alert" className="text-detail text-danger">
              {imageError}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            노출
          </SectionLabel>
        </legend>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
            className="size-4"
          />
          공개 사이트에 노출 (체크 해제 시 숨김)
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
        <Button
          type="button"
          variant="outline-light"
          size="sm"
          onClick={() => router.push(`${ADMIN_BASE_PATH}/landing/solutions`)}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
