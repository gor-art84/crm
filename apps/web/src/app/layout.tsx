import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InitColorSchemeScript } from "@mui/material";
import { cookies } from "next/headers";
import { ApolloWrapper } from "@/app/providers/ApolloWrapper";
import { DENSITY_COOKIE_NAME, parseDensity } from "@/shared/lib/density";
import { DensityProvider } from "@/shared/ui/density/density-provider";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const density = parseDensity(cookieStore.get(DENSITY_COOKIE_NAME)?.value);

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-density={density === "default" ? undefined : density}
      suppressHydrationWarning
    >
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <AppThemeProvider>
          <DensityProvider initialDensity={density}>
            <ApolloWrapper>{children}</ApolloWrapper>
          </DensityProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
