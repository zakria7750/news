"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "يرجى إدخال بريد إلكتروني صحيح",
    }
  }

  try {
    const supabase = await createClient()

    // التحقق من وجود الإيميل مسبقاً
    const { data: existing } = await supabase
      .from("newsletter_subscriptions")
      .select("id, is_active")
      .eq("email", email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return {
          success: false,
          message: "هذا البريد الإلكتروني مشترك بالفعل",
        }
      } else {
        // إعادة تفعيل الاشتراك
        const { error } = await supabase
          .from("newsletter_subscriptions")
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq("id", existing.id)

        if (error) {
          return {
            success: false,
            message: "حدث خطأ أثناء تفعيل الاشتراك",
          }
        }

        return {
          success: true,
          message: "تم تفعيل اشتراكك بنجاح!",
        }
      }
    }

    // إضافة اشتراك جديد
    const { error } = await supabase.from("newsletter_subscriptions").insert([
      {
        email,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error subscribing to newsletter:", error)
      return {
        success: false,
        message: "حدث خطأ أثناء الاشتراك",
      }
    }

    revalidatePath("/admin/news-subscriptions")

    return {
      success: true,
      message: "تم الاشتراك بنجاح! ستصلك أحدث الأخبار على بريدك الإلكتروني",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "حدث خطأ غير متوقع",
    }
  }
}

export async function getNews() {
  try {
    const supabase = await createClient()

    const { data: news, error } = await supabase.from("news").select("*").order("publish_date", { ascending: false })

    if (error) {
      console.error("Error fetching news:", error)
      return { success: false, data: [] }
    }

    return { success: true, data: news || [] }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, data: [] }
  }
}

export async function getNewsletterSubscriptions() {
  try {
    const supabase = await createClient()

    const { data: subscriptions, error } = await supabase
      .from("newsletter_subscriptions")
      .select("*")
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })

    if (error) {
      console.error("Error fetching subscriptions:", error)
      return { success: false, data: [] }
    }

    return { success: true, data: subscriptions || [] }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, data: [] }
  }
}

export async function deleteNewsletterSubscription(subscriptionId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("newsletter_subscriptions")
      .update({ is_active: false })
      .eq("id", subscriptionId)

    if (error) {
      console.error("Error deleting subscription:", error)
      return {
        success: false,
        message: "حدث خطأ أثناء حذف الاشتراك",
      }
    }

    revalidatePath("/admin/news-subscriptions")

    return {
      success: true,
      message: "تم حذف الاشتراك بنجاح",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "حدث خطأ غير متوقع",
    }
  }
}

export async function deleteNews(newsId: string) {
  try {
    const supabase = await createClient()

    // الحصول على معلومات الخبر لحذف الصورة
    const { data: news } = await supabase.from("news").select("image_path").eq("id", newsId).single()

    // حذف الخبر من قاعدة البيانات
    const { error: deleteError } = await supabase.from("news").delete().eq("id", newsId)

    if (deleteError) {
      console.error("Error deleting news:", deleteError)
      return {
        success: false,
        message: "حدث خطأ أثناء حذف الخبر",
      }
    }

    // حذف الصورة من التخزين إذا كانت موجودة
    if (news?.image_path) {
      try {
        const imagePath = news.image_path.split("/").pop()
        if (imagePath) {
          await supabase.storage.from("news-images").remove([`news-images/${imagePath}`])
        }
      } catch (imageError) {
        console.error("Error deleting image:", imageError)
        // لا نفشل العملية إذا فشل حذف الصورة
      }
    }

    revalidatePath("/admin/news-subscriptions")
    revalidatePath("/news")

    return {
      success: true,
      message: "تم حذف الخبر بنجاح",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "حدث خطأ غير متوقع",
    }
  }
}

// إضافة وظيفة إرسال الإيميلات للمشتركين باستخدام Resend
async function sendNewsletterEmail(
  subscribers: string[],
  newsTitle: string,
  newsDescription: string,
  newsImageUrl?: string,
) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>خبر جديد من مجلة وعي</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #001f3f, #003366);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .logo {
          width: 60px;
          height: 60px;
          background-color: #FFD700;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #001f3f;
          margin-bottom: 15px;
        }
        .content {
          padding: 30px 20px;
        }
        .news-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .news-title {
          font-size: 24px;
          font-weight: bold;
          color: #001f3f;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .news-description {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .cta-button {
          display: inline-block;
          background-color: #FFD700;
          color: #001f3f;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #eee;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #001f3f;
          text-decoration: none;
        }
        .unsubscribe {
          font-size: 12px;
          color: #999;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">و</div>
          <h1 style="margin: 0; font-size: 28px;">مجلة وعي</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">خبر جديد من المجلة الأكاديمية المحكمة</p>
        </div>
        
        <div class="content">
          ${newsImageUrl ? `<img src="${newsImageUrl}" alt="${newsTitle}" class="news-image">` : ""}
          
          <h2 class="news-title">${newsTitle}</h2>
          
          <p class="news-description">${newsDescription}</p>
          
          <div style="text-align: center;">
            <a href="#" class="cta-button">اقرأ المزيد</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>مجلة وعي - أكاديمية المعرفة الدولية</strong></p>
          <p>مجلة أكاديمية محكمة تصدر ربع سنوياً</p>
          
          <div class="social-links">
            <a href="#">فيسبوك</a> |
            <a href="#">تويتر</a> |
            <a href="#">لينكد إن</a> |
            <a href="#">يوتيوب</a>
          </div>
          
          <div class="unsubscribe">
            <p>تلقيت هذا الإيميل لأنك مشترك في نشرتنا الإخبارية</p>
            <p><a href="#" style="color: #999;">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured, skipping email sending")
      return { success: true, count: subscribers.length, skipped: true }
    }

    // إرسال الإيميل لكل مشترك على حدة لتجنب مشاكل الإرسال الجماعي
    const emailPromises = subscribers.map(async (email) => {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: `خبر جديد من مجلة وعي: ${newsTitle}`,
          html: emailTemplate,
        })
        return { email, success: true }
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
        return { email, success: false, error }
      }
    })

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter((result) => result.status === "fulfilled" && result.value.success).length

    console.log(`Newsletter sent successfully to ${successful}/${subscribers.length} subscribers`)

    return { success: true, count: successful, total: subscribers.length }
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return { success: false, error: error }
  }
}

export async function createNews(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const publish_date = formData.get("publish_date") as string
  const image = formData.get("image") as File

  if (!title || !description || !publish_date || !image) {
    return {
      success: false,
      message: "يرجى ملء جميع الحقول المطلوبة",
    }
  }

  try {
    const supabase = await createClient()

    // رفع الصورة إلى Supabase Storage
    const fileExt = image.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `news-images/${fileName}`

    const { error: uploadError } = await supabase.storage.from("news-images").upload(filePath, image)

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return {
        success: false,
        message: "حدث خطأ أثناء رفع الصورة",
      }
    }

    // الحصول على رابط الصورة العام
    const {
      data: { publicUrl },
    } = supabase.storage.from("news-images").getPublicUrl(filePath)

    // إضافة الخبر إلى قاعدة البيانات
    const { error: insertError } = await supabase.from("news").insert([
      {
        title,
        description,
        publish_date,
        image_path: publicUrl,
      },
    ])

    if (insertError) {
      console.error("Error creating news:", insertError)
      // حذف الصورة في حالة فشل إدراج الخبر
      await supabase.storage.from("news-images").remove([filePath])
      return {
        success: false,
        message: "حدث خطأ أثناء إنشاء الخبر",
      }
    }

    // إرسال الخبر للمشتركين في النشرة الإخبارية
    try {
      // الحصول على قائمة المشتركين النشطين
      const { data: subscribers } = await supabase
        .from("newsletter_subscriptions")
        .select("email")
        .eq("is_active", true)

      if (subscribers && subscribers.length > 0) {
        const subscriberEmails = subscribers.map((sub) => sub.email)
        const emailResult = await sendNewsletterEmail(subscriberEmails, title, description, publicUrl)

        if (emailResult.success) {
          if (emailResult.skipped) {
            console.log("Email sending skipped - RESEND_API_KEY not configured")
          } else {
            console.log(`Newsletter sent successfully to ${emailResult.count}/${emailResult.total} subscribers`)
          }
        } else {
          console.error("Failed to send newsletter:", emailResult.error)
          // لا نفشل العملية كاملة إذا فشل إرسال الإيميل
        }
      }
    } catch (emailError) {
      console.error("Error in newsletter sending process:", emailError)
      // لا نفشل العملية كاملة إذا فشل إرسال الإيميل
    }

    revalidatePath("/admin/news-subscriptions")
    revalidatePath("/news")

    return {
      success: true,
      message: "تم إنشاء الخبر وإرساله للمشتركين بنجاح",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "حدث خطأ غير متوقع",
    }
  }
}

export async function updateNews(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const publish_date = formData.get("publish_date") as string
  const image = formData.get("image") as File | null

  if (!id || !title || !description || !publish_date) {
    return {
      success: false,
      message: "يرجى ملء جميع الحقول المطلوبة",
    }
  }

  try {
    const supabase = await createClient()

    // الحصول على معلومات الخبر الحالي
    const { data: currentNews } = await supabase.from("news").select("image_path").eq("id", id).single()

    let imageUrl = currentNews?.image_path

    // إذا تم رفع صورة جديدة
    if (image && image.size > 0) {
      // رفع الصورة الجديدة
      const fileExt = image.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `news-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("news-images").upload(filePath, image)

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
        return {
          success: false,
          message: "حدث خطأ أثناء رفع الصورة",
        }
      }

      // الحصول على رابط الصورة الجديدة
      const {
        data: { publicUrl },
      } = supabase.storage.from("news-images").getPublicUrl(filePath)

      imageUrl = publicUrl

      // حذف الصورة القديمة إذا كانت موجودة
      if (currentNews?.image_path) {
        try {
          const oldImagePath = currentNews.image_path.split("/").pop()
          if (oldImagePath) {
            await supabase.storage.from("news-images").remove([`news-images/${oldImagePath}`])
          }
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError)
          // لا نفشل العملية إذا فشل حذف الصورة القديمة
        }
      }
    }

    // تحديث الخبر في قاعدة البيانات
    const { error: updateError } = await supabase
      .from("news")
      .update({
        title,
        description,
        publish_date,
        image_path: imageUrl,
      })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating news:", updateError)
      return {
        success: false,
        message: "حدث خطأ أثناء تحديث الخبر",
      }
    }

    revalidatePath("/admin/news-subscriptions")
    revalidatePath("/news")

    return {
      success: true,
      message: "تم تحديث الخبر بنجاح",
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      message: "حدث خطأ غير متوقع",
    }
  }
}
