import "./globals.css";

import type { Metadata } from "next";
import type { Viewport } from "next";

// FONT
import localFont from "next/font/local";

// COMPONENT
import { Toaster } from "@/components/ui/toaster";

// PROVIDER
import { AuthProvider } from "@/context/AuthContext";
import ThemeProviderWrapper from "@/components/theme/theme-provider-wrapper";
import ProgressBarProviders from "@/components/progress-bar/progress-bar-provider";
import { ConditionalSidebar } from "@/hooks/use-login";

// FONT
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// HEAD
export const metadata: Metadata = {
  title: "Yukti ID Dashboard Panel",
  description:
    "Dashboard Panel Content Management System for Yukti ID Blogpage",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProgressBarProviders>
          <AuthProvider>
            <ThemeProviderWrapper>
              <ConditionalSidebar>{children}</ConditionalSidebar>
            </ThemeProviderWrapper>
            <Toaster />
          </AuthProvider>
        </ProgressBarProviders>
      </body>
    </html>
  );
}
