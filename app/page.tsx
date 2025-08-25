import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Hash, Languages, ArrowLeft, Sparkles, Clock, Eye, BookOpen, Target, Lightbulb, GraduationCap, Building, Users, Microscope, Network } from "lucide-react"
import { getNews } from "@/app/actions/news-actions"
import Image from "next/image"

export default async function HomePage() {
  const newsResult = await getNews()
  const latestNews = newsResult.success ? newsResult.data.slice(0, 3) : []

  return (
    <div className="min-h-screen">
      {/* قسم الهيرو */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
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

          <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto animate-cards-up">
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

      {/* قسم معلومات المجلة المختصرة */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        {/* عناصر تزيينية في الخلفية */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#001f3f] rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-20 h-20 bg-[#FFD700] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#001f3f] rounded-full"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#001f3f] mb-6 hover:text-[#FFD700] transition-colors duration-300">
              تعرف على مجلة وعي
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              منصة علمية محكمة تسعى لنشر المعرفة وتطوير البحث الأكاديمي في مختلف المجالات العلمية
            </p>
          </div>

          {/* القسم الأول: عن المجلة */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-l-4 border-[#001f3f] hover:shadow-2xl transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-xl flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-7 h-7 text-[#FFD700]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#001f3f] group-hover:text-[#002a5c] transition-colors duration-300">
                      عن المجلة
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                    مجلة علمية محكَّمة تصدر عن أكاديمية المعرفة الدولية، متخصصة في نشر الأبحاث والدراسات الأصيلة في مختلف مجالات العلوم الإنسانية والتطبيقية. تهدف إلى الإسهام في تطوير المعرفة العلمية وتعزيز ثقافة البحث الرصين.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/20 to-[#FFD700]/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <div className="relative bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-3xl p-8 text-white shadow-2xl">
                    <div className="text-center">
                      <Hash className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                      <h4 className="text-xl font-bold mb-2">مجلة محكمة</h4>
                      <p className="text-blue-100">معايير علمية عالمية</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* القسم الثاني: مجالات النشر */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#001f3f] mb-4">مجالات النشر</h3>
              <div className="w-16 h-1 bg-[#FFD700] mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-blue-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  العلوم التربوية والنفسية
                </h4>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-emerald-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                  الدراسات الإسلامية واللغة العربية
                </h4>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-purple-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  العلوم الإدارية والاقتصادية
                </h4>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-rose-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-rose-600 transition-colors duration-300">
                  العلوم الاجتماعية والإنسانية
                </h4>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-cyan-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-cyan-600 transition-colors duration-300">
                  العلوم التطبيقية والتقنية
                </h4>
              </div>

              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-orange-500 group hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-lg text-[#001f3f] mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  مجالات بحثية متعددة التخصصات
                </h4>
              </div>
            </div>
          </div>

          {/* القسم الثالث: أهداف المجلة */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1 lg:order-1">
                <div className="bg-gradient-to-br from-[#FFD700] to-[#f4c430] rounded-3xl shadow-xl p-8 md:p-10 text-[#001f3f] hover:shadow-2xl transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-[#001f3f] rounded-xl flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-7 h-7 text-[#FFD700]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold group-hover:text-[#002a5c] transition-colors duration-300">
                      أهداف المجلة
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#001f3f] rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="text-[#FFD700] font-bold text-sm">✓</span>
                      </div>
                      <p className="text-lg">دعم البحث العلمي الرصين والجودة العالية</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#001f3f] rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="text-[#FFD700] font-bold text-sm">✓</span>
                      </div>
                      <p className="text-lg">تشجيع الباحثين وطلاب الدراسات العليا</p>
                    </div>

                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#001f3f] rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="text-[#FFD700] font-bold text-sm">✓</span>
                      </div>
                      <p className="text-lg">الالتزام بالمعايير الأكاديمية الدولية</p>
                    </div>

                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#001f3f] rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                        <span className="text-[#FFD700] font-bold text-sm">✓</span>
                      </div>
                      <p className="text-lg">تعزيز التواصل العلمي محلياً ودولياً</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/10 to-[#FFD700]/10 rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lightbulb className="w-10 h-10 text-[#FFD700]" />
                      </div>
                      <h4 className="text-2xl font-bold text-[#001f3f] mb-4">رؤيتنا</h4>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        أن نكون المجلة الأكاديمية الرائدة في نشر البحوث العلمية المحكمة التي تساهم في تطوير المعرفة وخدمة المجتمع
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* زر تعرف أكثر */}
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#001f3f] to-[#002a5c] hover:from-[#002a5c] hover:to-[#001f3f] text-white px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-[#FFD700]"
            >
              <Link href="/about" className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                تعرف أكثر عن المجلة
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
         {/* قسم دليل النشر */}
+          <div className="mb-20">
+            <div className="relative">
+              {/* خلفية مزخرفة */}
+              <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/5 via-[#FFD700]/5 to-[#001f3f]/5 rounded-3xl"></div>
+              
+              <div className="relative bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
+                {/* عناصر تزيينية */}
+                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFD700]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
+                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#001f3f]/10 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
+                
+                <div className="relative p-8 md:p-12 lg:p-16">
+                  <div className="grid lg:grid-cols-2 gap-12 items-center">
+                    {/* المحتوى النصي */}
+                    <div className="order-2 lg:order-1">
+                      {/* العنوان */}
+                      <div className="mb-8">
+                        <div className="flex items-center mb-6">
+                          <div className="w-16 h-16 bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-2xl flex items-center justify-center ml-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
+                            <BookOpen className="w-8 h-8 text-[#FFD700]" />
+                          </div>
+                          <div>
+                            <h3 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2">
+                              دليل النشر
+                            </h3>
+                            <div className="w-20 h-1 bg-gradient-to-r from-[#FFD700] to-[#f4c430] rounded-full"></div>
+                          </div>
+                        </div>
+                      </div>
+
+                      {/* النص الوصفي */}
+                      <div className="space-y-6 mb-8">
+                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
+                          دليل شامل للباحثين الأكاديميين حول معايير النشر العلمي الرصين، وفقًا لسياسات واضحة تضمن الأصالة، المصداقية، والالتزام بالمعايير الأكاديمية العالمية.
+                        </p>
+                        
+                        <div className="bg-gradient-to-r from-[#001f3f]/5 to-[#FFD700]/5 rounded-2xl p-6 border-r-4 border-[#FFD700]">
+                          <p className="text-gray-700 text-lg leading-relaxed">
+                            تشمل سياسات النشر لدينا: مراجعة الأبحاث عبر خبراء متخصصين، اعتماد التوثيق وفق أنماط مرجعية معترف بها، وضمان الالتزام بأخلاقيات البحث العلمي.
+                          </p>
+                        </div>
+                      </div>
+
+                      {/* الزر */}
+                      <div className="flex flex-col sm:flex-row gap-4">
+                        <Button
+                          asChild
+                          size="lg"
+                          className="bg-gradient-to-r from-[#FFD700] to-[#f4c430] hover:from-[#f4c430] hover:to-[#FFD700] text-[#001f3f] font-bold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group border-2 border-transparent hover:border-[#001f3f]/20"
+                        >
+                          <Link href="/submission-guidelines" className="flex items-center gap-3">
+                            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
+                            تعرف على التفاصيل
+                            <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
+                          </Link>
+                        </Button>
+                      </div>
+                    </div>
+
+                    {/* الجانب المرئي */}
+                    <div className="order-1 lg:order-2">
+                      <div className="relative">
+                        {/* البطاقات المتداخلة */}
+                        <div className="relative space-y-4">
+                          {/* البطاقة الأولى */}
+                          <div className="bg-gradient-to-br from-[#001f3f] to-[#002a5c] rounded-2xl p-6 text-white shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
+                            <div className="flex items-center mb-4">
+                              <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex items-center justify-center ml-3">
+                                <Shield className="w-6 h-6 text-[#001f3f]" />
+                              </div>
+                              <h4 className="text-xl font-bold">مراجعة متخصصة</h4>
+                            </div>
+                            <p className="text-blue-100">خبراء في كل مجال علمي</p>
+                          </div>
+
+                          {/* البطاقة الثانية */}
+                          <div className="bg-gradient-to-br from-[#FFD700] to-[#f4c430] rounded-2xl p-6 text-[#001f3f] shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500 relative z-10">
+                            <div className="flex items-center mb-4">
+                              <div className="w-12 h-12 bg-[#001f3f] rounded-xl flex items-center justify-center ml-3">
+                                <Target className="w-6 h-6 text-[#FFD700]" />
+                              </div>
+                              <h4 className="text-xl font-bold">معايير عالمية</h4>
+                            </div>
+                            <p className="text-[#001f3f]/80">التوثيق والمراجع المعتمدة</p>
+                          </div>
+
+                          {/* البطاقة الثالثة */}
+                          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
+                            <div className="flex items-center mb-4">
+                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center ml-3">
+                                <Lightbulb className="w-6 h-6 text-white" />
+                              </div>
+                              <h4 className="text-xl font-bold text-[#001f3f]">أخلاقيات البحث</h4>
+                            </div>
+                            <p className="text-gray-600">الأصالة والمصداقية العلمية</p>
+                          </div>
+                        </div>
+
+                        {/* عنصر تزييني */}
+                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFD700] rounded-full opacity-30 animate-pulse"></div>
+                        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#001f3f] rounded-full opacity-20 animate-pulse"></div>
+                      </div>
+                    </div>
+                  </div>
+                </div>
+              </div>
+            </div>
+          </div>
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
                      <Link href={`/news/${news.id}`} className="flex items-center gap-2">
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
