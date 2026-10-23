import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InitColorSchemeScript } from "@mui/material";
import { ApolloWrapper } from "@/app/providers/ApolloWrapper";
import { AppThemeProvider } from "@/shared/ui/theme/AppThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "CRM — учебный центр",
  description: "CRM — система управления клиентами",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <AppThemeProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </AppThemeProvider>
      </body>
    </html>
  );
}
