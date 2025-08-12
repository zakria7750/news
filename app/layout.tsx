import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { LayoutWrapper } from "@/components/layout-wrapper"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "مجلة وعي - مجلة أكاديمية محكمة",
  description: "مجلة وعي - مجلة أكاديمية محكمة تصدر عن أكاديمية المعرفة الدولية",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoSansArabic.variable} antialiased`}>
      <head>
        <style>{`
html {
  font-family: ${notoSansArabic.style.fontFamily};
  --font-sans: var(--font-arabic);
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* إضافة LayoutWrapper لإدارة الشريط الرئيسي والجانبي */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
