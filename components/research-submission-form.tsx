"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle, AlertCircle, User, FileText, UploadIcon } from "lucide-react"
import { submitResearch } from "@/app/actions/research-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#001f3f] hover:bg-[#001f3f]/90 text-white py-6 text-lg font-medium rounded-lg h-[60px] transition-all duration-300 hover:shadow-lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          جاري التقديم...
        </>
      ) : (
        <>
          <UploadIcon className="mr-2 h-5 w-5" />
          تقديم البحث
        </>
      )}
    </Button>
  )
}

export function ResearchSubmissionForm() {
  const [result, setResult] = useState<{ success?: string; error?: string } | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("")

  async function handleSubmit(formData: FormData) {
    setResult(null)
    const response = await submitResearch(formData)
    setResult(response)

    if (response.success) {
      // إعادة تعيين النموذج
      const form = document.getElementById("research-form") as HTMLFormElement
      if (form) {
        form.reset()
        setSelectedLanguage("")
      }
    }
  }

  return (
    <form id="research-form" action={handleSubmit} className="space-y-8">
      {/* عرض النتائج */}
      {result?.success && (
        <Alert className="bg-green-50 border-green-200 animate-slide-down">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">{result.success}</AlertDescription>
        </Alert>
      )}

      {result?.error && (
        <Alert className="bg-red-50 border-red-200 animate-slide-down">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">{result.error}</AlertDescription>
        </Alert>
      )}

      {/* معلومات الباحث */}
      <Card className="border-2 border-[#001f3f]/10">
        <CardHeader className="bg-[#001f3f]/5">
          <CardTitle className="flex items-center gap-2 text-[#001f3f]">
            <User className="w-5 h-5" />
            معلومات الباحث
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="researcher_name" className="text-[#001f3f] font-medium">
                اسم الباحث *
              </Label>
              <Input
                id="researcher_name"
                name="researcher_name"
                type="text"
                required
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
                placeholder="الاسم الكامل للباحث"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researcher_email" className="text-[#001f3f] font-medium">
                البريد الإلكتروني *
              </Label>
              <Input
                id="researcher_email"
                name="researcher_email"
                type="email"
                required
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="researcher_phone" className="text-[#001f3f] font-medium">
                رقم الهاتف (واتساب) *
              </Label>
              <Input
                id="researcher_phone"
                name="researcher_phone"
                type="tel"
                required
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
                placeholder="+966xxxxxxxxx"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researcher_institution" className="text-[#001f3f] font-medium">
                المؤسسة (الجامعة أو المؤسسة البحثية) *
              </Label>
              <Input
                id="researcher_institution"
                name="researcher_institution"
                type="text"
                required
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
                placeholder="اسم الجامعة أو المؤسسة"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات البحث */}
      <Card className="border-2 border-[#001f3f]/10">
        <CardHeader className="bg-[#001f3f]/5">
          <CardTitle className="flex items-center gap-2 text-[#001f3f]">
            <FileText className="w-5 h-5" />
            معلومات البحث
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="research_title" className="text-[#001f3f] font-medium">
              عنوان البحث *
            </Label>
            <Input
              id="research_title"
              name="research_title"
              type="text"
              required
              className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
              placeholder="العنوان الكامل للبحث"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="research_abstract" className="text-[#001f3f] font-medium">
              ملخص البحث *
            </Label>
            <Textarea
              id="research_abstract"
              name="research_abstract"
              required
              rows={6}
              className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors resize-none"
              placeholder="ملخص شامل للبحث يوضح الأهداف والمنهجية والنتائج الرئيسية..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="research_keywords" className="text-[#001f3f] font-medium">
                الكلمات المفتاحية *
              </Label>
              <Input
                id="research_keywords"
                name="research_keywords"
                type="text"
                required
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors"
                placeholder="كلمة1، كلمة2، كلمة3..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="research_language" className="text-[#001f3f] font-medium">
                لغة البحث *
              </Label>
              <Select name="research_language" value={selectedLanguage} onValueChange={setSelectedLanguage} required>
                <SelectTrigger className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors">
                  <SelectValue placeholder="اختر لغة البحث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">العربية</SelectItem>
                  <SelectItem value="english">الإنجليزية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* رفع الملفات */}
      <Card className="border-2 border-[#001f3f]/10">
        <CardHeader className="bg-[#001f3f]/5">
          <CardTitle className="flex items-center gap-2 text-[#001f3f]">
            <Upload className="w-5 h-5" />
            رفع الملفات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="research_file" className="text-[#001f3f] font-medium">
                ملف البحث * (PDF, DOC, DOCX)
              </Label>
              <Input
                id="research_file"
                name="research_file"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors file:bg-[#001f3f] file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image" className="text-[#001f3f] font-medium">
                صورة غلاف البحث * (JPG, PNG)
              </Label>
              <Input
                id="cover_image"
                name="cover_image"
                type="file"
                required
                accept=".jpg,.jpeg,.png"
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors file:bg-[#001f3f] file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cv_file" className="text-[#001f3f] font-medium">
                السيرة الذاتية (اختياري) (PDF)
              </Label>
              <Input
                id="cv_file"
                name="cv_file"
                type="file"
                accept=".pdf"
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors file:bg-gray-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_letter" className="text-[#001f3f] font-medium">
                خطاب التقديم (اختياري) (PDF, DOC)
              </Label>
              <Input
                id="cover_letter"
                name="cover_letter"
                type="file"
                accept=".pdf,.doc,.docx"
                className="border-2 border-gray-200 focus:border-[#001f3f] transition-colors file:bg-gray-500 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* زر التقديم */}
      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  )
}
