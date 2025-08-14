"use client"
import Link from "next/link"

// إحصائيات وهمية للوحة التحكم
const dashboardStats = [
  {
    title: "إجمالي الأعضاء",
    value: "24",
    icon: "👥",
    color: "bg-blue-500",
    change: "+3 هذا الشهر",
  },
  {
    title: "الأعداد المنشورة",
    value: "12",
    icon: "📚",
    color: "bg-green-500",
    change: "+2 هذا العام",
  },
  {
    title: "البحوث المقدمة",
    value: "156",
    icon: "📄",
    color: "bg-yellow-500",
    change: "+28 هذا الشهر",
  },
  {
    title: "المراجعات المكتملة",
    value: "89",
    icon: "✅",
    color: "bg-purple-500",
    change: "+15 هذا الأسبوع",
  },
]

const recentActivities = [
  {
    id: 1,
    action: "تم إضافة عضو جديد",
    details: "د. أحمد محمد - اللجنة الاستشارية",
    time: "منذ ساعتين",
    type: "member",
  },
  {
    id: 2,
    action: "تم نشر عدد جديد",
    details: "العدد الثالث - المجلد الأول",
    time: "منذ يوم واحد",
    type: "issue",
  },
  {
    id: 3,
    action: "بحث جديد مقدم",
    details: "تأثير التكنولوجيا على التعليم",
    time: "منذ 3 أيام",
    type: "research",
  },
]

const adminSections = [
  {
    title: "إدارة هيئة التحرير",
    description: "إضافة وتعديل وحذف أعضاء هيئة التحرير",
    href: "/admin/editorial-board",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    ),
    color: "bg-blue-500",
  },
  {
    title: "إدارة الأعداد",
    description: "نشر وإدارة أعداد المجلة",
    href: "/admin/issues",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-green-500",
  },
  {
    title: "إدارة البحوث",
    description: "مراجعة وإدارة البحوث المقدمة",
    href: "/admin/research",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    color: "bg-purple-500",
  },
  {
    title: "الإعدادات",
    description: "إعدادات عامة للموقع والمجلة",
    href: "/admin/settings",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    ),
    color: "bg-orange-500",
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#001f3f]">لوحة التحكم</h1>
            <p className="text-gray-600 mt-1">مرحباً بك في لوحة إدارة مجلة وعي</p>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-[#001f3f] text-white rounded-lg hover:bg-[#003366] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>العودة للموقع</span>
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                >
                  {section.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#001f3f] mb-2 group-hover:text-[#FFD700] transition-colors">
                {section.title}
              </h3>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-[#001f3f]">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-[#001f3f] mb-4">إجراءات سريعة</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#001f3f] text-white py-3 px-4 rounded-lg hover:bg-[#003366] transition-colors text-right">
                  إضافة عضو جديد
                </button>
                <button className="w-full bg-[#FFD700] text-[#001f3f] py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors text-right font-semibold">
                  نشر عدد جديد
                </button>
                <button className="w-full border border-[#001f3f] text-[#001f3f] py-3 px-4 rounded-lg hover:bg-[#001f3f] hover:text-white transition-colors text-right">
                  مراجعة البحوث
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-right">
                  إدارة المحتوى
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-[#001f3f] mb-4">النشاطات الأخيرة</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${
                        activity.type === "member"
                          ? "bg-blue-500"
                          : activity.type === "issue"
                            ? "bg-green-500"
                            : "bg-purple-500"
                      }`}
                    >
                      {activity.type === "member" ? "👤" : activity.type === "issue" ? "📖" : "📝"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#001f3f]">{activity.action}</p>
                      <p className="text-gray-600 text-sm">{activity.details}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#001f3f] mb-4">إحصائيات الأعضاء</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>سيتم إضافة الرسوم البيانية قريباً</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-[#001f3f] mb-4">إحصائيات البحوث</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>سيتم إضافة الرسوم البيانية قريباً</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
