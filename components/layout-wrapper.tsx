"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import Footer from "./footer"
import { Toaster } from "sonner"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMobileMenuClose} />
      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />     
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster position="top-center" richColors />
    </div>
  )
}
