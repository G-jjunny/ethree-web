"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/shared/ui";
// 배럴 서버유출 방지: 클라 컴포넌트이므로 features/culture 배럴 대신 하위 파일에서 직접 import.
// - model: 순수 zod/타입 → 클라 안전
// - Server Action('use server') → 클라에서 참조(RPC)만 되고 서버에 남음
import {
  cultureFormSchema,
  type CultureFormValues,
} from "../model/schema";
import type { CultureGroup, CultureItem } from "../model/types";
import { createCultureItem } from "../api/createCultureItem";
import { updateCultureItem } from "../api/updateCultureItem";
import { deleteCultureItem } from "../api/deleteCultureItem";
import { uploadCultureImage } from "../api/uploadCultureImage";

export interface CultureItemFormProps {
  /** create: 신규 항목 / update: 기존 항목 수정. */
  mode: "create" | "update";
  /** 항목이 속한 group(섹션). create/update 공통 고정. */
  group: CultureGroup;
  /** update 모드 프리필 대상 항목. */
  item?: CultureItem;
  /** 저장·삭제 성공 후 콜백(부모가 목록 갱신/폼 닫기). */
  onDone?: () => void;
  /** 취소(폼 닫기) 콜백. create 모드에서 주로 사용. */
  onCancel?: () => void;
}

const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";

/** group 별 label(배지) 입력 노출 여부. talent/value 만 배지를 사용한다(schema.md). */
function usesLabel(group: CultureGroup): boolean {
  return group === "talent" || group === "value";
}

function emptyValues(group: CultureGroup): CultureFormValues {
  return {
    group,
    title: "",
    description: "",
    label: "",
    imageUrl: "",
    sortOrder: 0,
  };
}

function toFormValues(item: CultureItem): CultureFormValues {
  return {
    group: item.group,
    title: item.title,
    description: item.description,
    label: item.label ?? "",
    imageUrl: item.imageUrl ?? "",
    sortOrder: item.sortOrder,
  };
}

/**
 * 기업문화 단일 항목 편집 폼("use client").
 * create/update 를 겸하고 이미지 업로드·삭제를 포함한다. 저장은 Server Action을
 * 호출하고 성공 시 router.refresh + onDone 으로 목록을 갱신한다.
 * 마크업은 뼈대(정상 동작 + 명백한 토큰) 위주 — 정교한 스타일은 design polish 단계.
 */
export function CultureItemForm({
  mode,
  group,
  item,
  onDone,
  onCancel,
}: CultureItemFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CultureFormValues>(() =>
    item ? toFormValues(item) : emptyValues(group),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (payload: CultureFormValues) =>
      mode === "update" && item
        ? updateCultureItem(item.id, payload)
        : createCultureItem(payload),
    onSuccess: (result) => {
      if (result.ok) {
        router.refresh();
        onDone?.();
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!item) throw new Error("삭제 대상이 없습니다.");
      return deleteCultureItem(item.id);
    },
    onSuccess: (result) => {
      if (result.ok) {
        router.refresh();
        onDone?.();
      }
    },
  });

  const setField = <K extends keyof CultureFormValues>(
    name: K,
    value: CultureFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadCultureImage(formData);
      if (!result.ok) {
        setImageError(result.message);
        return;
      }
      setField("imageUrl", result.url);
    } catch {
      setImageError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = cultureFormSchema.safeParse(values);
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.",
      );
      return;
    }

    mutation.mutate(parsed.data);
  };

  const handleDelete = () => {
    if (!item) return;
    const confirmed = window.confirm(
      `"${item.title}" 항목을 삭제하시겠습니까? 되돌릴 수 없습니다.`,
    );
    if (!confirmed) return;
    deleteMutation.mutate();
  };

  const result = mutation.data;
  const isServerError = result?.ok === false;
  const deleteResult = deleteMutation.data;
  const isDeleteError = deleteResult?.ok === false;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-card border border-hairline bg-surface-white p-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={`culture-title-${item?.id ?? "new"}`} className={LABEL_CLASS}>
          제목
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        </label>
        <input
          id={`culture-title-${item?.id ?? "new"}`}
          name="title"
          required
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`culture-desc-${item?.id ?? "new"}`}
          className={LABEL_CLASS}
        >
          설명
          <span className="text-danger" aria-hidden>
            {" *"}
          </span>
        </label>
        <textarea
          id={`culture-desc-${item?.id ?? "new"}`}
          name="description"
          rows={3}
          required
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>

      {usesLabel(group) && (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`culture-label-${item?.id ?? "new"}`}
            className={LABEL_CLASS}
          >
            배지 (선택 — 예: {group === "value" ? "VALUE 01" : "01"})
          </label>
          <input
            id={`culture-label-${item?.id ?? "new"}`}
            name="label"
            value={values.label}
            onChange={(e) => setField("label", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <span className={LABEL_CLASS}>이미지 (선택)</span>
        {values.imageUrl ? (
          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-card border border-hairline">
            <Image
              src={values.imageUrl}
              alt="항목 이미지 미리보기"
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
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "업로드 중..." : "이미지 업로드"}
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
          ref={fileInputRef}
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
      {isDeleteError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          {deleteResult.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
        <Button
          type="submit"
          variant="dark"
          size="sm"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "저장 중..."
            : mode === "update"
              ? "수정 저장"
              : "추가"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline-light"
            size="sm"
            onClick={onCancel}
          >
            취소
          </Button>
        )}
        {/* welfare_intro 는 단건 항목이라 삭제 불가(서버 가드와 대칭) — 버튼 숨김. */}
        {mode === "update" && item && group !== "welfare_intro" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="ml-auto text-detail font-medium text-danger transition-colors duration-fast ease-out hover:opacity-80 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </button>
        )}
      </div>
    </form>
  );
}
