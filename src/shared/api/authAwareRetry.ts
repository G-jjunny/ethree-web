import { ApiError } from "./ApiError";

const MAX_RETRY_COUNT = 2;

/**
 * TanStack Query `retry` 옵션에 그대로 전달하는 공용 재시도 정책.
 * 인증 에러(401/403)는 재시도해도 성공할 수 없으므로 즉시 중단하고,
 * 그 외 에러는 최대 MAX_RETRY_COUNT번까지 재시도한다.
 */
export function authAwareRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.isAuthError) {
    return false;
  }
  return failureCount < MAX_RETRY_COUNT;
}
