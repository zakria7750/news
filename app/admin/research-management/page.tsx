"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import {
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  FileText,
  ImageIcon,
  User,
  Building,
  Languages,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from "lucide-react"
import {
  getResearchSubmissions,
  getAcceptedResearch,
  updateSubmissionStatus,
  deleteResearchSubmission,
  deleteAcceptedResearch,
} from "@/app/actions/research-actions"

interface ResearchSubmission {
  id: string
  researcher_name: string
  researcher_email: string
  researcher_phone: string
  researcher_institution: string
  research_title: string
  research_abstract: string
  research_keywords: string
  research_language: string
  research_file_url: string
  cover_image_url?: string
  cv_file_url?: string
  cover_letter_url?: string
  status: "pending" | "accepted" | "rejected"
  admin_notes?: string
  created_at: string
  updated_at: string
  reviewed_at?: string
}

interface AcceptedResearch {
  id: string
  submission_id: string
  researcher_name: string
  researcher_email: string
  researcher_phone: string
  researcher_institution: string
  research_title: string
  research_abstract: string
  research_keywords: string
  research_language: string
  research_file_url: string
  cover_image_url?: string
  publication_date?: string
  issue_number?: string
  volume_number?: string
  page_numbers?: string
  doi?: string
  created_at: string
  updated_at: string
}

export default function ResearchManagementPage() {
  const [submissions, setSubmissions] = useState<ResearchSubmission[]>([])
  const [acceptedResearch, setAcceptedResearch] = useState<AcceptedResearch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ResearchSubmission | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [submissionsResult, acceptedResult] = await Promise.all([getResearchSubmissions(), getAcceptedResearch()])

      if (submissionsResult.success) {
        setSubmissions(submissionsResult.data || [])
      }

      if (acceptedResult.success) {
        setAcceptedResearch(acceptedResult.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (submissionId: string, status: "accepted" | "rejected", notes?: string) => {
    try {
      const result = await updateSubmissionStatus(submissionId, status, notes)
      if (result.success) {
        await loadData()
        setReviewDialogOpen(false)
        setSelectedSubmission(null)
        setAdminNotes("")
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const result = await deleteResearchSubmission(submissionId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
    }
  }

  const handleDeleteAcceptedResearch = async (researchId: string) => {
    try {
      const result = await deleteAcceptedResearch(researchId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Error deleting research:", error)
    }
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.research_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.researcher_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAcceptedResearch = acceptedResearch.filter(
    (research) =>
      research.research_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      research.researcher_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 ml-1" />
            قيد المراجعة
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 ml-1" />
            مقبول
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </Badge>
        )
      default:
        return null
    }
  }

  const ReviewDialog = ({ submission }: { submission: ResearchSubmission }) => (
    <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#001f3f]">مراجعة طلب النشر</DialogTitle>
          <DialogDescription>مراجعة تفاصيل البحث المقدم</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات الباحث */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#001f3f] flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات الباحث
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">اسم الباحث</Label>
                  <p className="text-[#001f3f] font-medium">{submission.researcher_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                  <p className="text-[#001f3f]">{submission.researcher_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">رقم الهاتف</Label>
                  <p className="text-[#001f3f]">{submission.researcher_phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">المؤسسة</Label>
                  <p className="text-[#001f3f]">{submission.researcher_institution}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات البحث */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#001f3f] flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                معلومات البحث
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">عنوان البحث</Label>
                <p className="text-[#001f3f] font-medium">{submission.research_title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">ملخص البحث</Label>
                <p className="text-gray-700 leading-relaxed">{submission.research_abstract}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">الكلمات المفتاحية</Label>
                  <p className="text-[#001f3f]">{submission.research_keywords}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">لغة البحث</Label>
                  <p className="text-[#001f3f]">
                    {submission.research_language === "arabic" ? "العربية" : "الإنجليزية"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* الملفات المرفقة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#001f3f] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                الملفات المرفقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4 bg-transparent"
                  onClick={() => window.open(submission.research_file_url, "_blank")}
                >
                  <FileText className="w-5 h-5 ml-2" />
                  <div className="text-right">
                    <p className="font-medium">ملف البحث</p>
                    <p className="text-sm text-gray-500">اضغط للتحميل</p>
                  </div>
                </Button>

                {submission.cover_image_url && (
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => window.open(submission.cover_image_url!, "_blank")}
                  >
                    <ImageIcon className="w-5 h-5 ml-2" />
                    <div className="text-right">
                      <p className="font-medium">صورة الغلاف</p>
                      <p className="text-sm text-gray-500">اضغط للعرض</p>
                    </div>
                  </Button>
                )}

                {submission.cv_file_url && (
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => window.open(submission.cv_file_url!, "_blank")}
                  >
                    <User className="w-5 h-5 ml-2" />
                    <div className="text-right">
                      <p className="font-medium">السيرة الذاتية</p>
                      <p className="text-sm text-gray-500">اضغط للتحميل</p>
                    </div>
                  </Button>
                )}

                {submission.cover_letter_url && (
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => window.open(submission.cover_letter_url!, "_blank")}
                  >
                    <FileText className="w-5 h-5 ml-2" />
                    <div className="text-right">
                      <p className="font-medium">خطاب التقديم</p>
                      <p className="text-sm text-gray-500">اضغط للتحميل</p>
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ملاحظات الإدارة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#001f3f]">ملاحظات الإدارة</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="أضف ملاحظات حول قرار المراجعة..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* أزرار القرار */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleStatusUpdate(submission.id, "accepted", adminNotes)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 ml-2" />
              قبول البحث
            </Button>
            <Button onClick={() => handleStatusUpdate(submission.id, "rejected", adminNotes)} variant="destructive">
              <X className="w-4 h-4 ml-2" />
              رفض البحث
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#001f3f] mb-4">إدارة الأبحاث</h1>
            <p className="text-gray-600">إدارة طلبات النشر والأبحاث المقبولة</p>
          </div>

          {/* شريط البحث */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في الأبحاث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                الطلبات ({submissions.filter((s) => s.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                الأبحاث المقبولة ({acceptedResearch.length})
              </TabsTrigger>
            </TabsList>

            {/* تبويب الطلبات */}
            <TabsContent value="submissions" className="space-y-6">
              <div className="grid gap-6">
                {filteredSubmissions.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد طلبات نشر</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#001f3f] mb-2">{submission.research_title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {submission.researcher_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {submission.researcher_institution}
                              </span>
                              <span className="flex items-center gap-1">
                                <Languages className="w-4 h-4" />
                                {submission.research_language === "arabic" ? "العربية" : "الإنجليزية"}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2 mb-3">{submission.research_abstract}</p>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(submission.status)}
                              <span className="text-xs text-gray-500">
                                {new Date(submission.created_at).toLocaleDateString("ar-SA")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(submission)
                              setAdminNotes(submission.admin_notes || "")
                              setReviewDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            مراجعة
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 ml-1" />
                                حذف
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* تبويب الأبحاث المقبولة */}
            <TabsContent value="accepted" className="space-y-6">
              <div className="grid gap-6">
                {filteredAcceptedResearch.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد أبحاث مقبولة</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAcceptedResearch.map((research) => (
                    <Card key={research.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#001f3f] mb-2">{research.research_title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {research.researcher_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {research.researcher_institution}
                              </span>
                              <span className="flex items-center gap-1">
                                <Languages className="w-4 h-4" />
                                {research.research_language === "arabic" ? "العربية" : "الإنجليزية"}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2 mb-3">{research.research_abstract}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                منشور
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(research.created_at).toLocaleDateString("ar-SA")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(research.research_file_url, "_blank")}
                          >
                            <Download className="w-4 h-4 ml-1" />
                            تحميل
                          </Button>

                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 ml-1" />
                            تعديل
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 ml-1" />
                                حذف
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف هذا البحث؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAcceptedResearch(research.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* حوار المراجعة */}
          {selectedSubmission && <ReviewDialog submission={selectedSubmission} />}
        </div>
      </div>
    </div>
  )
}
