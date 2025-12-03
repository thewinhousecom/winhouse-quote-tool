import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Winhouse Quote Tool - Báo giá website thông minh",
  description: "Tự xây dựng cấu trúc website, ước tính chi phí và nhận tư vấn AI từ Winhouse",
  keywords: ["thiết kế website", "báo giá website", "winhouse", "website doanh nghiệp"],
  authors: [{ name: "Winhouse" }],
  openGraph: {
    title: "Winhouse Quote Tool",
    description: "Công cụ báo giá website thông minh",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
