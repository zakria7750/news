import { getNews } from "@/app/actions/news-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Newspaper } from "lucide-react"

interface News {
  id: number
  title: string
  description: string
  image_path: string | null
  publish_date: string
  created_at: string
}

export default async function NewsPage() {
  const newsResult = await getNews()
  const news: News[] = newsResult.success ? newsResult.data : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-[#001f3f] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] to-[#001f3f]/80"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-[#001f3f]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">الأخبار والأنشطة</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              تابع آخر الأخبار والفعاليات والأنشطة الأكاديمية لمجلة وعي وأكاديمية المعرفة الدولية
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>تحديث مستمر</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#FFD700] text-[#001f3f]">
                  {news.length} خبر
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFD700]/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#FFD700]/10 rounded-full translate-x-12 translate-y-12"></div>
      </div>

      {/* News Content */}
      <div className="py-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {news.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Newspaper className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">لا توجد أخبار حالياً</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    لم يتم نشر أي أخبار بعد. تابعنا للحصول على آخر التحديثات والأنشطة الأكاديمية.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 md:gap-12">
                {news.map((item, index) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg"
                  >
                    <div className={`lg:flex ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      {/* Image Section */}
                      {item.image_path && (
                        <div className="lg:w-1/2 relative overflow-hidden">
                          <div className="aspect-video lg:aspect-square relative">
                            <img
                              src={item.image_path || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div
                        className={`${item.image_path ? "lg:w-1/2" : "w-full"} p-8 lg:p-12 flex flex-col justify-center`}
                      >
                        <div className="space-y-6">
                          {/* Date Badge */}
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="bg-[#FFD700]/10 text-[#001f3f] border-[#FFD700]/20 px-4 py-2"
                            >
                              <Calendar className="w-4 h-4 ml-2" />
                              {new Date(item.publish_date).toLocaleDateString("ar-SA", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Badge>
                          </div>

                          {/* Title */}
                          <h2 className="text-2xl lg:text-3xl font-bold text-[#001f3f] leading-tight group-hover:text-[#FFD700] transition-colors duration-300">
                            {item.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-lg leading-relaxed line-clamp-4">{item.description}</p>

                          {/* Read More Indicator */}
                          <div className="pt-4">
                            <div className="inline-flex items-center text-[#001f3f] font-semibold group-hover:text-[#FFD700] transition-colors duration-300">
                              <span className="ml-2">اقرأ المزيد</span>
                              <div className="w-8 h-0.5 bg-current transform group-hover:w-12 transition-all duration-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Call to Action */}
            {news.length > 0 && (
              <div className="mt-16 text-center">
                <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#001f3f] to-[#001f3f]/90 text-white border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">ابق على اطلاع دائم</h3>
                    <p className="text-gray-300 mb-6">
                      اشترك في نشرتنا الإخبارية لتصلك آخر الأخبار والتحديثات مباشرة إلى بريدك الإلكتروني
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#FFD700] font-semibold">
                      <span>اشترك الآن من الأسفل</span>
                      <div className="w-6 h-0.5 bg-[#FFD700]"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
