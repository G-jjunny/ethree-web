import axios from "axios";

/**
 * 전역 공용 axios 인스턴스.
 *
 * 프로젝트 규칙상 클라이언트 데이터 통신은 `fetch()` 직접 호출을 금지하고
 * 이 인스턴스를 경유한다(Route Handler 호출 등). Supabase 직접 CRUD 는
 * supabase 클라이언트를 쓰고, 자체 Route Handler(`/api/*`) 호출에 이 인스턴스를 쓴다.
 *
 * baseURL 은 상대경로("/api" 등 절대경로 path)를 그대로 쓰도록 비워 둔다 —
 * 브라우저에서는 same-origin 으로 해석된다.
 *
 * 주의: 이 파일은 next/headers 를 import 하지 않아 클라이언트 컴포넌트에서 안전하다.
 * 다만 shared/api 배럴(index.ts)은 서버 전용 모듈을 함께 노출하므로,
 * 클라 컴포넌트/훅은 배럴이 아닌 이 파일을 직접 import 한다.
 */
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
