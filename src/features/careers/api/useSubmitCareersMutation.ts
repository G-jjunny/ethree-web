import { useMutation } from "@tanstack/react-query";
// 배럴 서버유출 방지: "@/shared/api" 배럴은 next/headers 를 쓰는 supabaseServerClient 를
// 함께 re-export 한다. 클라이언트 훅에서 배럴을 import 하면 서버 전용 모듈이 클라 번들에
// 유입되므로, 필요한 것만 하위 파일에서 직접 import 한다(useLoginMutation.ts 주석과 동일 원리).
import { axiosInstance } from "@/shared/api/axiosInstance";
import type { CareersFormValues, SubmitCareersResponse } from "../model";

/**
 * 공개 인재채용 폼 제출 뮤테이션.
 *
 * `POST /api/careers`(Route Handler)로 제출한다. fetch() 직접 호출 금지 규칙에 따라
 * shared/api 의 axiosInstance 를 사용한다(클라 컴포넌트이므로 하위 파일 직접 import).
 *
 * Route Handler 는 DB 저장 성공 시 200/201 + `{ ok: true, ... }`, 저장 실패 시
 * 4xx/5xx + `{ ok: false, message }` 를 반환한다. 이메일 발송 스킵/실패는 저장이
 * 성공했다면 성공으로 간주된다(emailSent 플래그로 구분 가능).
 */
export function useSubmitCareersMutation() {
  return useMutation<SubmitCareersResponse, unknown, CareersFormValues>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<SubmitCareersResponse>(
        "/api/careers",
        payload,
      );
      return data;
    },
  });
}
