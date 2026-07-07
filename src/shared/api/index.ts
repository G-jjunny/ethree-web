export { ApiError } from "./ApiError";
export type { ApiErrorLike } from "./ApiError";

export { authAwareRetry } from "./authAwareRetry";

export { axiosInstance } from "./axiosInstance";

export { createBrowserSupabaseClient } from "./supabaseBrowserClient";
export { createServerSupabaseClient } from "./supabaseServerClient";

// createServiceRoleClient(service_role)은 서버 전용 · 키 노출 방지를 위해
// 이 배럴에서 의도적으로 re-export 하지 않는다. 필요한 서버 코드(Route Handler)는
// "./supabaseServiceClient"를 직접 import 한다.
