"use server"

import { createClient } from "@/lib/supabase/server"
import { getFileUrl } from "@/lib/supabase/storage"

export async function getPublishedIssues() {
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
      .order("volume_number", { ascending: false })
      .order("issue_number", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching published issues:", error)
    return { success: false, data: [], message: "حدث خطأ أثناء جلب الأعداد المنشورة" }
  }
}

export async function getIssueWithResearch(issueId: string) {
  try {
    const supabase = await createClient()

    // جلب بيانات العدد
    const { data: issue, error: issueError } = await supabase
      .from("issues")
      .select(`
        *,
        volumes (
          title,
          volume_number
        )
      `)
      .eq("id", issueId)
      .single()

    if (issueError) throw issueError

    // جلب الأبحاث المرتبطة بالعدد
    const { data: research, error: researchError } = await supabase
      .from("accepted_research")
      .select("*")
      .eq("issue_id", issueId)
      .order("created_at", { ascending: true })

    if (researchError) throw researchError

    const researchWithUrls = await Promise.all(
      (research || []).map(async (item) => ({
        ...item,
        title: item.research_title,
        abstract: item.research_abstract,
        author_name: item.researcher_name,
        institution: item.researcher_institution,
        keywords: item.research_keywords,
        language: item.research_language,
        cover_image_url: await getFileUrl(item.cover_image_url),
        research_file_url: await getFileUrl(item.research_file_url),
      })),
    )

    return {
      success: true,
      data: {
        issue,
        research: researchWithUrls,
      },
    }
  } catch (error) {
    console.error("Error fetching issue with research:", error)
    return { success: false, data: null, message: "حدث خطأ أثناء جلب بيانات العدد" }
  }
}

export async function getResearchById(researchId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("accepted_research")
      .select(`
        *,
        issues (
          id,
          title,
          issue_number,
          volume_number,
          publication_date,
          volumes (
            title,
            volume_number
          )
        )
      `)
      .eq("id", researchId)
      .single()

    if (error) throw error

    const researchWithUrls = {
      ...data,
      title: data.research_title,
      abstract: data.research_abstract,
      author_name: data.researcher_name,
      institution: data.researcher_institution,
      keywords: data.research_keywords,
      language: data.research_language,
      cover_image_url: await getFileUrl(data.cover_image_url),
      research_file_url: await getFileUrl(data.research_file_url),
    }

    return { success: true, data: researchWithUrls }
  } catch (error) {
    console.error("Error fetching research:", error)
    return { success: false, data: null, message: "حدث خطأ أثناء جلب بيانات البحث" }
  }
}
