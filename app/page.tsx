import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Globe, Hash, Languages, ArrowLeft, Sparkles, Clock, Eye } from "lucide-react"
import { getNews } from "@/app/actions/news-actions"
import Image from "next/image"

export default async function HomePage() {
  const newsResult = await getNews()
  const latestNews = newsResult.success ? newsResult.data.slice(0, 3) : []

  return (
    <div className="min-h-screen">
      {/* قسم الهيرو */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* خلفية الصورة مع تأثير parallax */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#001f3f]/90 to-[#001f3f]/75 transition-all duration-700"
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
          <div className="flex justify-center items-center mb-8 animate-fade-in">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#FFD700]/50 hover:shadow-2xl group p-2">
              <Image
                src="/images/waei-logo.png"
                alt="شعار مجلة وعي"
                width={80}
                height={80}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto animate-cards-up">
            <Card className="bg-white/25 backdrop-blur-md border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-3 md:p-6 text-center">
                <Calendar className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">دورية الإصدار</h3>
                <p className="text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  ربع سنوية
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/25 backdrop-blur-md border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-3 md:p-6 text-center">
                <Globe className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">نوع النشر</h3>
                <p className="text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  إلكترونية
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/25 backdrop-blur-md border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-3 md:p-6 text-center">
                <Hash className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">رقم ISSN</h3>
                <p className="text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  سيتم تخصيصه
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/25 backdrop-blur-md border-white/40 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-3 md:p-6 text-center">
                <Languages className="w-5 h-5 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">لغة النشر</h3>
                <p className="text-xs md:text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  العربية والإنجليزية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-4 hover:text-[#FFD700] transition-colors duration-300">
              الأخبار والأنشطة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تابع آخر الأخبار والأنشطة الأكاديمية والبحثية من مجلة وعي
            </p>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {latestNews.map((news) => (
                <Card
                  key={news.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-gray-100 hover:border-[#001f3f]/20"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    {news.image_path && (
                      <Image
                        src={news.image_path || "/placeholder.svg"}
                        alt={news.title}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-[#FFD700] text-[#001f3f] px-3 py-1 rounded-full text-sm font-bold">
                      جديد
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(news.publish_date).toLocaleDateString("ar-SA")}</span>
                    </div>
                    <h3 className="font-bold text-lg text-[#001f3f] mb-3 group-hover:text-[#FFD700] transition-colors duration-300 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{news.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-[#001f3f] text-[#001f3f] hover:bg-[#001f3f] hover:text-white transition-all duration-300 group/btn bg-transparent"
                    >
                      <Link href="/news" className="flex items-center gap-2">
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                        اقرأ المزيد
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">لا توجد أخبار متاحة حالياً</p>
            </div>
          )}

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-[#001f3f] hover:bg-[#001f3f]/90 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <Link href="/news" className="flex items-center gap-2">
                كل الأخبار والأنشطة
                <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
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
