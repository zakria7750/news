"use client"

import type React from "react"

interface DownloadButtonProps {
  url: string | null
  filename?: string
  children: React.ReactNode
  variant?: "primary" | "floating"
}

export const DownloadButton = ({ url, filename, children, variant = "primary" }: DownloadButtonProps) => {
  const handleDownload = () => {
    if (!url) {
      alert("رابط الملف غير متوفر")
      return
    }

    const link = document.createElement("a")
    link.href = url
    link.download = filename || "download"
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const baseClasses = "transition-colors font-bold flex items-center space-x-2 space-x-reverse justify-center"

  const variantClasses = {
    primary: "bg-[#FFD700] text-[#001f3f] px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-yellow-400 w-full sm:w-auto",
    floating:
      "bg-white/90 backdrop-blur-sm text-[#001f3f] px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm hover:bg-white",
  }

  return (
    <button onClick={handleDownload} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  )
}
