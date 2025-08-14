import { getResearchById } from "@/app/actions/public-issues-actions"
import Link from "next/link"
import Image from "next/image"
import { Calendar, BookOpen, Download, User, Building, ArrowRight, Tag, Globe } from "lucide-react"
import { notFound } from "next/navigation"
import { DownloadButton } from "./download-button"

interface PageProps {
  params: {
    id: string
  }
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
    <div className="min-h-screen py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1 md:space-x-2 space-x-reverse text-xs md:text-sm text-gray-600 mb-6 md:mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-[#001f3f] transition-colors whitespace-nowrap">
            الرئيسية
          </Link>
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
          <Link href="/issues" className="hover:text-[#001f3f] transition-colors whitespace-nowrap">
            الأعداد المنشورة
          </Link>
          <ArrowRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
          {research.issues && (
            <>
              <Link
                href={`/issues/${research.issues.id}`}
                className="hover:text-[#001f3f] transition-colors whitespace-nowrap"
              >
                المجلد {research.issues.volume_number} - العدد {research.issues.issue_number}
              </Link>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            </>
          )}
          <span className="text-[#001f3f] font-medium truncate max-w-32 md:max-w-none">
            {research.research_title.length > 30
              ? research.research_title.substring(0, 30) + "..."
              : research.research_title}
          </span>
        </div>

        {/* Research Cover Image */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6 md:mb-8">
          <div className="relative h-48 md:h-80 bg-gradient-to-br from-[#001f3f] to-[#003366]">
            {research.cover_image_url ? (
              <Image
                src={research.cover_image_url || "/placeholder.svg"}
                alt={research.research_title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center px-4">
                  <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 opacity-50" />
                  <p className="text-sm md:text-lg font-semibold opacity-75">غلاف البحث</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Language Badge */}
            <div className="absolute top-3 md:top-6 right-3 md:right-6">
              <div className="bg-[#FFD700] text-[#001f3f] px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center space-x-1 md:space-x-2 space-x-reverse">
                <Globe className="w-3 h-3 md:w-4 md:h-4" />
                <span>{research.research_language === "arabic" ? "عربي" : "إنجليزي"}</span>
              </div>
            </div>

            {/* Download Button */}
            {research.research_file_url && (
              <div className="absolute top-3 md:top-6 left-3 md:left-6">
                <DownloadButton
                  url={research.research_file_url}
                  filename={`${research.research_title}.pdf`}
                  variant="floating"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">تنزيل البحث</span>
                  <span className="md:hidden">تنزيل</span>
                </DownloadButton>
              </div>
            )}
          </div>
        </div>

        {/* Research Title */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-8 mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#001f3f] mb-4 md:mb-6 leading-tight">
            {research.research_title}
          </h1>

          {/* Research Abstract */}
          <div className="prose prose-sm md:prose-lg max-w-none">
            <h2 className="text-lg md:text-xl font-bold text-[#001f3f] mb-3 md:mb-4">ملخص البحث</h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-lg">{research.research_abstract}</p>
          </div>
        </div>

        {/* Author Information */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-3 md:mb-4">معلومات الباحث</h3>
          <div className="flex items-start space-x-3 md:space-x-4 space-x-reverse">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
              {research.researcher_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <User className="w-4 h-4 md:w-5 md:h-5 text-[#001f3f] flex-shrink-0" />
                <h4 className="text-lg md:text-xl font-bold text-[#001f3f] truncate">{research.researcher_name}</h4>
              </div>
              {research.researcher_institution && (
                <div className="flex items-start space-x-2 space-x-reverse text-gray-600">
                  <Building className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-lg break-words">{research.researcher_institution}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Publication Information */}
        {research.issues && (
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-3 md:mb-4">منشور في</h3>
            <div className="bg-gradient-to-r from-[#001f3f]/5 to-[#FFD700]/5 rounded-lg p-3 md:p-4 border border-[#001f3f]/10">
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-[#001f3f] flex-shrink-0" />
                    <span className="font-bold text-[#001f3f] text-sm md:text-lg break-words">
                      {research.issues.volumes?.title}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs md:text-base break-words">
                    المجلد {research.issues.volume_number} - العدد {research.issues.issue_number}:{" "}
                    {research.issues.title}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-xs md:text-sm">
                      {new Date(research.issues.publication_date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <Link
                    href={`/issues/${research.issues.id}`}
                    className="bg-[#001f3f] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-[#003366] transition-colors text-xs md:text-sm font-semibold text-center"
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
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-3 md:mb-4">تنزيل البحث</h3>
            <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFD700]/5 rounded-lg p-4 md:p-6 border border-[#FFD700]/20">
              <div className="flex flex-col gap-3 md:gap-4">
                <div>
                  <h4 className="font-bold text-[#001f3f] mb-2 text-sm md:text-base">ملف البحث الكامل</h4>
                  <p className="text-gray-600 text-xs md:text-sm">يمكنك تنزيل النسخة الكاملة من البحث بصيغة PDF</p>
                </div>
                <DownloadButton
                  url={research.research_file_url}
                  filename={`${research.research_title}.pdf`}
                  variant="primary"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                  <span>تنزيل البحث</span>
                </DownloadButton>
              </div>
            </div>
          </div>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-3 md:mb-4 flex items-center space-x-2 space-x-reverse">
              <Tag className="w-4 h-4 md:w-5 md:h-5" />
              <span>الكلمات المفتاحية</span>
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-[#001f3f]/10 to-[#001f3f]/5 text-[#001f3f] px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium border border-[#001f3f]/20 hover:bg-[#001f3f]/10 transition-colors break-words"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation and Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {research.issues && (
                <Link
                  href={`/issues/${research.issues.id}`}
                  className="bg-gray-100 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 space-x-reverse font-semibold text-sm md:text-base justify-center"
                >
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
                  <span>العودة إلى العدد</span>
                </Link>
              )}
              <Link
                href="/issues"
                className="bg-[#001f3f] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#003366] transition-colors flex items-center space-x-2 space-x-reverse font-semibold text-sm md:text-base justify-center"
              >
                <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                <span>تصفح الأعداد</span>
              </Link>
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs md:text-sm text-gray-600 mb-2">هل تود تقديم بحثك للنشر؟</p>
              <Link
                href="/submit"
                className="bg-[#FFD700] text-[#001f3f] px-4 md:px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-xs md:text-sm font-bold inline-block"
              >
                تقديم بحث جديد
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
