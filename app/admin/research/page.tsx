"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Search,
  Loader2,
  Eye,
  Check,
  X,
  Trash2,
  Edit,
  Download,
  Calendar,
  User,
  Building,
  Globe,
  Hash,
} from "lucide-react"
import { toast } from "sonner"
import {
  getResearchSubmissions,
  getAcceptedResearch,
  approveResearchSubmission,
  rejectResearchSubmission,
  deleteAcceptedResearch,
  updateAcceptedResearch,
} from "@/app/actions/research-admin-actions"

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
  cover_image_url: string
  cv_file_url?: string
  cover_letter_url?: string
  status: string
  admin_notes?: string
  created_at: string
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
  cover_image_url: string
  volume_number: string
  issue_number: string
  publication_date: string
  doi?: string
  page_numbers?: string
  created_at: string
}

const downloadFile = (url: string, filename?: string) => {
  if (!url) {
    toast.error("رابط الملف غير متوفر")
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

export default function ResearchManagementPage() {
  const [activeTab, setActiveTab] = useState("requests")
  const [submissions, setSubmissions] = useState<ResearchSubmission[]>([])
  const [acceptedResearch, setAcceptedResearch] = useState<AcceptedResearch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ResearchSubmission | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingResearch, setEditingResearch] = useState<AcceptedResearch | null>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [submissionsResult, acceptedResult] = await Promise.all([getResearchSubmissions(), getAcceptedResearch()])

      if (submissionsResult.success) {
        setSubmissions(submissionsResult.data)
      }

      if (acceptedResult.success) {
        setAcceptedResearch(acceptedResult.data)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmission = (submission: ResearchSubmission, action: "approve" | "reject") => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setAdminNotes("")
    setShowReviewDialog(true)
  }

  const confirmReview = async () => {
    if (!selectedSubmission || !reviewAction) return

    setProcessing(true)
    try {
      const result =
        reviewAction === "approve"
          ? await approveResearchSubmission(selectedSubmission.id, adminNotes)
          : await rejectResearchSubmission(selectedSubmission.id, adminNotes)

      if (result.success) {
        toast.success(result.message)
        setShowReviewDialog(false)
        setSelectedSubmission(null)
        setReviewAction(null)
        setAdminNotes("")
        loadData()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء معالجة الطلب")
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteResearch = async (researchId: string) => {
    const result = await deleteAcceptedResearch(researchId)
    if (result.success) {
      toast.success(result.message)
      setAcceptedResearch(acceptedResearch.filter((r) => r.id !== researchId))
    } else {
      toast.error(result.message)
    }
  }

  const handleEditResearch = (research: AcceptedResearch) => {
    setEditingResearch(research)
    setShowEditDialog(true)
  }

  const handleUpdateResearch = async () => {
    if (!editingResearch) return

    setProcessing(true)
    try {
      const result = await updateAcceptedResearch(editingResearch.id, {
        volume_number: editingResearch.volume_number,
        issue_number: editingResearch.issue_number,
        publication_date: editingResearch.publication_date,
        doi: editingResearch.doi,
        page_numbers: editingResearch.page_numbers,
      })

      if (result.success) {
        toast.success(result.message)
        setShowEditDialog(false)
        setEditingResearch(null)
        loadData()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث البحث")
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">مقبول</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.research_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.researcher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.researcher_institution.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAcceptedResearch = acceptedResearch.filter(
    (research) =>
      research.research_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      research.researcher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      research.researcher_institution.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <h1 className="text-3xl font-bold text-[#001f3f] mb-2">إدارة الأبحاث</h1>
          <p className="text-gray-600">مراجعة وإدارة طلبات الأبحاث والأبحاث المنشورة</p>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="requests" className="flex items-center gap-2" onClick={() => setActiveTab("requests")}>
              <FileText className="w-4 h-4" />
              الطلبات ({submissions.filter((s) => s.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="flex items-center gap-2"
              onClick={() => setActiveTab("published")}
            >
              <Check className="w-4 h-4" />
              الأبحاث ({acceptedResearch.length})
            </TabsTrigger>
          </TabsList>

          {/* تبويب الطلبات */}
          <TabsContent value="requests" className="space-y-6" hidden={activeTab !== "requests"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الطلبات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Badge variant="secondary" className="text-[#001f3f]">
                {filteredSubmissions.length} طلب
              </Badge>
            </div>

            {/* قائمة الطلبات */}
            <div className="grid gap-6">
              {filteredSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
                    <p className="text-gray-500 text-center">لم يتم تقديم أي طلبات أبحاث بعد</p>
                  </CardContent>
                </Card>
              ) : (
                filteredSubmissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-[#001f3f] mb-2">{submission.research_title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {submission.researcher_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {submission.researcher_institution}
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {submission.research_language === "arabic" ? "العربية" : "الإنجليزية"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(submission.status)}
                          <Badge variant="outline" className="text-xs">
                            {new Date(submission.created_at).toLocaleDateString("ar-SA")}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">ملخص البحث:</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">{submission.research_abstract}</p>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">الكلمات المفتاحية:</h4>
                        <div className="flex flex-wrap gap-2">
                          {submission.research_keywords.split("،").map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Hash className="w-3 h-3 mr-1" />
                              {keyword.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-[#001f3f] border-[#001f3f] hover:bg-[#001f3f] hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            مراجعة
                          </Button>
                          {submission.research_file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                downloadFile(submission.research_file_url, `${submission.research_title}.pdf`)
                              }
                            >
                              <Download className="w-4 h-4 mr-1" />
                              تحميل البحث
                            </Button>
                          )}
                        </div>
                        {submission.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReviewSubmission(submission, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              قبول
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReviewSubmission(submission, "reject")}
                            >
                              <X className="w-4 h-4 mr-1" />
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* تبويب الأبحاث المنشورة */}
          <TabsContent value="published" className="space-y-6" hidden={activeTab !== "published"}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الأبحاث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Badge variant="secondary" className="text-[#001f3f]">
                {filteredAcceptedResearch.length} بحث
              </Badge>
            </div>

            {/* قائمة الأبحاث المنشورة */}
            <div className="grid gap-6">
              {filteredAcceptedResearch.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Check className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أبحاث منشورة</h3>
                    <p className="text-gray-500 text-center">لم يتم نشر أي أبحاث بعد</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAcceptedResearch.map((research) => (
                  <Card key={research.id} className="overflow-hidden">
                    <div className="md:flex">
                      {research.cover_image_url && (
                        <div className="md:w-48 h-48 md:h-auto">
                          <img
                            src={research.cover_image_url || "/placeholder.svg"}
                            alt={research.research_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#001f3f] mb-2">{research.research_title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {research.researcher_name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {research.researcher_institution}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                نُشر في: {new Date(research.publication_date).toLocaleDateString("ar-SA")}
                              </div>
                              <Badge variant="outline">
                                المجلد {research.volume_number} - العدد {research.issue_number}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{research.research_abstract}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditResearch(research)}
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
                                    هل أنت متأكد من حذف هذا البحث؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteResearch(research.id)}
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
        </Tabs>

        {/* نافذة مراجعة الطلب */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#001f3f]">
                {reviewAction === "approve" ? "قبول البحث" : "رفض البحث"}
              </DialogTitle>
              <DialogDescription>
                {reviewAction === "approve"
                  ? "سيتم نقل البحث إلى قائمة الأبحاث المقبولة وإرسال إشعار للباحث"
                  : "سيتم رفض البحث وإرسال إشعار للباحث مع الملاحظات"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-notes">
                  {reviewAction === "approve" ? "ملاحظات إضافية (اختياري)" : "سبب الرفض *"}
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    reviewAction === "approve"
                      ? "أي ملاحظات أو تعليقات إضافية..."
                      : "يرجى توضيح أسباب الرفض والتحسينات المطلوبة..."
                  }
                  rows={4}
                  required={reviewAction === "reject"}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)} disabled={processing}>
                  إلغاء
                </Button>
                <Button
                  onClick={confirmReview}
                  disabled={processing || (reviewAction === "reject" && !adminNotes.trim())}
                  className={
                    reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      {reviewAction === "approve" ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          قبول البحث
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          رفض البحث
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* نافذة تعديل البحث */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-[#001f3f]">تعديل معلومات البحث</DialogTitle>
              <DialogDescription>تحديث معلومات النشر للبحث</DialogDescription>
            </DialogHeader>

            {editingResearch && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="volume-number">رقم المجلد</Label>
                    <Input
                      id="volume-number"
                      value={editingResearch.volume_number}
                      onChange={(e) => setEditingResearch({ ...editingResearch, volume_number: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue-number">رقم العدد</Label>
                    <Input
                      id="issue-number"
                      value={editingResearch.issue_number}
                      onChange={(e) => setEditingResearch({ ...editingResearch, issue_number: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="publication-date">تاريخ النشر</Label>
                  <Input
                    id="publication-date"
                    type="date"
                    value={editingResearch.publication_date}
                    onChange={(e) => setEditingResearch({ ...editingResearch, publication_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="doi">DOI (اختياري)</Label>
                  <Input
                    id="doi"
                    value={editingResearch.doi || ""}
                    onChange={(e) => setEditingResearch({ ...editingResearch, doi: e.target.value })}
                    placeholder="10.1234/example.doi"
                  />
                </div>

                <div>
                  <Label htmlFor="page-numbers">أرقام الصفحات (اختياري)</Label>
                  <Input
                    id="page-numbers"
                    value={editingResearch.page_numbers || ""}
                    onChange={(e) => setEditingResearch({ ...editingResearch, page_numbers: e.target.value })}
                    placeholder="1-15"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditDialog(false)
                      setEditingResearch(null)
                    }}
                    disabled={processing}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleUpdateResearch}
                    disabled={processing}
                    className="bg-[#001f3f] hover:bg-[#001f3f]/90"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* نافذة عرض تفاصيل الطلب */}
        <Dialog open={!!selectedSubmission && !showReviewDialog} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#001f3f]">تفاصيل طلب البحث</DialogTitle>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                {/* معلومات الباحث */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات الباحث</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">الاسم</Label>
                      <p className="text-gray-900">{selectedSubmission.researcher_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                      <p className="text-gray-900">{selectedSubmission.researcher_email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">رقم الهاتف</Label>
                      <p className="text-gray-900">{selectedSubmission.researcher_phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">المؤسسة</Label>
                      <p className="text-gray-900">{selectedSubmission.researcher_institution}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* معلومات البحث */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات البحث</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">عنوان البحث</Label>
                      <p className="text-gray-900 font-medium">{selectedSubmission.research_title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">ملخص البحث</Label>
                      <p className="text-gray-900 text-sm leading-relaxed">{selectedSubmission.research_abstract}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">الكلمات المفتاحية</Label>
                        <p className="text-gray-900">{selectedSubmission.research_keywords}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">لغة البحث</Label>
                        <p className="text-gray-900">
                          {selectedSubmission.research_language === "arabic" ? "العربية" : "الإنجليزية"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* الملفات المرفقة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">الملفات المرفقة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#001f3f]" />
                        <span>ملف البحث</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadFile(selectedSubmission.research_file_url, `${selectedSubmission.research_title}.pdf`)
                        }
                      >
                        <Download className="w-4 h-4 mr-1" />
                        تحميل
                      </Button>
                    </div>

                    {selectedSubmission.cover_image_url && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#001f3f]" />
                          <span>صورة الغلاف</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedSubmission.cover_image_url, "_blank")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </Button>
                      </div>
                    )}

                    {selectedSubmission.cv_file_url && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#001f3f]" />
                          <span>السيرة الذاتية</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(
                              selectedSubmission.cv_file_url!,
                              `CV_${selectedSubmission.researcher_name}.pdf`,
                            )
                          }
                        >
                          <Download className="w-4 h-4 mr-1" />
                          تحميل
                        </Button>
                      </div>
                    )}

                    {selectedSubmission.cover_letter_url && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#001f3f]" />
                          <span>خطاب التقديم</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(
                              selectedSubmission.cover_letter_url!,
                              `Cover_Letter_${selectedSubmission.researcher_name}.pdf`,
                            )
                          }
                        >
                          <Download className="w-4 h-4 mr-1" />
                          تحميل
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* معلومات إضافية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات إضافية</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">تاريخ التقديم</Label>
                      <p className="text-gray-900">{new Date(selectedSubmission.created_at).toLocaleString("ar-SA")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">الحالة</Label>
                      <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                    </div>
                    {selectedSubmission.admin_notes && (
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-600">ملاحظات الإدارة</Label>
                        <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">
                          {selectedSubmission.admin_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedSubmission.status === "pending" && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      onClick={() => handleReviewSubmission(selectedSubmission, "approve")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      قبول البحث
                    </Button>
                    <Button variant="destructive" onClick={() => handleReviewSubmission(selectedSubmission, "reject")}>
                      <X className="w-4 h-4 mr-2" />
                      رفض البحث
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
