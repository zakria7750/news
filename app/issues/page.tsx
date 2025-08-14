import { getPublishedIssues } from "@/app/actions/public-issues-actions"
import Link from "next/link"
import { Calendar, BookOpen, Eye } from 'lucide-react'

export default async function IssuesPage() {
  const result = await getPublishedIssues()
  const issues = result.success ? result.data : []

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#001f3f] mb-4">الأعداد المنشورة</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تصفح جميع أعداد مجلة وعي المنشورة واطلع على أحدث الأبحاث والدراسات الأكاديمية
            </p>
          </div>

          {/* Issues Grid */}
          {issues.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أعداد منشورة</h3>
              <p className="text-gray-600">لم يتم نشر أي أعداد من المجلة بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Issue Header */}
                  <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-sm font-bold">
                        المجلد {issue.volume_number} - العدد {issue.issue_number}
                      </div>
                      <BookOpen className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFD700] transition-colors">
                      {issue.title}
                    </h3>
                  </div>

                  {/* Issue Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {issue.description || "وصف العدد غير متوفر"}
                    </p>

                    {/* Issue Meta */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(issue.publication_date).toLocaleDateString("ar-SA")}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {issue.volumes?.title}
                      </div>
                    </div>

                    {/* View Button */}
                    <Link
                      href={`/issues/${issue.id}`}
                      className="w-full bg-[#001f3f] text-white py-3 px-4 rounded-lg hover:bg-[#003366] transition-colors flex items-center justify-center space-x-2 space-x-reverse font-semibold group-hover:bg-[#FFD700] group-hover:text-[#001f3f]"
                    >
                      <Eye className="w-5 h-5" />
                      <span>عرض العدد</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          {issues.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h3 className="text-2xl font-bold text-[#001f3f] mb-4">هل لديك بحث تود نشره؟</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  نرحب بالباحثين والأكاديميين لتقديم أبحاثهم للنشر في مجلة وعي. اطلع على شروط النشر وقدم بحثك الآن.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/submission-guidelines"
                    className="bg-[#001f3f] text-white px-8 py-3 rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                  >
                    شروط النشر
                  </Link>
                  <Link
                    href="/submit"
                    className="bg-[#FFD700] text-[#001f3f] px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
                  >
                    تقديم بحث
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
