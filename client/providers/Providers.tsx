"use client";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

import { QueryClientProvider, QueryClient } from "react-query";
export default function Providers({ children }: any) {
  const queryClient = new QueryClient();
  return (
    <>
      <NextTopLoader />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
