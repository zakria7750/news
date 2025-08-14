import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* صورة الخبر - skeleton */}
          <div className="w-full h-64 md:h-96 lg:h-[500px] bg-gray-200 rounded-2xl mb-8 animate-pulse" />

          {/* محتوى الخبر - skeleton */}
          <div className="space-y-6">
            {/* العنوان */}
            <div className="text-center md:text-right">
              <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded-lg mb-4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-lg w-48 mx-auto md:mx-0 mb-6 animate-pulse" />
            </div>

            {/* وصف الخبر */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              </CardContent>
            </Card>

            {/* قسم المشاركة */}
            <Card className="border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse" />
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
