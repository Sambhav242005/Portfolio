import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/public/Footer";
import { SiteHeader } from "@/components/public/Header";
import { ClientLenisWrapper } from "@/components/public/ClientLenisWrapper";
import { ScrollEffect } from "@/components/public/ScrollEffect";
import "./globals.css";

const themeScript = `
(() => {
  try {
    const key = "portfolio-theme";
    const stored = window.localStorage.getItem(key);
    const theme = stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export const metadata: Metadata = {
  title: "Sambhav Surana | AI/ML Builder",
  description:
    "Portfolio of Sambhav Surana, an AI/ML builder working across model training, polished interfaces, and experimental products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ClientLenisWrapper>
          <div className="page-shell">
            <ScrollEffect>
              <SiteHeader />
            </ScrollEffect>
            {children}
            <SiteFooter />
          </div>
        </ClientLenisWrapper>
      </body>
    </html>
  );
}
