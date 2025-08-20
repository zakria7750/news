"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import SocialMediaButtons from "./SocialMediaButtons"
import { Phone, Mail, MapPin, ChevronUp, Loader2, BookOpen, Users, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { subscribeToNewsletter } from "@/app/actions/news-actions"
import { toast } from "sonner"
import Image from "next/image"

export default function Footer() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [email, setEmail] = useState("")

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("يرجى إدخال بريدك الإلكتروني")
      return
    }

    setIsSubscribing(true)
    const formData = new FormData()
    formData.append("email", email)

    try {
      const result = await subscribeToNewsletter(formData)
      if (result.success) {
        toast.success(result.message)
        setEmail("")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-[#001f3f] text-white relative">
      {/* Scroll to Top Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Button
          onClick={scrollToTop}
          className="bg-[#FFD700] text-[#001f3f] hover:bg-[#FFD700]/90 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ChevronUp size={20} />
        </Button>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {/* Magazine Info */}
          <div className="space-y-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <Image
                  src="/images/waei-logo.png"
                  alt="شعار مجلة وعي"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#FFD700]">مجلة وعي</h3>
                <p className="text-sm text-gray-300">مجلة أكاديمية محكمة</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              مجلة أكاديمية محكمة تهدف إلى نشر البحوث والدراسات الأكاديمية المتميزة في مختلف المجالات العلمية
              والإنسانية.
            </p>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">روابط سريعة</h4>
                <ul className="space-y-3">
                  {[
                    { name: "الرئيسية", href: "/", icon: BookOpen },
                    { name: "عن المجلة", href: "/about", icon: Users },
                    { name: "هيئة التحرير", href: "/editorial-board", icon: Users },
                    { name: "تعليمات النشر", href: "/submission-guidelines", icon: BookOpen },
                    { name: "الأعداد", href: "/issues", icon: Award },
                    { name: "تقديم بحث", href: "/submit", icon: Globe },
                  ].map((link) => {
                    const Icon = link.icon
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="flex items-center space-x-2 space-x-reverse text-gray-300 hover:text-[#FFD700] transition-colors duration-200 group"
                        >
                          <Icon size={16} className="group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-[#FFD700] border-b border-[#FFD700]/30 pb-2">تواصل معنا</h4>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <SocialMediaButtons/>
                    <div className="w-8 h-8 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin size={16} className="text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        المملكة العربية السعودية
                        <br />
                        الرياض - حي الملك فهد
                        <br />
                        ص.ب: 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                      <Phone size={16} className="text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">+966 11 123 4567</p>
                      <p className="text-gray-300 text-sm">+966 50 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                      <Mail size={16} className="text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">info@waei-magazine.com</p>
                      <p className="text-gray-300 text-sm">editor@waei-magazine.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-[#FFD700]/20">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-bold text-[#FFD700] mb-4">اشترك في نشرتنا الإخبارية</h4>
            <p className="text-gray-300 mb-6">احصل على آخر الأخبار والتحديثات حول المجلة والأنشطة الأكاديمية</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-[#FFD700]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FFD700] focus:bg-white/20 transition-all duration-200"
                disabled={isSubscribing}
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-[#FFD700] text-[#001f3f] hover:bg-[#FFD700]/90 font-bold px-6 py-3 rounded-lg whitespace-nowrap disabled:opacity-50"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الاشتراك...
                  </>
                ) : (
                  "اشتراك"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#FFD700]/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-sm">© 2024 مجلة وعي. جميع الحقوق محفوظة.</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6 space-x-reverse text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-[#FFD700] transition-colors duration-200">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-[#FFD700] transition-colors duration-200">
                الشروط والأحكام
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-[#FFD700] transition-colors duration-200">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-8 pt-6 border-t border-[#FFD700]/10">
          <div className="flex flex-wrap justify-center items-center space-x-8 space-x-reverse opacity-60">
            <div className="text-xs text-gray-400 text-center">
              <Award size={24} className="mx-auto mb-1 text-[#FFD700]" />
              <span>مجلة محكمة</span>
            </div>
            <div className="text-xs text-gray-400 text-center">
              <Globe size={24} className="mx-auto mb-1 text-[#FFD700]" />
              <span>نشر دولي</span>
            </div>
            <div className="text-xs text-gray-400 text-center">
              <BookOpen size={24} className="mx-auto mb-1 text-[#FFD700]" />
              <span>جودة أكاديمية</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
