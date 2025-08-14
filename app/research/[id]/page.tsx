"use client"

import type React from "react"

import { getResearchById } from "@/app/actions/public-issues-actions"
import Link from "next/link"
import Image from "next/image"
import { Calendar, BookOpen, Download, User, Building, ArrowRight, Tag, Globe } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

const DownloadButton = ({
  url,
  filename,
  children,
}: { url: string | null; filename?: string; children: React.ReactNode }) => {
  const handleDownload = () => {
    if (!url) {
      alert("رابط الملف غير متوفر")
      return
    }

    const link = document.createElement("a")
    link.href = url
    link.download = filename || "download"
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-[#FFD700] text-[#001f3f] px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-bold flex items-center space-x-2 space-x-reverse justify-center md:justify-start"
    >
      {children}
    </button>
  )
}

const TopDownloadButton = ({
  url,
  filename,
  children,
}: { url: string | null; filename?: string; children: React.ReactNode }) => {
  const handleDownload = () => {
    if (!url) {
      alert("رابط الملف غير متوفر")
      return
    }

    const link = document.createElement("a")
    link.href = url
    link.download = filename || "download"
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-white/90 backdrop-blur-sm text-[#001f3f] px-4 py-2 rounded-full text-sm font-bold hover:bg-white transition-colors flex items-center space-x-2 space-x-reverse"
    >
      {children}
    </button>
  )
}

export default async function ResearchPage({ params }: PageProps) {
  const result = await getResearchById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const research = result.data
  const keywords = research.research_keywords
    ? research.research_keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
    : []

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-[#001f3f] transition-colors">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/issues" className="hover:text-[#001f3f] transition-colors">
              الأعداد المنشورة
            </Link>
            <ArrowRight className="w-4 h-4" />
            {research.issues && (
              <>
                <Link href={`/issues/${research.issues.id}`} className="hover:text-[#001f3f] transition-colors">
                  المجلد {research.issues.volume_number} - العدد {research.issues.issue_number}
                </Link>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            <span className="text-[#001f3f] font-medium">
              {research.research_title.length > 50
                ? research.research_title.substring(0, 50) + "..."
                : research.research_title}
            </span>
          </div>

          {/* Research Cover Image */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#001f3f] to-[#003366]">
              {research.cover_image_url ? (
                <Image
                  src={research.cover_image_url || "/placeholder.svg"}
                  alt={research.research_title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold opacity-75">غلاف البحث</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Language Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-[#FFD700] text-[#001f3f] px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 space-x-reverse">
                  <Globe className="w-4 h-4" />
                  <span>{research.research_language === "arabic" ? "عربي" : "إنجليزي"}</span>
                </div>
              </div>

              {/* Download Button */}
              {research.research_file_url && (
                <div className="absolute top-6 left-6">
                  <TopDownloadButton url={research.research_file_url} filename={`${research.research_title}.pdf`}>
                    <Download className="w-4 h-4" />
                    <span>تنزيل البحث</span>
                  </TopDownloadButton>
                </div>
              )}
            </div>
          </div>

          {/* Research Title */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-6 leading-tight">
              {research.research_title}
            </h1>

            {/* Research Abstract */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-bold text-[#001f3f] mb-4">ملخص البحث</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{research.research_abstract}</p>
            </div>
          </div>

          {/* Author Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h3 className="text-xl font-bold text-[#001f3f] mb-4">معلومات الباحث</h3>
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {research.researcher_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                  <User className="w-5 h-5 text-[#001f3f]" />
                  <h4 className="text-xl font-bold text-[#001f3f]">{research.researcher_name}</h4>
                </div>
                {research.researcher_institution && (
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                    <Building className="w-5 h-5" />
                    <span className="text-lg">{research.researcher_institution}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Publication Information */}
          {research.issues && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h3 className="text-xl font-bold text-[#001f3f] mb-4">منشور في</h3>
              <div className="bg-gradient-to-r from-[#001f3f]/5 to-[#FFD700]/5 rounded-lg p-4 border border-[#001f3f]/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <BookOpen className="w-5 h-5 text-[#001f3f]" />
                      <span className="font-bold text-[#001f3f] text-lg">{research.issues.volumes?.title}</span>
                    </div>
                    <div className="text-gray-600">
                      المجلد {research.issues.volume_number} - العدد {research.issues.issue_number}:{" "}
                      {research.issues.title}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(research.issues.publication_date).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <Link
                      href={`/issues/${research.issues.id}`}
                      className="bg-[#001f3f] text-white px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors text-sm font-semibold"
                    >
                      عرض العدد كاملاً
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Section */}
          {research.research_file_url && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h3 className="text-xl font-bold text-[#001f3f] mb-4">تنزيل البحث</h3>
              <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 rounded-lg p-6 border border-[#FFD700]/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#001f3f] mb-2">ملف البحث الكامل</h4>
                    <p className="text-gray-600">يمكنك تنزيل النسخة الكاملة من البحث بصيغة PDF</p>
                  </div>
                  <DownloadButton url={research.research_file_url} filename={`${research.research_title}.pdf`}>
                    <Download className="w-5 h-5" />
                    <span>تنزيل البحث</span>
                  </DownloadButton>
                </div>
              </div>
            </div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h3 className="text-xl font-bold text-[#001f3f] mb-4 flex items-center space-x-2 space-x-reverse">
                <Tag className="w-5 h-5" />
                <span>الكلمات المفتاحية</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-[#001f3f]/10 to-[#001f3f]/5 text-[#001f3f] px-4 py-2 rounded-full text-sm font-medium border border-[#001f3f]/20 hover:bg-[#001f3f]/10 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation and Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {research.issues && (
                  <Link
                    href={`/issues/${research.issues.id}`}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 space-x-reverse font-semibold"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>العودة إلى العدد</span>
                  </Link>
                )}
                <Link
                  href="/issues"
                  className="bg-[#001f3f] text-white px-6 py-3 rounded-lg hover:bg-[#003366] transition-colors flex items-center space-x-2 space-x-reverse font-semibold"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>تصفح الأعداد</span>
                </Link>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">هل تود تقديم بحثك للنشر؟</p>
                <Link
                  href="/submit"
                  className="bg-[#FFD700] text-[#001f3f] px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm font-bold"
                >
                  تقديم بحث جديد
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
