"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, SectionLabel } from "@/shared/ui";
// 배럴 서버유출 방지: features/careers 의 index.ts 배럴은 서버 전용 getter/Server Action 을
// 함께 노출하므로 이 클라이언트 컴포넌트는 배럴을 import 하지 않고 필요한 것만 하위 파일에서
// 직접 import 한다(CompanyInfoForm 주석과 동일 원리).
// - model: 순수 zod/타입 → 클라 안전
// - updateCareersSettings: 'use server' Server Action → 클라에서 RPC 참조만, 서버에 남음
import {
  careersSettingsFormSchema,
  careersSettingsToFormValues,
  type CareersSettings,
  type CareersSettingsFormValues,
} from "../model";
import { updateCareersSettings } from "../api/updateCareersSettings";

export interface CareersSettingsFormProps {
  /** 서버(getCareersSettings)에서 주입받은 현재 수신 설정. 폼 프리필에 사용. */
  initialValues: CareersSettings;
}

const INPUT_CLASS =
  "w-full rounded-card border border-hairline bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors duration-fast ease-out placeholder:text-muted focus:border-brand";
const LABEL_CLASS = "text-detail font-medium text-ink-soft";
const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";
const MESSAGE_SUCCESS_CLASS =
  "rounded-card border border-hairline bg-tint px-4 py-3 text-detail text-olive-label";

/**
 * 인재채용 수신 이메일 설정 폼("use client").
 * 서버 값으로 프리필 → 편집 → Server Action(updateCareersSettings) 저장.
 * CompanyInfoForm 의 상태/검증 패턴(useState + zod + pending/성공/에러)을 미러한다.
 */
export function CareersSettingsForm({ initialValues }: CareersSettingsFormProps) {
  const [values, setValues] = useState<CareersSettingsFormValues>(() =>
    careersSettingsToFormValues(initialValues),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: CareersSettingsFormValues) =>
      updateCareersSettings(payload),
  });

  const setField = (name: keyof CareersSettingsFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = careersSettingsFormSchema.safeParse(values);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <fieldset className="border-0 p-0">
        <legend className="mb-5 p-0">
          <SectionLabel color="olive" size="sm">
            수신 이메일 설정
          </SectionLabel>
        </legend>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="careers-recipient-email" className={LABEL_CLASS}>
              수신 이메일
            </label>
            <input
              id="careers-recipient-email"
              name="recipientEmail"
              type="email"
              value={values.recipientEmail}
              onChange={(event) =>
                setField("recipientEmail", event.target.value)
              }
              placeholder="지원/문의를 받을 이메일"
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="careers-from-email" className={LABEL_CLASS}>
              발신 이메일 (선택)
            </label>
            <input
              id="careers-from-email"
              name="fromEmail"
              type="email"
              value={values.fromEmail ?? ""}
              onChange={(event) => setField("fromEmail", event.target.value)}
              placeholder="인증된 발신 도메인 주소 (미설정 시 기본값 사용)"
              className={INPUT_CLASS}
            />
          </div>
        </div>
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
