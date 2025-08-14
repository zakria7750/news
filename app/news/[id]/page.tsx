import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ArrowRight, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react"
import { getNewsById } from "@/app/actions/news-actions"
import ShareButton from "./share-button"

interface NewsPageProps {
  params: {
    id: string
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const result = await getNewsById(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const news = result.data

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* شريط التنقل */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-custom py-4">
          <Button asChild variant="ghost" className="text-[#001f3f] hover:text-[#FFD700] hover:bg-[#001f3f]/5">
            <Link href="/" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* صورة الخبر */}
          {news.image_path && (
            <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <Image
                src={news.image_path || "/placeholder.svg"}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* محتوى الخبر */}
          <div className="space-y-6">
            {/* العنوان */}
            <div className="text-center md:text-right">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#001f3f] leading-tight mb-4">
                {news.title}
              </h1>

              {/* تاريخ النشر */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-6">
                <Calendar className="w-5 h-5 text-[#FFD700]" />
                <span className="text-lg">
                  {new Date(news.publish_date).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* وصف الخبر */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-right">
                  <p className="text-base md:text-lg whitespace-pre-wrap">{news.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* قسم المشاركة */}
            <Card className="border-2 border-[#001f3f]/10 bg-gradient-to-r from-[#001f3f]/5 to-[#FFD700]/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#001f3f] mb-4 flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5 text-[#FFD700]" />
                    شارك هذا الخبر
                  </h3>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <ShareButton
                      platform="facebook"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://waei-magazine.vercel.app"}/news/${news.id}`}
                      title={news.title}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Facebook className="w-4 h-4" />
                      <span className="hidden sm:inline">فيسبوك</span>
                    </ShareButton>

                    <ShareButton
                      platform="twitter"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://waei-magazine.vercel.app"}/news/${news.id}`}
                      title={news.title}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="hidden sm:inline">تويتر</span>
                    </ShareButton>

                    <ShareButton
                      platform="linkedin"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://waei-magazine.vercel.app"}/news/${news.id}`}
                      title={news.title}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden sm:inline">لينكد إن</span>
                    </ShareButton>

                    <ShareButton
                      platform="copy"
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://waei-magazine.vercel.app"}/news/${news.id}`}
                      title={news.title}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">نسخ الرابط</span>
                    </ShareButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أزرار التنقل */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-[#001f3f] hover:bg-[#001f3f]/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group min-w-[200px]"
              >
                <Link href="/news" className="flex items-center gap-2">
                  جميع الأخبار
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-[#FFD700] text-[#001f3f] hover:bg-[#FFD700] hover:text-[#001f3f] px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group min-w-[200px] bg-transparent"
              >
                <Link href="/" className="flex items-center gap-2">
                  الصفحة الرئيسية
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: NewsPageProps) {
  const result = await getNewsById(params.id)

  if (!result.success || !result.data) {
    return {
      title: "خبر غير موجود - مجلة وعي",
    }
  }

  const news = result.data

  return {
    title: `${news.title} - مجلة وعي`,
    description: news.description.substring(0, 160),
    openGraph: {
      title: news.title,
      description: news.description.substring(0, 160),
      images: news.image_path ? [news.image_path] : [],
    },
  }
}
