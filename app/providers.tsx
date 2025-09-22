"use client";
import { UserType } from "@/app/actions/getUser";
import Loading from "@/components/Loading";
import { useLoadingStore } from "@/store/loadingStroe";
import { useUserStore } from "@/store/userStore";
//클라이언트 기능 분리

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export default function Providers({
  initialUser,
  children,
}: {
  initialUser: UserType | null;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const { setUser } = useUserStore();
  const { isLoading } = useLoadingStore();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading && <Loading />}
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
