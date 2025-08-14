import { getIssueWithResearch } from "@/app/actions/public-issues-actions"
import Link from "next/link"
import { Calendar, BookOpen, Download, Eye, User, Building } from "lucide-react"
import { notFound } from "next/navigation"

interface IssuePageProps {
  params: {
    id: string
  }
}

export default async function IssuePage({ params }: IssuePageProps) {
  const result = await getIssueWithResearch(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const { issue, research } = result.data

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Issue Header */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] text-white px-6 py-3 rounded-full inline-block mb-6">
                <span className="text-[#FFD700] font-bold">
                  المجلد {issue.volume_number} - العدد {issue.issue_number}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-[#001f3f] mb-4">{issue.title}</h1>

              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">{issue.description}</p>

              <div className="flex items-center justify-center space-x-6 space-x-reverse text-gray-500">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="w-5 h-5" />
                  <span>تاريخ النشر: {new Date(issue.publication_date).toLocaleDateString("ar-SA")}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <BookOpen className="w-5 h-5" />
                  <span>{research.length} بحث منشور</span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Grid */}
          {research.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أبحاث في هذا العدد</h3>
              <p className="text-gray-600">لم يتم نشر أي أبحاث في هذا العدد بعد</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#001f3f] mb-2">الأبحاث المنشورة</h2>
                <p className="text-gray-600">تصفح جميع الأبحاث المنشورة في هذا العدد</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {research.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Research Cover */}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001f3f] to-[#003366]">
                          <BookOpen className="w-16 h-16 text-[#FFD700]" />
                        </div>
                      )}
                    </div>

                    {/* Research Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#001f3f] mb-3 group-hover:text-[#003366] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {item.abstract && item.abstract.length > 200
                          ? `${item.abstract.substring(0, 200)}...`
                          : item.abstract || "ملخص البحث غير متوفر"}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center space-x-3 space-x-reverse mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-[#001f3f] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#001f3f]">{item.author_name}</p>
                          <p className="text-sm text-gray-500 flex items-center space-x-1 space-x-reverse">
                            <Building className="w-3 h-3" />
                            <span>{item.institution}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 space-x-reverse">
                        <Link
                          href={`/research/${item.id}`}
                          className="flex-1 bg-[#001f3f] text-white py-2 px-4 rounded-lg hover:bg-[#003366] transition-colors flex items-center justify-center space-x-2 space-x-reverse font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض البحث</span>
                        </Link>

                        {item.research_file_url && (
                          <a
                            href={item.research_file_url}
                            download
                            className="flex-1 bg-[#FFD700] text-[#001f3f] py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2 space-x-reverse font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            <span>تنزيل</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Back to Issues */}
          <div className="mt-12 text-center">
            <Link
              href="/issues"
              className="inline-flex items-center space-x-2 space-x-reverse bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <BookOpen className="w-5 h-5" />
              <span>العودة إلى الأعداد</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
