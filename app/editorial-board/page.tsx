"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase, type EditorialBoardMember } from "@/lib/supabase/client"

// مكون بطاقة العضو
function MemberCard({ member }: { member: EditorialBoardMember }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-[#FFD700]/30 hover:-translate-y-1">
      <div className="relative p-6 pb-4">
        {/* إطار بيضاوي للصورة مع تدرج ذهبي */}
        <div className="relative mx-auto w-32 h-40 sm:w-36 sm:h-48 lg:w-40 lg:h-52 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#FFD700] to-[#FFA500] rounded-full p-1 shadow-lg group-hover:shadow-xl group-hover:shadow-[#FFD700]/25 transition-all duration-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <Image
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={260}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {/* تدرج لوني أنيق عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </div>
            </div>
          </div>
          {/* إضافة نقاط زخرفية ذهبية */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FFD700] rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#FFD700] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#001f3f] mb-2 text-center group-hover:text-[#FFD700] transition-colors duration-300 leading-tight">
          {member.name}
        </h3>
        <div className="flex justify-center mb-3">
          <span className="inline-block bg-[#FFD700] text-[#001f3f] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md text-center">
            {member.position}
          </span>
        </div>
        <div className="flex items-center justify-center text-gray-600">
          <svg className="w-4 h-4 ml-2 text-[#FFD700] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs sm:text-sm text-center">{member.country}</span>
        </div>
      </div>
    </div>
  )
}

// مكون قسم الأعضاء
function MembersSection({ title, members }: { title: string; members: EditorialBoardMember[] }) {
  if (members.length === 0) return null

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-4 relative inline-block">
          {title}
          <div className="absolute -bottom-2 right-0 left-0 h-1 bg-gradient-to-l from-[#FFD700] to-[#001f3f] rounded-full" />
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}

export default function EditorialBoardPage() {
  const [members, setMembers] = useState<EditorialBoardMember[]>([])
  const [loading, setLoading] = useState(true)

  // جلب الأعضاء من Supabase
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // تجميع الأعضاء حسب القسم
  const groupedMembers = {
    "رئيس التحرير": members.filter((m) => m.section === "editor_in_chief"),
    "مدير التحرير": members.filter((m) => m.section === "managing_editor"),
    "المدير التنفيذي": members.filter((m) => m.section === "executive_manager"),
    "اللجنة الفنية للمجلة": members.filter((m) => m.section === "technical_committee"),
    "اللجنة الاستشارية": members.filter((m) => m.section === "advisory_committee"),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل هيئة التحرير...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#001f3f] via-[#001f3f] to-[#003366] py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/academic-research-books.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 to-[#001f3f]/70" />

        <div className="container-custom relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD700] rounded-full mb-8">
              <svg className="w-10 h-10 text-[#001f3f]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">هيئة التحرير</h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              نخبة من الأكاديميين والباحثين المتميزين الذين يقودون مجلة وعي نحو التميز الأكاديمي والبحثي
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm md:text-base">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#FFD700] rounded-full ml-3" />
                <span>خبرة أكاديمية متميزة</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#FFD700] rounded-full ml-3" />
                <span>تنوع جغرافي واسع</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#FFD700] rounded-full ml-3" />
                <span>معايير علمية عالية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members Sections */}
      <div className="container-custom py-20">
        {Object.entries(groupedMembers).map(([sectionTitle, sectionMembers]) => (
          <MembersSection key={sectionTitle} title={sectionTitle} members={sectionMembers} />
        ))}

        {members.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-xl">لا توجد أعضاء في هيئة التحرير حالياً</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-l from-[#001f3f] to-[#003366] py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">هل تريد الانضمام إلى فريقنا؟</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            نحن نبحث دائماً عن الأكاديميين والباحثين المتميزين للانضمام إلى هيئة التحرير
          </p>
          <button className="bg-[#FFD700] text-[#001f3f] px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg hover:shadow-xl">
            تواصل معنا
          </button>
        </div>
      </section>
    </div>
  )
}
