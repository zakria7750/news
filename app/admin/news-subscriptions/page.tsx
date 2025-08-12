"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Users, Newspaper, Calendar, Mail, Search, Loader2, Upload, X, Edit } from "lucide-react"
import { toast } from "sonner"
import { getNewsletterSubscriptions, deleteNewsletterSubscription } from "@/app/actions/news-actions"
import { getNews, createNews, deleteNews, updateNews } from "@/app/actions/news-actions"

interface Subscription {
  id: number
  email: string
  subscribed_at: string
  is_active: boolean
}

interface News {
  id: number
  title: string
  description: string
  image_path: string | null
  publish_date: string
  created_at: string
}

export default function NewsSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("news")
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false)
  const [isCreatingNews, setIsCreatingNews] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isEditNewsOpen, setIsEditNewsOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    publish_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subscriptionsResult, newsResult] = await Promise.all([getNewsletterSubscriptions(), getNews()])

      if (subscriptionsResult.success) {
        setSubscriptions(subscriptionsResult.data)
      }

      if (newsResult.success) {
        setNews(newsResult.data)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubscription = async (id: number) => {
    const result = await deleteNewsletterSubscription(id)
    if (result.success) {
      toast.success(result.message)
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id))
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteNews = async (id: number) => {
    const result = await deleteNews(id)
    if (result.success) {
      toast.success(result.message)
      setNews(news.filter((item) => item.id !== id))
    } else {
      toast.error(result.message)
    }
  }

  const handleEditNews = (newsItem: any) => {
    setEditingNews(newsItem)
    setNewsForm({
      title: newsItem.title,
      description: newsItem.description,
      publish_date: newsItem.publish_date,
    })
    setImagePreview(newsItem.image_path)
    setIsEditNewsOpen(true)
  }

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsForm.title.trim() || !newsForm.description.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    if (!selectedImage && !editingNews) {
      toast.error("يرجى اختيار صورة للخبر")
      return
    }

    setIsCreatingNews(true)

    try {
      const formData = new FormData()
      formData.append("title", newsForm.title)
      formData.append("description", newsForm.description)
      formData.append("publish_date", newsForm.publish_date)

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      if (editingNews) {
        formData.append("id", editingNews.id.toString())
      }

      const result = editingNews ? await updateNews(formData) : await createNews(formData)

      if (result.success) {
        toast.success(result.message)
        setIsCreateNewsOpen(false)
        setIsEditNewsOpen(false)
        setEditingNews(null)
        setNewsForm({
          title: "",
          description: "",
          publish_date: new Date().toISOString().split("T")[0],
        })
        setSelectedImage(null)
        setImagePreview(null)
        loadData()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الخبر")
    } finally {
      setIsCreatingNews(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("يرجى اختيار ملف صورة صحيح")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#001f3f]" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#001f3f] mb-2">إدارة الأخبار والاشتراكات</h1>
          <p className="text-gray-600">إدارة الأخبار والمشتركين في النشرة الإخبارية</p>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="news" className="flex items-center gap-2" onClick={() => setActiveTab("news")}>
              <Newspaper className="w-4 h-4" />
              الأخبار
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("subscriptions")}
            >
              <Users className="w-4 h-4" />
              الاشتراكات
            </TabsTrigger>
          </TabsList>

          {/* تبويب الأخبار */}
          <TabsContent value="news" className="space-y-6" hidden={activeTab !== "news"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في الأخبار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <Dialog open={isCreateNewsOpen} onOpenChange={setIsCreateNewsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#001f3f] hover:bg-[#001f3f]/90 text-white">
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء خبر
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#001f3f]">إنشاء خبر جديد</DialogTitle>
                    <DialogDescription>
                      أضف خبراً جديداً وسيتم إرساله تلقائياً للمشتركين في النشرة الإخبارية
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmitNews} className="space-y-6">
                    {/* رفع الصورة */}
                    <div className="space-y-2">
                      <Label htmlFor="image">صورة الخبر *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#001f3f] transition-colors relative">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="معاينة الصورة"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 left-2"
                              onClick={() => {
                                setSelectedImage(null)
                                setImagePreview(null)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">اضغط لاختيار صورة أو اسحبها هنا</p>
                            <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                          </div>
                        )}
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* عنوان الخبر */}
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الخبر *</Label>
                      <Input
                        id="title"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        placeholder="أدخل عنوان الخبر"
                        required
                      />
                    </div>

                    {/* وصف الخبر */}
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف الخبر *</Label>
                      <Textarea
                        id="description"
                        value={newsForm.description}
                        onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                        placeholder="أدخل وصف الخبر"
                        rows={4}
                        required
                      />
                    </div>

                    {/* تاريخ النشر */}
                    <div className="space-y-2">
                      <Label htmlFor="publish_date">تاريخ النشر *</Label>
                      <Input
                        id="publish_date"
                        type="date"
                        value={newsForm.publish_date}
                        onChange={(e) => setNewsForm({ ...newsForm, publish_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateNewsOpen(false)}
                        disabled={isCreatingNews}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={isCreatingNews} className="bg-[#001f3f] hover:bg-[#001f3f]/90">
                        {isCreatingNews ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            إنشاء خبر
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditNewsOpen} onOpenChange={setIsEditNewsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#001f3f]">تعديل الخبر</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitNews} className="space-y-6">
                    {/* رفع الصورة */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">صورة الخبر</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#001f3f] transition-colors relative">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="معاينة الصورة"
                              className="max-w-full h-48 object-cover rounded-lg mx-auto"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 left-2"
                              onClick={() => {
                                setSelectedImage(null)
                                setImagePreview(editingNews?.image_path || null)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">اضغط لاختيار صورة جديدة</p>
                            <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                          </div>
                        )}
                        <input
                          id="edit-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* عنوان الخبر */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">عنوان الخبر *</Label>
                      <Input
                        id="edit-title"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        placeholder="أدخل عنوان الخبر"
                        required
                      />
                    </div>

                    {/* وصف الخبر */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">وصف الخبر *</Label>
                      <Textarea
                        id="edit-description"
                        value={newsForm.description}
                        onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                        placeholder="أدخل وصف الخبر"
                        rows={4}
                        required
                      />
                    </div>

                    {/* تاريخ النشر */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-publish_date">تاريخ النشر *</Label>
                      <Input
                        id="edit-publish_date"
                        type="date"
                        value={newsForm.publish_date}
                        onChange={(e) => setNewsForm({ ...newsForm, publish_date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditNewsOpen(false)
                          setEditingNews(null)
                          setSelectedImage(null)
                          setImagePreview(null)
                        }}
                        disabled={isCreatingNews}
                      >
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={isCreatingNews} className="bg-[#001f3f] hover:bg-[#001f3f]/90">
                        {isCreatingNews ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            حفظ التعديلات
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* قائمة الأخبار */}
            <div className="grid gap-6">
              {filteredNews.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Newspaper className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أخبار</h3>
                    <p className="text-gray-500 text-center">لم يتم إنشاء أي أخبار بعد</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNews.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="md:flex">
                      {item.image_path && (
                        <div className="md:w-48 h-48 md:h-auto">
                          <img
                            src={item.image_path || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#001f3f] mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.publish_date).toLocaleDateString("ar-SA")}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditNews(item)}
                              className="text-[#001f3f] border-[#001f3f] hover:bg-[#001f3f] hover:text-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا الخبر؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteNews(item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* تبويب الاشتراكات */}
          <TabsContent value="subscriptions" className="space-y-6" hidden={activeTab !== "subscriptions"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في الاشتراكات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <Badge variant="secondary" className="text-[#001f3f]">
                {subscriptions.length} مشترك
              </Badge>
            </div>

            {/* قائمة الاشتراكات */}
            <div className="grid gap-4">
              {filteredSubscriptions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد اشتراكات</h3>
                    <p className="text-gray-500 text-center">لم يشترك أحد في النشرة الإخبارية بعد</p>
                  </CardContent>
                </Card>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#001f3f]/10 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#001f3f]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscription.email}</p>
                          <p className="text-sm text-gray-500">
                            اشترك في {new Date(subscription.subscribed_at).toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من حذف هذا الاشتراك؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSubscription(subscription.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
