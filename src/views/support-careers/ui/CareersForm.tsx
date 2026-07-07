"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui";
// 배럴 서버유출 방지: features/careers 배럴은 서버 전용 getter/Server Action 을 함께
// 노출하므로, 이 클라이언트 컴포넌트는 배럴이 아닌 하위 파일을 직접 import 한다.
// - model: 순수 zod/타입 → 클라 안전
// - useSubmitCareersMutation: axiosInstance 기반 클라 훅(서버 모듈 미참조)
import { careersFormSchema, type CareersFormValues } from "@/features/careers/model";
import { useSubmitCareersMutation } from "@/features/careers/api/useSubmitCareersMutation";

/**
 * 인재채용 지원/문의 폼(클라이언트 경계).
 * `useSubmitCareersMutation`으로 `/api/careers`(Route Handler)에 제출한다.
 * 클라 zod 검증 → mutate → pending/성공/에러 처리 및 성공 시 폼 리셋.
 */
const FIELD_CLASS =
  "w-full rounded-card border border-hairline bg-surface-white px-4 py-3 text-body-sm text-ink placeholder:text-muted transition-colors duration-fast ease-out focus:border-olive-label focus:outline-none";

const MESSAGE_ERROR_CLASS =
  "rounded-card border border-hairline px-4 py-3 text-detail text-danger";
const MESSAGE_SUCCESS_CLASS =
  "rounded-card border border-hairline bg-tint px-4 py-3 text-detail text-olive-label";

const EMPTY_VALUES: CareersFormValues = { name: "", email: "", message: "" };

export function CareersForm() {
  const [values, setValues] = useState<CareersFormValues>(EMPTY_VALUES);
  const [validationError, setValidationError] = useState<string | null>(null);

  const mutation = useSubmitCareersMutation();

  const setField = (name: keyof CareersFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const parsed = careersFormSchema.safeParse(values);
    if (!parsed.success) {
      setValidationError(
        parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.",
      );
      return;
    }

    mutation.mutate(parsed.data, {
      onSuccess: (data) => {
        if (data.ok) {
          setValues(EMPTY_VALUES);
        }
      },
    });
  };

  const result = mutation.data;
  const isSuccess = result?.ok === true;
  const isServerError = result?.ok === false;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="careers-name"
            className="text-detail font-medium text-ink"
          >
            이름
          </label>
          <input
            id="careers-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력해 주세요"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="careers-email"
            className="text-detail font-medium text-ink"
          >
            이메일
          </label>
          <input
            id="careers-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="회신받을 이메일을 입력해 주세요"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="careers-message"
          className="text-detail font-medium text-ink"
        >
          내용
        </label>
        <textarea
          id="careers-message"
          name="message"
          rows={6}
          placeholder="지원 직무나 문의 내용을 자유롭게 작성해 주세요"
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          className={`${FIELD_CLASS} resize-y`}
        />
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
      {mutation.isError && (
        <p role="alert" className={MESSAGE_ERROR_CLASS}>
          전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      {isSuccess && (
        <p role="status" className={MESSAGE_SUCCESS_CLASS}>
          {result.message}
        </p>
      )}

      <div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "보내는 중..." : "지원 · 문의 보내기"}
        </Button>
      </div>
    </form>
  );
}
