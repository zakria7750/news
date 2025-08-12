"use client"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* شعار المجلة واسمها */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#001f3f] rounded-lg flex items-center justify-center">
              <span className="text-[#FFD700] font-bold text-lg">و</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#001f3f]">مجلة وعي</h1>
              <p className="text-xs text-gray-600">مجلة أكاديمية محكمة</p>
            </div>
          </div>

          {/* زر القائمة للهاتف */}
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="md:hidden">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
