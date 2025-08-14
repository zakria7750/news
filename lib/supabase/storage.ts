import { createClient } from "@/lib/supabase/server"

export async function getFileUrl(filePath: string | null): Promise<string | null> {
  if (!filePath) return null

  try {
    const supabase = await createClient()

    const { data } = supabase.storage.from("research-files").getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error getting file URL:", error)
    return null
  }
}

export function downloadFile(url: string, filename?: string) {
  if (!url) return

  const link = document.createElement("a")
  link.href = url
  link.download = filename || "download"
  link.target = "_blank"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
