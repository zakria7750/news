"use server"

import { supabaseAdmin } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getResearchSubmissions() {
  try {
    const { data, error } = await supabaseAdmin
      .from("research_submissions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching research submissions:", error)
    return { success: false, message: "فشل في جلب طلبات الأبحاث" }
  }
}

export async function getAcceptedResearch() {
  try {
    const { data, error } = await supabaseAdmin
      .from("accepted_research")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching accepted research:", error)
    return { success: false, message: "فشل في جلب الأبحاث المقبولة" }
  }
}

export async function approveResearchSubmission(submissionId: string, adminNotes?: string) {
  try {
    // الحصول على بيانات الطلب
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("research_submissions")
      .select("*")
      .eq("id", submissionId)
      .single()

    if (fetchError) throw fetchError

    // نقل البحث إلى جدول الأبحاث المقبولة
    const { error: insertError } = await supabaseAdmin.from("accepted_research").insert({
      submission_id: submission.id,
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
      volume_number: "1", // يمكن تخصيصه لاحقاً
      issue_number: "1", // يمكن تخصيصه لاحقاً
      publication_date: new Date().toISOString().split("T")[0],
    })

    if (insertError) throw insertError

    // تحديث حالة الطلب
    const { error: updateError } = await supabaseAdmin
      .from("research_submissions")
      .update({
        status: "approved",
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId)

    if (updateError) throw updateError

    // إرسال إيميل للباحث
    try {
      await resend.emails.send({
        from: "مجلة وعي <noreply@waei-magazine.com>",
        to: [submission.researcher_email],
        subject: "تم قبول البحث للنشر - مجلة وعي",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #001f3f;">مبروك! تم قبول بحثك للنشر</h2>
            <p>عزيزي/عزيزتي ${submission.researcher_name}،</p>
            <p>يسعدنا إبلاغكم بأنه تم قبول البحث الخاص بكم بعنوان: <strong>"${submission.research_title}"</strong> للنشر في مجلة وعي.</p>
            ${adminNotes ? `<p><strong>ملاحظات المحرر:</strong> ${adminNotes}</p>` : ""}
            <p>سيتم نشر البحث في العدد القادم من المجلة وسنقوم بإشعاركم عند النشر.</p>
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

    return { success: true, message: "تم قبول البحث بنجاح" }
  } catch (error) {
    console.error("Error approving research:", error)
    return { success: false, message: "فشل في قبول البحث" }
  }
}

export async function rejectResearchSubmission(submissionId: string, adminNotes: string) {
  try {
    // الحصول على بيانات الطلب
    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("research_submissions")
      .select("*")
      .eq("id", submissionId)
      .single()

    if (fetchError) throw fetchError

    // تحديث حالة الطلب
    const { error: updateError } = await supabaseAdmin
      .from("research_submissions")
      .update({
        status: "rejected",
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId)

    if (updateError) throw updateError

    // إرسال إيميل للباحث
    try {
      await resend.emails.send({
        from: "مجلة وعي <noreply@waei-magazine.com>",
        to: [submission.researcher_email],
        subject: "نتيجة مراجعة البحث - مجلة وعي",
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #001f3f;">نتيجة مراجعة البحث</h2>
            <p>عزيزي/عزيزتي ${submission.researcher_name}،</p>
            <p>نشكركم على تقديم البحث بعنوان: <strong>"${submission.research_title}"</strong></p>
            <p>بعد المراجعة الدقيقة من قبل اللجنة العلمية، نأسف لإبلاغكم أنه لم يتم قبول البحث للنشر في هذا الوقت.</p>
            <p><strong>ملاحظات المحرر:</strong> ${adminNotes}</p>
            <p>نشجعكم على مراجعة الملاحظات وإعادة التقديم مرة أخرى بعد إجراء التحسينات المطلوبة.</p>
            <p>شكراً لاهتمامكم بمجلة وعي.</p>
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

    return { success: true, message: "تم رفض البحث وإرسال الإشعار للباحث" }
  } catch (error) {
    console.error("Error rejecting research:", error)
    return { success: false, message: "فشل في رفض البحث" }
  }
}

export async function deleteAcceptedResearch(researchId: string) {
  try {
    const { error } = await supabaseAdmin.from("accepted_research").delete().eq("id", researchId)

    if (error) throw error

    return { success: true, message: "تم حذف البحث بنجاح" }
  } catch (error) {
    console.error("Error deleting research:", error)
    return { success: false, message: "فشل في حذف البحث" }
  }
}

export async function updateAcceptedResearch(researchId: string, updateData: any) {
  try {
    const { error } = await supabaseAdmin.from("accepted_research").update(updateData).eq("id", researchId)

    if (error) throw error

    return { success: true, message: "تم تحديث البحث بنجاح" }
  } catch (error) {
    console.error("Error updating research:", error)
    return { success: false, message: "فشل في تحديث البحث" }
  }
}
