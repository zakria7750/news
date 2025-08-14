import { ResearchSubmissionForm } from "@/components/research-submission-form"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, CheckCircle, Clock } from "lucide-react"

export default function SubmitPage() {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-4">تقديم بحث للنشر</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نرحب بتقديم أبحاثكم العلمية المتميزة للنشر في مجلة وعي الأكاديمية المحكمة
            </p>
          </div>

          {/* معلومات سريعة */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 border-2 border-[#001f3f]/10 hover:border-[#001f3f]/30 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <FileText className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold text-[#001f3f] mb-2">مراجعة علمية</h3>
                <p className="text-gray-600 text-sm">مراجعة دقيقة من قبل خبراء متخصصين</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-[#001f3f]/10 hover:border-[#001f3f]/30 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <Clock className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold text-[#001f3f] mb-2">سرعة الرد</h3>
                <p className="text-gray-600 text-sm">الرد خلال 4-7 أيام عمل</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 border-[#001f3f]/10 hover:border-[#001f3f]/30 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-0">
                <CheckCircle className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
                <h3 className="font-bold text-[#001f3f] mb-2">نشر مجاني</h3>
                <p className="text-gray-600 text-sm">لا توجد رسوم للنشر أو المراجعة</p>
              </CardContent>
            </Card>
          </div>

          {/* نموذج التقديم */}
          <Card className="shadow-lg border-2 border-[#001f3f]/10">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-6 h-6 text-[#001f3f]" />
                <h2 className="text-2xl font-bold text-[#001f3f]">نموذج تقديم البحث</h2>
              </div>

              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 mb-6">
                <p className="text-[#001f3f] font-medium text-sm">
                  <strong>ملاحظة:</strong> جميع الحقول المميزة بعلامة (*) مطلوبة. يرجى التأكد من صحة البيانات قبل
                  التقديم.
                </p>
              </div>

              <ResearchSubmissionForm />
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <div className="mt-12 text-center">
            <Card className="bg-[#001f3f]/5 border-[#001f3f]/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[#001f3f] mb-4">شروط وإرشادات التقديم</h3>
                <div className="grid md:grid-cols-2 gap-6 text-right">
                  <div>
                    <h4 className="font-semibold text-[#001f3f] mb-2">متطلبات البحث:</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• أن يكون البحث أصيلاً وغير منشور سابقاً</li>
                      <li>• التزام بالمنهجية العلمية السليمة</li>
                      <li>• وضوح الأهداف والنتائج</li>
                      <li>• سلامة اللغة والأسلوب العلمي</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#001f3f] mb-2">تنسيق الملفات:</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• ملف البحث: PDF, DOC, DOCX</li>
                      <li>• صورة الغلاف: JPG, PNG</li>
                      <li>• السيرة الذاتية: PDF</li>
                      <li>• خطاب التقديم: PDF, DOC</li>
                    </ul>
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
