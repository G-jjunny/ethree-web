"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/shared/ui";
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
  placeholder?: string;
}

/** 단일 행 텍스트 필드(설명 textarea 제외). 라벨+input을 반복 렌더한다. */
const TEXT_FIELDS: readonly FieldConfig[] = [
  { name: "name", label: "회사명", required: true },
  { name: "nameEn", label: "브랜드명 (영문)", required: true },
  { name: "legalName", label: "법인명", required: true },
  { name: "ceo", label: "대표자", required: true },
  { name: "url", label: "사이트 URL", type: "url" },
  { name: "email", label: "이메일", type: "email" },
  { name: "tagline", label: "슬로건" },
  { name: "addressLine1", label: "주소 1행" },
  { name: "addressLine2", label: "주소 2행" },
  { name: "tel", label: "전화" },
  { name: "fax", label: "팩스" },
  { name: "copyright", label: "카피라이트" },
] as const;

const INPUT_CLASS =
  "rounded-card border border-hairline bg-surface-white px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";

/**
 * 회사 메타정보 편집 폼("use client").
 * 서버 값으로 프리필 → 편집 → Server Action(updateCompanyInfo) 저장.
 * 세밀한 비주얼 정리는 이후 design(polish)이 담당하며, 여기서는 토큰 기반의
 * 합리적 기본 마크업으로 로직 동작을 우선한다.
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label htmlFor={`company-${field.name}`} className={LABEL_CLASS}>
              {field.label}
              {field.required && (
                <span className="text-danger" aria-hidden>
                  {" *"}
                </span>
              )}
            </label>
            <input
              id={`company-${field.name}`}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              value={values[field.name]}
              onChange={(event) => setField(field.name, event.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company-description" className={LABEL_CLASS}>
          회사 소개
        </label>
        <textarea
          id="company-description"
          name="description"
          rows={4}
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>

      {validationError && (
        <p className="text-detail text-danger">{validationError}</p>
      )}
      {isServerError && (
        <p className="text-detail text-danger">{result.message}</p>
      )}
      {mutation.isError && (
        <p className="text-detail text-danger">
          저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {isSuccess && (
        <p className="text-detail text-olive-label">저장되었습니다.</p>
      )}

      <div className="flex items-center gap-4">
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
