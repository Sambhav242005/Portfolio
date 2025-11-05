import type { Metadata } from "next";
import { Header } from "@/components/header";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider"
// global styles temporarily disabled to debug build parsing issues

export const metadata: Metadata = {
  title: "Sambhav Surana - Technology Architect",
  description:
    "Experienced Technology Architect specializing in DNS management, cloud networking, and machine learning. Delivering innovative, AI-powered solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
