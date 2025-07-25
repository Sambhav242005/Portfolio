import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import Header from "@/components/header";
import "../globals.css";

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
    <html lang="en">
      <body
        suppressHydrationWarning
        className="font-sans bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      >
        <Theme>
          <Header />
          {children}
        </Theme>
      </body>
    </html>
  );
}
