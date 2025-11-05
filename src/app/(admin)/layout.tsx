import type { Metadata } from "next";
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
    <html lang="en">
      <body className="font-sans text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 ">
          {children}
      </body>
    </html>
  );
}
