"use client"
import Link from "next/link"

const adminSections = [
  {
    title: "إدارة البحوث",
    description: "مراجعة وإدارة البحوث المقدمة والموافقة عليها",
    href: "/admin/research",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "from-blue-600 to-blue-700",
    stats: "156 بحث مقدم",
  },
  {
    title: "إدارة الإعدادات",
    description: "إدارة المجلدات والأعداد وتنظيم محتوى المجلة",
    href: "/admin/settings",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-.42-.26l-.888-1.61a2 2 0 00-1.75-1.033H9.953a2 2 0 00-1.75 1.033l-.888 1.61a6 6 0 00-.42.26l-2.387.477a2 2 0 00-1.022.547L2.072 17.84a2 2 0 00.464 2.706l1.07.784a6 6 0 00.293.708l.888 1.61a2 2 0 001.75 1.033h4.006a2 2 0 001.75-1.033l.888-1.61a6 6 0 00.293-.708l1.07-.784a2 2 0 00.464-2.706l-1.414-2.412z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    hoverGradient: "from-amber-600 to-orange-600",
    stats: "12 عدد منشور",
  },
  {
    title: "إدارة ه��ئة التحرير",
    description: "إضافة وتعديل وحذف أعضاء هيئة التحرير والمراجعين",
    href: "/admin/editorial-board",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    hoverGradient: "from-emerald-600 to-teal-600",
    stats: "24 عضو نشط",
  },
  {
    title: "إدارة الأخبار",
    description: "إدارة النشرة الإخبارية والمشتركين والإشعارات",
    href: "/admin/news-subscriptions",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    ),
    gradient: "from-purple-500 to-indigo-500",
    hoverGradient: "from-purple-600 to-indigo-600",
    stats: "342 مشترك",
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-right">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#001f3f] mb-2">لوحة التحكم</h1>
              <p className="text-gray-600 text-lg">مرحباً بك في لوحة إدارة مجلة وعي</p>
            </div>
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-gradient-to-r from-[#001f3f] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#004080] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">العودة للموقع</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-[#001f3f]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#001f3f] mb-4">أقسام الإدارة</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">اختر القسم الذي تريد إدارته من الأقسام التالية</p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative p-6 sm:p-8">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${section.gradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                >
                  <div className="text-white">{section.icon}</div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#001f3f] mb-3 group-hover:text-[#003366] transition-colors duration-300">
                  {section.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {section.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full">
                    {section.stats}
                  </span>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-[#001f3f] group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>

                {/* Hover Border */}
                <div
                  className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:${section.gradient} rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#001f3f] to-[#003366] rounded-2xl p-8 sm:p-12 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">هل تحتاج مساعدة؟</h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              إذا كنت تواجه أي مشكلة في استخدام لوحة التحكم، لا تتردد في التواصل معنا
            </p>
            <button className="bg-[#FFD700] text-[#001f3f] px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              تواصل معنا
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
