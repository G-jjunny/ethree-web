/**
 * 전역 공용 에러 클래스. 슬라이스마다 재정의하지 않고 이 클래스만 사용한다.
 * Supabase(PostgrestError/AuthError 등)는 message/status/code 형태를 공유하므로
 * `throw new ApiError(error)`처럼 그대로 감쌀 수 있다.
 */
export interface ApiErrorLike {
  message: string;
  status?: number;
  code?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(error: ApiErrorLike) {
    super(error.message);
    this.name = "ApiError";
    this.status = error.status ?? 500;
    this.code = error.code;
  }

  /** 401/403이면 인증 관련 에러로 판단 — authAwareRetry가 재시도 여부를 결정할 때 사용. */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }
}
