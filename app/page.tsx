import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Globe, Hash, Languages, ArrowLeft, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* قسم الهيرو */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* خلفية الصورة مع تأثير parallax */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#001f3f]/95 to-[#001f3f]/80 transition-all duration-700"
          style={{
            backgroundImage: `url('/academic-research-books.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* تأثير الجسيمات المتحركة */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-bounce"></div>
        </div>

        {/* المحتوى */}
        <div className="relative z-10 container-custom text-center text-white px-4">
          {/* الشعارات مع تأثير hover */}
          <div className="flex justify-center items-center gap-6 md:gap-8 mb-8 animate-fade-in">
            {/* شعار المجلة */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#FFD700]/50 hover:shadow-2xl group">
              <span className="text-[#001f3f] font-bold text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
                و
              </span>
            </div>

            {/* شعار أكاديمية المعرفة الدولية */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#FFD700]/50 hover:shadow-2xl group">
              <span className="text-[#001f3f] font-bold text-lg md:text-xl group-hover:scale-110 transition-transform duration-300">
                أ.م
              </span>
            </div>
          </div>

          {/* اسم المجلة مع تأثير متدرج */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#FFD700] animate-slide-up">
            <span className="inline-block hover:scale-105 transition-transform duration-300">مجلة</span>{" "}
            <span className="inline-block hover:scale-105 transition-transform duration-300 delay-100">وعي</span>
          </h1>

          {/* الجملة التعريفية */}
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay opacity-90 hover:opacity-100 transition-opacity duration-300">
            مجلة أكاديمية محكمة تهدف إلى نشر البحوث العلمية المتميزة في مختلف المجالات المعرفية
          </p>

          {/* الأزرار مع تحسينات تفاعلية */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up-delay">
            <Button
              asChild
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#001f3f] font-bold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group min-w-[200px]"
            >
              <Link href="/submit" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                تقديم بحث
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-[#001f3f] px-8 py-4 text-lg bg-transparent rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group min-w-[200px]"
            >
              <Link href="/issues" className="flex items-center gap-2">
                الأعداد المنشورة
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* البطاقات الأربع مع تحسينات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto animate-cards-up">
            <Card className="bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-4 md:p-6 text-center">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-base md:text-lg mb-2">دورية الإصدار</h3>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">ربع سنوية</p>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-4 md:p-6 text-center">
                <Globe className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-base md:text-lg mb-2">نوع النشر</h3>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">إلكترونية</p>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-4 md:p-6 text-center">
                <Hash className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-base md:text-lg mb-2">رقم ISSN</h3>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  سيتم تخصيصه
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-4 md:p-6 text-center">
                <Languages className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-base md:text-lg mb-2">لغة النشر</h3>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  العربية والإنجليزية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* قسم إضافي للمحتوى مع تحسينات */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#001f3f] mb-6 hover:text-[#FFD700] transition-colors duration-300">
              رؤيتنا ورسالتنا
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 hover:text-gray-900 transition-colors duration-300">
              تسعى مجلة وعي إلى أن تكون منصة رائدة لنشر البحوث العلمية المتميزة والمبتكرة، وتهدف إلى تعزيز التبادل
              المعرفي بين الباحثين والأكاديميين في العالم العربي والعالم.
            </p>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-12">
              <Card className="p-6 border-2 border-[#001f3f]/10 hover:border-[#001f3f]/30 hover:shadow-lg transition-all duration-300 group hover:scale-105">
                <CardContent className="p-0">
                  <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-4 group-hover:text-[#FFD700] transition-colors duration-300">
                    رؤيتنا
                  </h3>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    أن نكون المجلة الأكاديمية الرائدة في نشر البحوث العلمية المحكمة التي تساهم في تطوير المعرفة وخدمة
                    المجتمع.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-[#001f3f]/10 hover:border-[#001f3f]/30 hover:shadow-lg transition-all duration-300 group hover:scale-105">
                <CardContent className="p-0">
                  <h3 className="text-lg md:text-xl font-bold text-[#001f3f] mb-4 group-hover:text-[#FFD700] transition-colors duration-300">
                    رسالتنا
                  </h3>
                  <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    توفير منصة علمية محكمة لنشر البحوث المتميزة وتعزيز التبادل المعرفي بين الباحثين والمؤسسات
                    الأكاديمية.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
