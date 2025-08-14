"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"

interface ShareButtonProps {
  platform: "facebook" | "twitter" | "linkedin" | "copy"
  url: string
  title: string
  className?: string
  children: React.ReactNode
}

export default function ShareButton({ platform, url, title, className, children }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank")
        break
      case "copy":
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          console.error("Failed to copy:", err)
        }
        break
    }
  }

  return (
    <button onClick={handleShare} className={className}>
      {copied && platform === "copy" ? (
        <>
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">تم النسخ</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
