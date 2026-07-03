"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 앱 전역 클라이언트 프로바이더. TanStack Query의 useMutation/useQuery는
 * QueryClientProvider 컨텍스트가 반드시 필요하므로 루트 레이아웃에서 한 번만 감싼다.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
