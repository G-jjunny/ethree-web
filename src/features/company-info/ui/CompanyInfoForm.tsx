"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, SectionLabel } from "@/shared/ui";
// 배럴 서버유출 방지: 이 클라이언트 컴포넌트는 features/company-info의 index.ts
// 배럴을 import하지 않는다. 배럴은 getCompanyInfo(unstable_cache·anon 서버 클라이언트)
// 를 함께 노출하므로, 배럴에서 무엇이든 import하면 번들러가 서버 전용 모듈을
// 클라이언트 그래프에 끌어온다(useLoginMutation.ts 주석과 동일 원리).
// 필요한 것만 하위 파일에서 직접 import한다.
// - model: 순수 zod/타입 → 클라 안전
// - updateCompanyInfo: 'use server' Server Action → 클라에서 참조(RPC)만 되고 서버에 남음
import {
  companyInfoFormSchema,
  companyInfoToFormValues,
  type CompanyInfo,
  type CompanyInfoFormValues,
} from "../model";
import { updateCompanyInfo } from "../api/updateCompanyInfo";

export interface CompanyInfoFormProps {
  /** 서버(getCompanyInfo)에서 주입받은 현재 회사정보. 폼 프리필에 사용. */
  initialValues: CompanyInfo;
}

interface FieldConfig {
  name: keyof CompanyInfoFormValues;
  label: string;
  required?: boolean;
  type?: "text" | "url" | "email";
  /** true면 textarea로 렌더하고 2열 그리드에서 전체 폭을 차지한다. */
  multiline?: boolean;
  placeholder?: string;
}

interface FieldGroup {
  /** fieldset legend에 표시될 섹션 라벨. */
  title: string;
  fields: readonly FieldConfig[];
}

/**
 * 편집 필드를 의미 단위 섹션으로 그룹핑한다(fieldset/legend로 접근성 그룹 구성).
 * 상태·검증 로직은 그대로이며 배치/그룹만 정리한다.
 */
const FIELD_GROUPS: readonly FieldGroup[] = [
  {
    title: "회사 기본 정보",
    fields: [
      { name: "name", label: "회사명", required: true },
      { name: "nameEn", label: "브랜드명 (영문)", required: true },
      { name: "legalName", label: "법인명", required: true },
      { name: "ceo", label: "대표자", required: true },
      { name: "tagline", label: "슬로건" },
    ],
  },
  {
    title: "소개",
    fields: [{ name: "description", label: "회사 소개", multiline: true }],
  },
  {
    title: "온라인",
    fields: [
      { name: "url", label: "사이트 URL", type: "url" },
      { name: "email", label: "이메일", type: "email" },
    ],
  },
  {
    title: "주소",
    fields: [
      { name: "addressLine1", label: "주소 1행" },
      { name: "addressLine2", label: "주소 2행" },
    ],
  },
  {
    title: "연락처",
    fields: [
      { name: "tel", label: "전화" },
      { name: "fax", label: "팩스" },
    ],
  },
  {
    title: "기타",
    fields: [{ name: "copyright", label: "카피라이트" }],
  },
] as const;

/** 라이트 카드 위 입력: 웜 크림 배경 + hairline 보더로 필드 경계 표현(플랫). */
const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";
const MESSAGE_SUCCESS_CLASS =
  "rounded-card border border-hairline bg-tint px-4 py-3 text-detail text-olive-label";

/**
 * 회사 메타정보 편집 폼("use client").
 * 서버 값으로 프리필 → 편집 → Server Action(updateCompanyInfo) 저장.
 * 필드는 의미 단위 fieldset 섹션으로 그룹핑하고, 라이트 카드 톤(hairline 보더 +
 * 웜 크림 입력 배경)으로 대시보드 크롬과 일관되게 정리했다. 로직은 불변.
 */
export function CompanyInfoForm({ initialValues }: CompanyInfoFormProps) {
  const [values, setValues] = useState<CompanyInfoFormValues>(() =>
    companyInfoToFormValues(initialValues),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: CompanyInfoFormValues) => updateCompanyInfo(payload),
  });

  const setField = (name: keyof CompanyInfoFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = companyInfoFormSchema.safeParse(values);
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
  const isSuccess = result?.ok === true;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {FIELD_GROUPS.map((group) => (
        <fieldset key={group.title} className="border-0 p-0">
          <legend className="mb-5 p-0">
            <SectionLabel color="olive" size="sm">
              {group.title}
            </SectionLabel>
          </legend>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.name}
                className={`flex flex-col gap-2${
                  field.multiline ? " sm:col-span-2" : ""
                }`}
              >
                <label
                  htmlFor={`company-${field.name}`}
                  className={LABEL_CLASS}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-danger" aria-hidden>
                      {" *"}
                    </span>
                  )}
                </label>
                {field.multiline ? (
                  <textarea
                    id={`company-${field.name}`}
                    name={field.name}
                    rows={4}
                    required={field.required}
                    value={values[field.name]}
                    onChange={(event) =>
                      setField(field.name, event.target.value)
                    }
                    className={`${INPUT_CLASS} resize-y`}
                  />
                ) : (
                  <input
                    id={`company-${field.name}`}
                    name={field.name}
                    type={field.type ?? "text"}
                    required={field.required}
                    value={values[field.name]}
                    onChange={(event) =>
                      setField(field.name, event.target.value)
                    }
                    className={INPUT_CLASS}
                  />
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

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
      {isSuccess && (
        <p role="status" className={MESSAGE_SUCCESS_CLASS}>
          저장되었습니다.
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-hairline pt-6">
        <Button
          type="submit"
          variant="dark"
          size="md"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
