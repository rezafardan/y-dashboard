"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function ThemeProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Komponen hanya akan dirender setelah client-side hydration
  }, []);

  if (!mounted) {
    return <>{children}</>; // Hindari hydration mismatch
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
