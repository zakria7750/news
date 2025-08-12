"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Upload,
  FileText,
  ImageIcon,
  User,
  Mail,
  Phone,
  Building,
  BookOpen,
  Languages,
  Key,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { submitResearch } from "@/app/actions/research-actions"

interface FormData {
  // معلومات الباحث
  researcherName: string
  researcherEmail: string
  researcherPhone: string
  researcherInstitution: string

  // معلومات البحث
  researchTitle: string
  researchAbstract: string
  researchKeywords: string
  researchLanguage: string

  // الملفات
  researchFile: File | null
  coverImage: File | null
  cvFile: File | null
  coverLetter: File | null
}

export default function SubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    researcherName: "",
    researcherEmail: "",
    researcherPhone: "",
    researcherInstitution: "",
    researchTitle: "",
    researchAbstract: "",
    researchKeywords: "",
    researchLanguage: "",
    researchFile: null,
    coverImage: null,
    cvFile: null,
    coverLetter: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من الحقول المطلوبة
    if (
      !formData.researcherName ||
      !formData.researcherEmail ||
      !formData.researcherPhone ||
      !formData.researcherInstitution ||
      !formData.researchTitle ||
      !formData.researchAbstract ||
      !formData.researchKeywords ||
      !formData.researchLanguage ||
      !formData.researchFile
    ) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const formDataToSubmit = new FormData()

      // إضافة البيانات النصية
      formDataToSubmit.append("researcherName", formData.researcherName)
      formDataToSubmit.append("researcherEmail", formData.researcherEmail)
      formDataToSubmit.append("researcherPhone", formData.researcherPhone)
      formDataToSubmit.append("researcherInstitution", formData.researcherInstitution)
      formDataToSubmit.append("researchTitle", formData.researchTitle)
      formDataToSubmit.append("researchAbstract", formData.researchAbstract)
      formDataToSubmit.append("researchKeywords", formData.researchKeywords)
      formDataToSubmit.append("researchLanguage", formData.researchLanguage)

      // إضافة الملفات
      if (formData.researchFile) formDataToSubmit.append("researchFile", formData.researchFile)
      if (formData.coverImage) formDataToSubmit.append("coverImage", formData.coverImage)
      if (formData.cvFile) formDataToSubmit.append("cvFile", formData.cvFile)
      if (formData.coverLetter) formDataToSubmit.append("coverLetter", formData.coverLetter)

      const result = await submitResearch(formDataToSubmit)

      if (result.success) {
        setSubmitStatus("success")
        // إعادة تعيين النموذج
        setFormData({
          researcherName: "",
          researcherEmail: "",
          researcherPhone: "",
          researcherInstitution: "",
          researchTitle: "",
          researchAbstract: "",
          researchKeywords: "",
          researchLanguage: "",
          researchFile: null,
          coverImage: null,
          cvFile: null,
          coverLetter: null,
        })
      } else {
        setErrorMessage(result.error || "حدث خطأ أثناء تقديم البحث")
        setSubmitStatus("error")
      }
    } catch (error) {
      setErrorMessage("حدث خطأ غير متوقع")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const FileUploadField = ({
    label,
    field,
    accept,
    required = false,
    icon: Icon,
  }: {
    label: string
    field: keyof FormData
    accept: string
    required?: boolean
    icon: any
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700] file:text-[#001f3f] hover:file:bg-[#FFD700]/80"
        />
        {formData[field] && (
          <p className="text-xs text-green-600 mt-1">تم اختيار الملف: {(formData[field] as File).name}</p>
        )}
      </div>
    </div>
  )

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-4">تم تقديم البحث بنجاح!</h2>
                <p className="text-green-700 mb-6">
                  شكراً لك على تقديم بحثك. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. سيتم مراجعة البحث والرد عليك خلال
                  4-7 أيام عمل.
                </p>
                <Button
                  onClick={() => setSubmitStatus("idle")}
                  className="bg-[#001f3f] hover:bg-[#001f3f]/90 text-white"
                >
                  تقديم بحث آخر
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#001f3f] mb-4">تقديم بحث للنشر</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              نرحب بتقديم أبحاثكم العلمية المتميزة للنشر في مجلة وعي الأكاديمية المحكمة
            </p>
          </div>

          {/* رسائل الخطأ */}
          {submitStatus === "error" && (
            <Card className="border-red-200 bg-red-50 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p>{errorMessage}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* معلومات الباحث */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001f3f] flex items-center gap-2">
                  <User className="w-5 h-5" />
                  معلومات الباحث
                </CardTitle>
                <CardDescription>يرجى إدخال معلوماتك الشخصية والأكاديمية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      اسم الباحث <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.researcherName}
                      onChange={(e) => handleInputChange("researcherName", e.target.value)}
                      placeholder="الاسم الكامل للباحث"
                      className="border-gray-300 focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.researcherEmail}
                      onChange={(e) => handleInputChange("researcherEmail", e.target.value)}
                      placeholder="example@email.com"
                      className="border-gray-300 focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف (واتساب) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.researcherPhone}
                      onChange={(e) => handleInputChange("researcherPhone", e.target.value)}
                      placeholder="+966xxxxxxxxx"
                      className="border-gray-300 focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      المؤسسة <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.researcherInstitution}
                      onChange={(e) => handleInputChange("researcherInstitution", e.target.value)}
                      placeholder="اسم الجامعة أو المؤسسة البحثية"
                      className="border-gray-300 focus:border-[#FFD700]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* معلومات البحث */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001f3f] flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  معلومات البحث
                </CardTitle>
                <CardDescription>تفاصيل البحث المقدم للنشر</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#001f3f]">
                    عنوان البحث <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.researchTitle}
                    onChange={(e) => handleInputChange("researchTitle", e.target.value)}
                    placeholder="عنوان البحث باللغة المختارة"
                    className="border-gray-300 focus:border-[#FFD700]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#001f3f]">
                    ملخص البحث <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={formData.researchAbstract}
                    onChange={(e) => handleInputChange("researchAbstract", e.target.value)}
                    placeholder="ملخص شامل للبحث (200-300 كلمة)"
                    rows={6}
                    className="border-gray-300 focus:border-[#FFD700] resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      الكلمات المفتاحية <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.researchKeywords}
                      onChange={(e) => handleInputChange("researchKeywords", e.target.value)}
                      placeholder="الكلمات المفتاحية مفصولة بفواصل"
                      className="border-gray-300 focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#001f3f] flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      لغة البحث <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.researchLanguage}
                      onValueChange={(value) => handleInputChange("researchLanguage", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#FFD700]">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001f3f] flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  رفع الملفات
                </CardTitle>
                <CardDescription>يرجى رفع الملفات المطلوبة بصيغ PDF أو DOC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FileUploadField
                    label="ملف البحث"
                    field="researchFile"
                    accept=".pdf,.doc,.docx"
                    required={true}
                    icon={FileText}
                  />

                  <FileUploadField
                    label="صورة غلاف البحث"
                    field="coverImage"
                    accept=".jpg,.jpeg,.png"
                    icon={ImageIcon}
                  />

                  <FileUploadField
                    label="السيرة الذاتية (اختياري)"
                    field="cvFile"
                    accept=".pdf,.doc,.docx"
                    icon={User}
                  />

                  <FileUploadField
                    label="خطاب التقديم (اختياري)"
                    field="coverLetter"
                    accept=".pdf,.doc,.docx"
                    icon={FileText}
                  />
                </div>
              </CardContent>
            </Card>

            {/* زر التقديم */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#001f3f] font-bold px-8 py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001f3f] ml-2"></div>
                    جاري التقديم...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 ml-2" />
                    تقديم البحث
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
