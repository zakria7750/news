"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createVolume(formData: FormData) {
  try {
    const supabase = await createClient()

    const volumeNumber = Number.parseInt(formData.get("volume_number") as string)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!volumeNumber || !title) {
      return { success: false, message: "يرجى ملء جميع الحقول المطلوبة" }
    }

    // التحقق من عدم تكرار رقم المجلد
    const { data: existingVolume } = await supabase
      .from("volumes")
      .select("id")
      .eq("volume_number", volumeNumber)
      .single()

    if (existingVolume) {
      return { success: false, message: "رقم المجلد موجود بالفعل" }
    }

    const { error } = await supabase.from("volumes").insert([
      {
        volume_number: volumeNumber,
        title,
        description,
      },
    ])

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم إنشاء المجلد بنجاح" }
  } catch (error) {
    console.error("Error creating volume:", error)
    return { success: false, message: "حدث خطأ أثناء إنشاء المجلد" }
  }
}

export async function updateVolume(formData: FormData) {
  try {
    const supabase = await createClient()

    const id = formData.get("id") as string
    const volumeNumber = Number.parseInt(formData.get("volume_number") as string)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!id || !volumeNumber || !title) {
      return { success: false, message: "يرجى ملء جميع الحقول المطلوبة" }
    }

    // التحقق من عدم تكرار رقم المجلد (باستثناء المجلد الحالي)
    const { data: existingVolume } = await supabase
      .from("volumes")
      .select("id")
      .eq("volume_number", volumeNumber)
      .neq("id", id)
      .single()

    if (existingVolume) {
      return { success: false, message: "رقم المجلد موجود بالفعل" }
    }

    const { error } = await supabase
      .from("volumes")
      .update({
        volume_number: volumeNumber,
        title,
        description,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم تحديث المجلد بنجاح" }
  } catch (error) {
    console.error("Error updating volume:", error)
    return { success: false, message: "حدث خطأ أثناء تحديث المجلد" }
  }
}

export async function deleteVolume(id: string) {
  try {
    const supabase = await createClient()

    // حذف المجلد (سيتم حذف الأعداد المرتبطة تلقائياً بسبب CASCADE)
    const { error } = await supabase.from("volumes").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم حذف المجلد وجميع الأعداد المرتبطة به بنجاح" }
  } catch (error) {
    console.error("Error deleting volume:", error)
    return { success: false, message: "حدث خطأ أثناء حذف المجلد" }
  }
}

export async function createIssue(formData: FormData) {
  try {
    const supabase = await createClient()

    const volumeId = formData.get("volume_id") as string
    const volumeNumber = Number.parseInt(formData.get("volume_number") as string)
    const issueNumber = Number.parseInt(formData.get("issue_number") as string)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!volumeId || !volumeNumber || !issueNumber || !title) {
      return { success: false, message: "يرجى ملء جميع الحقول المطلوبة" }
    }

    // التحقق من عدم تكرار رقم العدد في نفس المجلد
    const { data: existingIssue } = await supabase
      .from("issues")
      .select("id")
      .eq("volume_number", volumeNumber)
      .eq("issue_number", issueNumber)
      .single()

    if (existingIssue) {
      return { success: false, message: "رقم العدد موجود بالفعل في هذا المجلد" }
    }

    const { error } = await supabase.from("issues").insert([
      {
        volume_id: volumeId,
        volume_number: volumeNumber,
        issue_number: issueNumber,
        title,
        description,
      },
    ])

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم إنشاء العدد بنجاح" }
  } catch (error) {
    console.error("Error creating issue:", error)
    return { success: false, message: "حدث خطأ أثناء إنشاء العدد" }
  }
}

export async function updateIssue(formData: FormData) {
  try {
    const supabase = await createClient()

    const id = formData.get("id") as string
    const volumeId = formData.get("volume_id") as string
    const volumeNumber = Number.parseInt(formData.get("volume_number") as string)
    const issueNumber = Number.parseInt(formData.get("issue_number") as string)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (!id || !volumeId || !volumeNumber || !issueNumber || !title) {
      return { success: false, message: "يرجى ملء جميع الحقول المطلوبة" }
    }

    // التحقق من عدم تكرار رقم العدد في نفس المجلد (باستثناء العدد الحالي)
    const { data: existingIssue } = await supabase
      .from("issues")
      .select("id")
      .eq("volume_number", volumeNumber)
      .eq("issue_number", issueNumber)
      .neq("id", id)
      .single()

    if (existingIssue) {
      return { success: false, message: "رقم العدد موجود بالفعل في هذا المجلد" }
    }

    const { error } = await supabase
      .from("issues")
      .update({
        volume_id: volumeId,
        volume_number: volumeNumber,
        issue_number: issueNumber,
        title,
        description,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم تحديث العدد بنجاح" }
  } catch (error) {
    console.error("Error updating issue:", error)
    return { success: false, message: "حدث خطأ أثناء تحديث العدد" }
  }
}

export async function deleteIssue(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("issues").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم حذف العدد بنجاح" }
  } catch (error) {
    console.error("Error deleting issue:", error)
    return { success: false, message: "حدث خطأ أثناء حذف العدد" }
  }
}

export async function getVolumes() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("volumes").select("*").order("volume_number", { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching volumes:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب المجلدات" }
  }
}

export async function getIssues() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("issues")
      .select(`
        *,
        volumes (
          title,
          volume_number
        )
      `)
      .order("volume_number", { ascending: true })
      .order("issue_number", { ascending: true })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching issues:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب الأعداد" }
  }
}

export async function addResearchToIssue(researchId: string, issueId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("accepted_research").update({ issue_id: issueId }).eq("id", researchId)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم إضافة البحث إلى العدد بنجاح" }
  } catch (error) {
    console.error("Error adding research to issue:", error)
    return { success: false, message: "حدث خطأ أثناء إضافة البحث إلى العدد" }
  }
}

export async function removeResearchFromIssue(researchId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("accepted_research").update({ issue_id: null }).eq("id", researchId)

    if (error) throw error

    revalidatePath("/admin/settings")
    return { success: true, message: "تم إزالة البحث من العدد بنجاح" }
  } catch (error) {
    console.error("Error removing research from issue:", error)
    return { success: false, message: "حدث خطأ أثناء إزالة البحث من العدد" }
  }
}

export async function getAcceptedResearch() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("accepted_research")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching accepted research:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب الأبحاث المقبولة" }
  }
}

export async function getResearchInIssue(issueId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("accepted_research")
      .select("*")
      .eq("issue_id", issueId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching research in issue:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب أبحاث العدد" }
  }
}

export async function getUnassignedResearch() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("accepted_research")
      .select("*")
      .is("issue_id", null)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching unassigned research:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب الأبحاث غير المرتبطة" }
  }
}
