"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Info, Users, FileText, BookOpen, Newspaper, Mail, Upload, ChevronRight } from "lucide-react"

const menuItems = [
  { name: "الرئيسية", href: "/", icon: Home },
  { name: "عن المجلة", href: "/about", icon: Info },
  { name: "هيئة التحرير", href: "/editorial-board", icon: Users },
  { name: "تعليمات النشر", href: "/submission-guidelines", icon: FileText },
  { name: "الأعداد", href: "/issues", icon: BookOpen },
  { name: "الأخبار والأنشطة", href: "/news", icon: Newspaper },
  { name: "تواصل معنا", href: "/contact", icon: Mail },
  { name: "تقديم بحث", href: "/submit", icon: Upload },
]

interface SidebarProps {
  isMobileMenuOpen: boolean
  onMobileMenuClose: () => void
}

export function Sidebar({ isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onMobileMenuClose} />}

      {/* Sidebar */}
      <aside
        className={`${
          isExpanded ? "overflow-y-scroll" : "overflow-hidden"
        } fixed md:sticky top-0 inset-0 right-0 md:right-auto md:left-0 z-50 h-screen bg-[#001f3f] text-white transition-all duration-300 ease-in-out ${
          isExpanded ? "w-64" : "w-16"
        } ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-[#FFD700]/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#001f3f] font-bold text-sm">و</span>
            </div>
            {isExpanded && <span className="font-bold text-sm whitespace-nowrap">مجلة وعي</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onMobileMenuClose}
                    className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition-all duration-200 group ${
                      isActive ? "bg-[#FFD700] text-[#001f3f]" : "text-white hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {isExpanded && (
                      <>
                        <span className="font-medium whitespace-nowrap">{item.name}</span>
                        <ChevronRight
                          size={16}
                          className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
