"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

export async function submitResearch(formData: FormData) {
  try {
    const supabase = createClient()

    // استخراج البيانات من FormData
    const researcherName = formData.get("researcherName") as string
    const researcherEmail = formData.get("researcherEmail") as string
    const researcherPhone = formData.get("researcherPhone") as string
    const researcherInstitution = formData.get("researcherInstitution") as string
    const researchTitle = formData.get("researchTitle") as string
    const researchAbstract = formData.get("researchAbstract") as string
    const researchKeywords = formData.get("researchKeywords") as string
    const researchLanguage = formData.get("researchLanguage") as string

    const researchFile = formData.get("researchFile") as File
    const coverImage = formData.get("coverImage") as File | null
    const cvFile = formData.get("cvFile") as File | null
    const coverLetter = formData.get("coverLetter") as File | null

    // رفع الملفات إلى Supabase Storage
    const uploadFile = async (file: File, folder: string) => {
      const fileName = `${folder}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from("research-files").upload(fileName, file)

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("research-files").getPublicUrl(fileName)

      return publicUrl
    }

    // رفع الملفات المطلوبة
    const researchFileUrl = await uploadFile(researchFile, "research-papers")
    const coverImageUrl = coverImage ? await uploadFile(coverImage, "cover-images") : null
    const cvFileUrl = cvFile ? await uploadFile(cvFile, "cv-files") : null
    const coverLetterUrl = coverLetter ? await uploadFile(coverLetter, "cover-letters") : null

    // حفظ البيانات في قاعدة البيانات
    const { data, error } = await supabase
      .from("research_submissions")
      .insert({
        researcher_name: researcherName,
        researcher_email: researcherEmail,
        researcher_phone: researcherPhone,
        researcher_institution: researcherInstitution,
        research_title: researchTitle,
        research_abstract: researchAbstract,
        research_keywords: researchKeywords,
        research_language: researchLanguage,
        research_file_url: researchFileUrl,
        cover_image_url: coverImageUrl,
        cv_file_url: cvFileUrl,
        cover_letter_url: coverLetterUrl,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    const sendEmails = async () => {
      try {
        // التحقق من وجود متغير البيئة
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === "") {
          console.warn("RESEND_API_KEY is not configured. Emails will not be sent.")
          return
        }

        // إنشاء Resend client داخل الدالة
        const resend = new Resend(process.env.RESEND_API_KEY)

        // إرسال إيميل تأكيد للباحث
        await resend.emails.send({
          from: "noreply@resend.dev",
          to: [researcherEmail],
          subject: "تأكيد استلام طلب نشر البحث - مجلة وعي",
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #001f3f; margin: 0; font-size: 28px;">مجلة وعي</h1>
                  <p style="color: #666; margin: 5px 0 0 0;">المجلة الأكاديمية المحكمة</p>
                </div>
                
                <h2 style="color: #001f3f; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">تأكيد استلام طلب النشر</h2>
                
                <p style="color: #333; line-height: 1.6;">عزيزي الدكتور/ة <strong>${researcherName}</strong>،</p>
                
                <p style="color: #333; line-height: 1.6;">
                  نشكركم على ثقتكم في مجلة وعي وتقديم بحثكم المعنون:
                </p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-right: 4px solid #FFD700; margin: 20px 0;">
                  <strong style="color: #001f3f;">"${researchTitle}"</strong>
                </div>
                
                <p style="color: #333; line-height: 1.6;">
                  تم استلام طلبكم بنجاح وسيتم مراجعته من قبل هيئة التحرير. 
                  سنقوم بالرد عليكم خلال <strong>4-7 أيام عمل</strong> لإعلامكم بقرار المراجعة الأولية.
                </p>
                
                <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <h3 style="color: #001f3f; margin-top: 0;">معلومات الطلب:</h3>
                  <ul style="color: #333; margin: 0; padding-right: 20px;">
                    <li>رقم الطلب: ${data.id}</li>
                    <li>تاريخ التقديم: ${new Date().toLocaleDateString("ar-SA")}</li>
                    <li>لغة البحث: ${researchLanguage === "arabic" ? "العربية" : "الإنجليزية"}</li>
                  </ul>
                </div>
                
                <p style="color: #333; line-height: 1.6;">
                  في حالة وجود أي استفسارات، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف.
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #666; margin: 0;">مع أطيب التحيات،</p>
                  <p style="color: #001f3f; font-weight: bold; margin: 5px 0;">فريق تحرير مجلة وعي</p>
                  <p style="color: #666; font-size: 14px; margin: 0;">أكاديمية المعرفة الدولية</p>
                </div>
              </div>
            </div>
          `,
        })

        // إرسال إيميل إشعار لمشرف المجلة
        await resend.emails.send({
          from: "noreply@resend.dev",
          to: ["ali739303232@gmail.com"],
          subject: "طلب نشر بحث جديد - مجلة وعي",
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #001f3f;">طلب نشر بحث جديد</h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #001f3f; margin-top: 0;">معلومات الباحث:</h3>
                <p><strong>الاسم:</strong> ${researcherName}</p>
                <p><strong>البريد الإلكتروني:</strong> ${researcherEmail}</p>
                <p><strong>الهاتف:</strong> ${researcherPhone}</p>
                <p><strong>المؤسسة:</strong> ${researcherInstitution}</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #001f3f; margin-top: 0;">معلومات البحث:</h3>
                <p><strong>العنوان:</strong> ${researchTitle}</p>
                <p><strong>اللغة:</strong> ${researchLanguage === "arabic" ? "العربية" : "الإنجليزية"}</p>
                <p><strong>الكلمات المفتاحية:</strong> ${researchKeywords}</p>
              </div>
              
              <p><strong>رقم الطلب:</strong> ${data.id}</p>
              <p><strong>تاريخ التقديم:</strong> ${new Date().toLocaleDateString("ar-SA")}</p>
              
              <p>يرجى مراجعة الطلب في لوحة التحكم.</p>
            </div>
          `,
        })

        console.log("Emails sent successfully")
      } catch (emailError) {
        console.error("Error sending emails:", emailError)
        // لا نرمي الخطأ هنا لأن البيانات تم حفظها بنجاح
      }
    }

    // إرسال الإيميلات بشكل منفصل
    await sendEmails()

    return { success: true, data }
  } catch (error) {
    console.error("Error submitting research:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء تقديم البحث",
    }
  }
}

export async function getResearchSubmissions() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("research_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching research submissions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب الطلبات",
    }
  }
}

export async function getAcceptedResearch() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("accepted_research")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching accepted research:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء جلب الأبحاث المقبولة",
    }
  }
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: "accepted" | "rejected",
  adminNotes?: string,
) {
  try {
    const supabase = createClient()

    // جلب بيانات الطلب أولاً
    const { data: submission, error: fetchError } = await supabase
      .from("research_submissions")
      .select("*")
      .eq("id", submissionId)
      .single()

    if (fetchError) throw fetchError

    // تحديث حالة الطلب
    const { error: updateError } = await supabase
      .from("research_submissions")
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId)

    if (updateError) throw updateError

    // إذا تم قبول البحث، إضافته إلى جدول الأبحاث المقبولة
    if (status === "accepted") {
      const { error: insertError } = await supabase.from("accepted_research").insert({
        submission_id: submissionId,
        researcher_name: submission.researcher_name,
        researcher_email: submission.researcher_email,
        researcher_phone: submission.researcher_phone,
        researcher_institution: submission.researcher_institution,
        research_title: submission.research_title,
        research_abstract: submission.research_abstract,
        research_keywords: submission.research_keywords,
        research_language: submission.research_language,
        research_file_url: submission.research_file_url,
        cover_image_url: submission.cover_image_url,
      })

      if (insertError) throw insertError
    }

    // إرسال إيميل للباحث بالقرار فقط إذا كان Resend متاحاً
    const sendStatusEmail = async () => {
      try {
        // التحقق من وجود متغير البيئة
        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === "") {
          console.warn("RESEND_API_KEY is not configured. Status update emails will not be sent.")
          return
        }

        // إنشاء Resend client داخل الدالة
        const resend = new Resend(process.env.RESEND_API_KEY)

        const emailSubject = status === "accepted" ? "قبول البحث للنشر - مجلة وعي" : "قرار مراجعة البحث - مجلة وعي"

        const emailContent =
          status === "accepted"
            ? `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #001f3f; margin: 0; font-size: 28px;">مجلة وعي</h1>
                  <p style="color: #666; margin: 5px 0 0 0;">المجلة الأكاديمية المحكمة</p>
                </div>
                
                <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; border-right: 4px solid #28a745; margin-bottom: 20px;">
                  <h2 style="color: #155724; margin: 0 0 10px 0;">مبروك! تم قبول بحثكم للنشر</h2>
                </div>
                
                <p style="color: #333; line-height: 1.6;">عزيزي الدكتور/ة <strong>${submission.researcher_name}</strong>،</p>
                
                <p style="color: #333; line-height: 1.6;">
                  يسعدنا إعلامكم بأنه تم قبول بحثكم المعنون:
                </p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-right: 4px solid #FFD700; margin: 20px 0;">
                  <strong style="color: #001f3f;">"${submission.research_title}"</strong>
                </div>
                
                <p style="color: #333; line-height: 1.6;">
                  للنشر في مجلة وعي الأكاديمية المحكمة. سيتم التواصل معكم قريباً لاستكمال إجراءات النشر.
                </p>
                
                ${
                  adminNotes
                    ? `
                  <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #001f3f; margin-top: 0;">ملاحظات هيئة التحرير:</h3>
                    <p style="color: #333; margin: 0;">${adminNotes}</p>
                  </div>
                `
                    : ""
                }
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #666; margin: 0;">مع أطيب التحيات،</p>
                  <p style="color: #001f3f; font-weight: bold; margin: 5px 0;">فريق تحرير مجلة وعي</p>
                  <p style="color: #666; font-size: 14px; margin: 0;">أكاديمية المعرفة الدولية</p>
                </div>
              </div>
            </div>
          `
            : `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #001f3f; margin: 0; font-size: 28px;">مجلة وعي</h1>
                  <p style="color: #666; margin: 5px 0 0 0;">المجلة الأكاديمية المحكمة</p>
                </div>
                
                <h2 style="color: #001f3f; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">قرار مراجعة البحث</h2>
                
                <p style="color: #333; line-height: 1.6;">عزيزي الدكتور/ة <strong>${submission.researcher_name}</strong>،</p>
                
                <p style="color: #333; line-height: 1.6;">
                  نشكركم على تقديم بحثكم المعنون:
                </p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-right: 4px solid #FFD700; margin: 20px 0;">
                  <strong style="color: #001f3f;">"${submission.research_title}"</strong>
                </div>
                
                <p style="color: #333; line-height: 1.6;">
                  بعد المراجعة الدقيقة من قبل هيئة التحرير، نأسف لإعلامكم بأنه لا يمكن قبول البحث للنشر في هذا الوقت.
                </p>
                
                ${
                  adminNotes
                    ? `
                  <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #ffc107;">
                    <h3 style="color: #856404; margin-top: 0;">ملاحظات هيئة التحرير:</h3>
                    <p style="color: #856404; margin: 0;">${adminNotes}</p>
                  </div>
                `
                    : ""
                }
                
                <p style="color: #333; line-height: 1.6;">
                  نشجعكم على مواصلة البحث العلمي ونتطلع لتلقي أبحاث أخرى منكم في المستقبل.
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #666; margin: 0;">مع أطيب التحيات،</p>
                  <p style="color: #001f3f; font-weight: bold; margin: 5px 0;">فريق تحرير مجلة وعي</p>
                  <p style="color: #666; font-size: 14px; margin: 0;">أكاديمية المعرفة الدولية</p>
                </div>
              </div>
            </div>
          `

        await resend.emails.send({
          from: "noreply@resend.dev",
          to: [submission.researcher_email],
          subject: emailSubject,
          html: emailContent,
        })

        console.log("Status update email sent successfully")
      } catch (emailError) {
        console.error("Error sending status update email:", emailError)
      }
    }

    // إرسال الإيميل بالقرار بشكل منفصل
    await sendStatusEmail()

    return { success: true }
  } catch (error) {
    console.error("Error updating submission status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث حالة الطلب",
    }
  }
}

export async function deleteResearchSubmission(submissionId: string) {
  try {
    const supabase = createClient()

    // جلب بيانات الطلب أولاً لحذف الملفات
    const { data: submission, error: fetchError } = await supabase
      .from("research_submissions")
      .select("*")
      .eq("id", submissionId)
      .single()

    if (fetchError) throw fetchError

    // حذف الملفات من التخزين
    const filesToDelete = [
      submission.research_file_url,
      submission.cover_image_url,
      submission.cv_file_url,
      submission.cover_letter_url,
    ].filter(Boolean)

    for (const fileUrl of filesToDelete) {
      if (fileUrl) {
        const fileName = fileUrl.split("/").pop()
        if (fileName) {
          await supabase.storage.from("research-files").remove([fileName])
        }
      }
    }

    // حذف الطلب من قاعدة البيانات
    const { error: deleteError } = await supabase.from("research_submissions").delete().eq("id", submissionId)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error("Error deleting research submission:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء حذف الطلب",
    }
  }
}

export async function deleteAcceptedResearch(researchId: string) {
  try {
    const supabase = createClient()

    // جلب بيانات البحث أولاً لحذف الملفات
    const { data: research, error: fetchError } = await supabase
      .from("accepted_research")
      .select("*")
      .eq("id", researchId)
      .single()

    if (fetchError) throw fetchError

    // حذف الملفات من التخزين
    const filesToDelete = [research.research_file_url, research.cover_image_url].filter(Boolean)

    for (const fileUrl of filesToDelete) {
      if (fileUrl) {
        const fileName = fileUrl.split("/").pop()
        if (fileName) {
          await supabase.storage.from("research-files").remove([fileName])
        }
      }
    }

    // حذف البحث من قاعدة البيانات
    const { error: deleteError } = await supabase.from("accepted_research").delete().eq("id", researchId)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error("Error deleting accepted research:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "حدث خطأ أثناء حذف البحث",
    }
  }
}
