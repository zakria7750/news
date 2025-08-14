"use server"

import { supabaseAdmin } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ResearchSubmissionData {
  researcher_name: string
  researcher_email: string
  researcher_phone: string
  researcher_institution: string
  research_title: string
  research_abstract: string
  research_keywords: string
  research_language: string
  research_file_url?: string
  cover_image_url?: string
  cv_file_url?: string
  cover_letter_url?: string
}

export async function submitResearch(formData: FormData) {
  try {
    // استخراج البيانات من النموذج
    const data: ResearchSubmissionData = {
      researcher_name: formData.get("researcher_name") as string,
      researcher_email: formData.get("researcher_email") as string,
      researcher_phone: formData.get("researcher_phone") as string,
      researcher_institution: formData.get("researcher_institution") as string,
      research_title: formData.get("research_title") as string,
      research_abstract: formData.get("research_abstract") as string,
      research_keywords: formData.get("research_keywords") as string,
      research_language: formData.get("research_language") as string,
    }

    // التحقق من البيانات المطلوبة
    const requiredFields = [
      "researcher_name",
      "researcher_email",
      "researcher_phone",
      "researcher_institution",
      "research_title",
      "research_abstract",
      "research_keywords",
      "research_language",
    ]

    for (const field of requiredFields) {
      if (!data[field as keyof ResearchSubmissionData]) {
        return { error: `الحقل ${field} مطلوب` }
      }
    }

    // رفع الملفات إلى Supabase Storage
    const files = {
      research_file: formData.get("research_file") as File,
      cover_image: formData.get("cover_image") as File,
      cv_file: formData.get("cv_file") as File,
      cover_letter: formData.get("cover_letter") as File,
    }

    // رفع ملف البحث (مطلوب)
    if (!files.research_file || files.research_file.size === 0) {
      return { error: "ملف البحث مطلوب" }
    }

    const timestamp = Date.now()
    const researchFileName = `research_${timestamp}_${files.research_file.name}`

    const { data: researchUpload, error: researchError } = await supabaseAdmin.storage
      .from("research-files")
      .upload(researchFileName, files.research_file)

    if (researchError) {
      console.error("Research file upload error:", researchError)
      return { error: "فشل في رفع ملف البحث" }
    }

    data.research_file_url = researchUpload.path

    // رفع صورة الغلاف (مطلوبة)
    if (!files.cover_image || files.cover_image.size === 0) {
      return { error: "صورة غلاف البحث مطلوبة" }
    }

    const coverFileName = `cover_${timestamp}_${files.cover_image.name}`

    const { data: coverUpload, error: coverError } = await supabaseAdmin.storage
      .from("research-files")
      .upload(coverFileName, files.cover_image)

    if (coverError) {
      console.error("Cover image upload error:", coverError)
      return { error: "فشل في رفع صورة الغلاف" }
    }

    data.cover_image_url = coverUpload.path

    // رفع السيرة الذاتية (اختياري)
    if (files.cv_file && files.cv_file.size > 0) {
      const cvFileName = `cv_${timestamp}_${files.cv_file.name}`

      const { data: cvUpload, error: cvError } = await supabaseAdmin.storage
        .from("research-files")
        .upload(cvFileName, files.cv_file)

      if (!cvError) {
        data.cv_file_url = cvUpload.path
      }
    }

    // رفع خطاب التقديم (اختياري)
    if (files.cover_letter && files.cover_letter.size > 0) {
      const letterFileName = `letter_${timestamp}_${files.cover_letter.name}`

      const { data: letterUpload, error: letterError } = await supabaseAdmin.storage
        .from("research-files")
        .upload(letterFileName, files.cover_letter)

      if (!letterError) {
        data.cover_letter_url = letterUpload.path
      }
    }

    // حفظ البيانات في قاعدة البيانات
    const { data: submission, error: dbError } = await supabaseAdmin
      .from("research_submissions")
      .insert({
        ...data,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return { error: "فشل في حفظ البيانات" }
    }

    // إرسال إيميل للباحث
    try {
      await resend.emails.send({
        from: "مجلة وعي <noreply@waei-magazine.com>",
        to: [data.researcher_email],
        subject: "تم استلام طلب نشر البحث - مجلة وعي",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #001f3f;">مجلة وعي - تأكيد استلام طلب النشر</h2>
            <p>عزيزي/عزيزتي ${data.researcher_name}،</p>
            <p>تم استلام طلب نشر البحث الخاص بك بعنوان: <strong>"${data.research_title}"</strong></p>
            <p>سيتم مراجعة البحث من قبل اللجنة العلمية وسنقوم بالرد عليك في غضون 4 إلى 7 أيام عمل.</p>
            <p>شكراً لاختياركم مجلة وعي لنشر أبحاثكم العلمية.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              مجلة وعي - مجلة أكاديمية محكمة<br>
              أكاديمية المعرفة الدولية
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
    }

    // إرسال إيميل للمشرف
    try {
      await resend.emails.send({
        from: "مجلة وعي <noreply@waei-magazine.com>",
        to: ["ali739303232@gmail.com"],
        subject: "طلب نشر بحث جديد - مجلة وعي",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #001f3f;">طلب نشر بحث جديد</h2>
            <p><strong>اسم الباحث:</strong> ${data.researcher_name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${data.researcher_email}</p>
            <p><strong>المؤسسة:</strong> ${data.researcher_institution}</p>
            <p><strong>عنوان البحث:</strong> ${data.research_title}</p>
            <p><strong>لغة البحث:</strong> ${data.research_language}</p>
            <p>يرجى مراجعة الطلب في لوحة الإدارة.</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Admin email error:", emailError)
    }

    return { success: "تم تقديم البحث بنجاح! سيتم الرد عليك في غضون 4-7 أيام." }
  } catch (error) {
    console.error("Submission error:", error)
    return { error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." }
  }
}
