"use client"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeaderProps {
  onMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
              <Image
                src="/images/waei-logo.png"
                alt="شعار مجلة وعي"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#001f3f]">مجلة وعي</h1>
              <p className="text-sm md:text-base text-gray-600">مجلة وعي للدراسات والبحوث العلمية</p>
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
