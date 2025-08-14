"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, BookOpen, FolderOpen, Calendar, Loader2, FileText, Users } from "lucide-react"
import { toast } from "sonner"
import {
  createVolume,
  updateVolume,
  deleteVolume,
  createIssue,
  updateIssue,
  deleteIssue,
  getVolumes,
  getIssues,
  getAcceptedResearch,
  getUnassignedResearch,
  getResearchInIssue,
  addResearchToIssue,
  removeResearchFromIssue,
} from "@/app/actions/volumes-actions"

interface Volume {
  id: string
  volume_number: number
  title: string
  description: string
  created_at: string
}

interface Issue {
  id: string
  volume_id: string
  volume_number: number
  issue_number: number
  title: string
  description: string
  publication_date: string
  created_at: string
  volumes?: {
    title: string
    volume_number: number
  }
}

interface Research {
  id: string
  research_title: string
  researcher_name: string
  research_abstract: string
  issue_id: string | null
  created_at: string
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("issues")
  const [volumes, setVolumes] = useState<Volume[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [allResearch, setAllResearch] = useState<Research[]>([])
  const [unassignedResearch, setUnassignedResearch] = useState<Research[]>([])
  const [issueResearch, setIssueResearch] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)

  // نماذج الإضافة والتعديل
  const [showVolumeModal, setShowVolumeModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showResearchModal, setShowResearchModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [researchTab, setResearchTab] = useState("add")
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null)
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [volumeForm, setVolumeForm] = useState({
    volume_number: "",
    title: "",
    description: "",
  })

  const [issueForm, setIssueForm] = useState({
    volume_id: "",
    volume_number: "",
    issue_number: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [volumesResult, issuesResult, researchResult] = await Promise.all([
        getVolumes(),
        getIssues(),
        getAcceptedResearch(),
      ])

      if (volumesResult.success) {
        setVolumes(volumesResult.data)
      }

      if (issuesResult.success) {
        setIssues(issuesResult.data)
      }

      if (researchResult.success) {
        setAllResearch(researchResult.data)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handleManageResearch = async (issue: Issue) => {
    setSelectedIssue(issue)
    setResearchTab("add")
    setShowResearchModal(true)

    try {
      const [unassignedResult, issueResearchResult] = await Promise.all([
        getUnassignedResearch(),
        getResearchInIssue(issue.id),
      ])

      console.log("Unassigned research result:", unassignedResult)
      console.log("Issue research result:", issueResearchResult)

      if (unassignedResult.success) {
        setUnassignedResearch(unassignedResult.data)
        console.log("Unassigned research data:", unassignedResult.data)
      } else {
        console.error("Failed to fetch unassigned research:", unassignedResult.message)
        toast.error(unassignedResult.message || "حدث خطأ أثناء جلب الأبحاث غير المرتبطة")
      }

      if (issueResearchResult.success) {
        setIssueResearch(issueResearchResult.data)
        console.log("Issue research data:", issueResearchResult.data)
      } else {
        console.error("Failed to fetch issue research:", issueResearchResult.message)
        toast.error(issueResearchResult.message || "حدث خطأ أثناء جلب أبحاث العدد")
      }
    } catch (error) {
      console.error("Error in handleManageResearch:", error)
      toast.error("حدث خطأ أثناء جلب بيانات الأبحاث")
    }
  }

  const handleAddResearchToIssue = async (researchId: string) => {
    if (!selectedIssue) return

    const result = await addResearchToIssue(researchId, selectedIssue.id)
    if (result.success) {
      toast.success(result.message)
      // إعادة تحميل البيانات
      handleManageResearch(selectedIssue)
    } else {
      toast.error(result.message)
    }
  }

  const handleRemoveResearchFromIssue = async (researchId: string) => {
    if (!selectedIssue) return

    const result = await removeResearchFromIssue(researchId)
    if (result.success) {
      toast.success(result.message)
      // إعادة تحميل البيانات
      handleManageResearch(selectedIssue)
    } else {
      toast.error(result.message)
    }
  }

  const handleVolumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("volume_number", volumeForm.volume_number)
      formData.append("title", volumeForm.title)
      formData.append("description", volumeForm.description)

      if (editingVolume) {
        formData.append("id", editingVolume.id)
      }

      const result = editingVolume ? await updateVolume(formData) : await createVolume(formData)

      if (result.success) {
        toast.success(result.message)
        setShowVolumeModal(false)
        setEditingVolume(null)
        setVolumeForm({ volume_number: "", title: "", description: "" })
        loadData()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المجلد")
    } finally {
      setSubmitting(false)
    }
  }

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("volume_id", issueForm.volume_id)
      formData.append("volume_number", issueForm.volume_number)
      formData.append("issue_number", issueForm.issue_number)
      formData.append("title", issueForm.title)
      formData.append("description", issueForm.description)

      if (editingIssue) {
        formData.append("id", editingIssue.id)
      }

      const result = editingIssue ? await updateIssue(formData) : await createIssue(formData)

      if (result.success) {
        toast.success(result.message)
        setShowIssueModal(false)
        setEditingIssue(null)
        setIssueForm({ volume_id: "", volume_number: "", issue_number: "", title: "", description: "" })
        loadData()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ العدد")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVolume = async (id: string) => {
    const result = await deleteVolume(id)
    if (result.success) {
      toast.success(result.message)
      loadData()
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteIssue = async (id: string) => {
    const result = await deleteIssue(id)
    if (result.success) {
      toast.success(result.message)
      loadData()
    } else {
      toast.error(result.message)
    }
  }

  const handleEditVolume = (volume: Volume) => {
    setEditingVolume(volume)
    setVolumeForm({
      volume_number: volume.volume_number.toString(),
      title: volume.title,
      description: volume.description || "",
    })
    setShowVolumeModal(true)
  }

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue)
    setIssueForm({
      volume_id: issue.volume_id,
      volume_number: issue.volume_number.toString(),
      issue_number: issue.issue_number.toString(),
      title: issue.title,
      description: issue.description || "",
    })
    setShowIssueModal(true)
  }

  const handleVolumeSelect = (volumeId: string) => {
    const selectedVolume = volumes.find((v) => v.id === volumeId)
    if (selectedVolume) {
      setIssueForm({
        ...issueForm,
        volume_id: volumeId,
        volume_number: selectedVolume.volume_number.toString(),
      })
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#001f3f]">إدارة الإعدادات</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">إدارة المجلدات والأعداد</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => setShowVolumeModal(true)}
              className="bg-[#001f3f] text-white hover:bg-[#003366] flex items-center justify-center space-x-2 space-x-reverse text-sm sm:text-base py-2 px-3 sm:px-4"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مجلد</span>
            </Button>
            <Button
              onClick={() => setShowIssueModal(true)}
              className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 flex items-center justify-center space-x-2 space-x-reverse text-sm sm:text-base py-2 px-3 sm:px-4"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عدد</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <Tabs defaultValue="issues" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:mx-0">
            <TabsTrigger value="issues" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              الأعداد
            </TabsTrigger>
            <TabsTrigger value="volumes" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              المجلدات
            </TabsTrigger>
          </TabsList>

          {/* تبويب الأعداد */}
          <TabsContent value="issues" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {issues.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">لا توجد أعداد</h3>
                    <p className="text-sm sm:text-base text-gray-500 text-center">لم يتم إنشاء أي أعداد بعد</p>
                  </CardContent>
                </Card>
              ) : (
                issues.map((issue) => (
                  <Card key={issue.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center space-x-3 space-x-reverse flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#001f3f] rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                            {issue.volume_number}-{issue.issue_number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-[#001f3f] text-base sm:text-lg leading-tight">
                              {issue.title}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse w-full sm:w-auto justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageResearch(issue)}
                            className="text-[#FFD700] border-[#FFD700] hover:bg-[#FFD700] hover:text-[#001f3f] text-xs sm:text-sm px-2 sm:px-3"
                          >
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline ml-1">الأبحاث</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditIssue(issue)}
                            className="text-[#001f3f] border-[#001f3f] hover:bg-[#001f3f] hover:text-white text-xs sm:text-sm px-2 sm:px-3"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mx-4 max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base sm:text-lg">تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm sm:text-base">
                                  هل أنت متأكد من حذف هذا العدد؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteIssue(issue.id)}
                                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{new Date(issue.publication_date).toLocaleDateString("ar-SA")}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>المجلد {issue.volume_number}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{allResearch.filter((r) => r.issue_id === issue.id).length} بحث</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* تبويب المجلدات */}
          <TabsContent value="volumes" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6">
              {volumes.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                    <FolderOpen className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">لا توجد مجلدات</h3>
                    <p className="text-sm sm:text-base text-gray-500 text-center">لم يتم إنشاء أي مجلدات بعد</p>
                  </CardContent>
                </Card>
              ) : (
                volumes.map((volume) => (
                  <Card key={volume.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-start sm:items-center space-x-3 space-x-reverse flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD700] rounded-lg flex items-center justify-center text-[#001f3f] font-bold text-sm sm:text-base flex-shrink-0">
                            {volume.volume_number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-[#001f3f] text-base sm:text-lg leading-tight">
                              {volume.title}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{volume.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse w-full sm:w-auto justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVolume(volume)}
                            className="text-[#001f3f] border-[#001f3f] hover:bg-[#001f3f] hover:text-white text-xs sm:text-sm px-2 sm:px-3"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mx-4 max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base sm:text-lg">تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm sm:text-base">
                                  هل أنت متأكد من حذف هذا المجلد؟ سيتم حذف جميع الأعداد المرتبطة به أيضاً. لا يمكن
                                  التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVolume(volume.id)}
                                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>تم الإنشاء في {new Date(volume.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{issues.filter((i) => i.volume_number === volume.volume_number).length} عدد</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showVolumeModal} onOpenChange={setShowVolumeModal}>
        <DialogContent className="mx-4 max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-[#001f3f] text-base sm:text-lg">
              {editingVolume ? "تعديل المجلد" : "إضافة مجلد جديد"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVolumeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volume_number" className="text-sm sm:text-base">
                رقم المجلد *
              </Label>
              <Input
                id="volume_number"
                type="number"
                min="1"
                value={volumeForm.volume_number}
                onChange={(e) => setVolumeForm({ ...volumeForm, volume_number: e.target.value })}
                placeholder="1"
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume_title" className="text-sm sm:text-base">
                عنوان المجلد *
              </Label>
              <Input
                id="volume_title"
                value={volumeForm.title}
                onChange={(e) => setVolumeForm({ ...volumeForm, title: e.target.value })}
                placeholder="المجلد الأول"
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume_description" className="text-sm sm:text-base">
                وصف المجلد
              </Label>
              <Textarea
                id="volume_description"
                value={volumeForm.description}
                onChange={(e) => setVolumeForm({ ...volumeForm, description: e.target.value })}
                placeholder="وصف المجلد..."
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowVolumeModal(false)
                  setEditingVolume(null)
                  setVolumeForm({ volume_number: "", title: "", description: "" })
                }}
                disabled={submitting}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#001f3f] hover:bg-[#003366] w-full sm:w-auto text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : editingVolume ? (
                  "حفظ التعديلات"
                ) : (
                  "إضافة المجلد"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
        <DialogContent className="mx-4 max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-[#001f3f] text-base sm:text-lg">
              {editingIssue ? "تعديل العدد" : "إضافة عدد جديد"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volume_select" className="text-sm sm:text-base">
                المجلد *
              </Label>
              <Select value={issueForm.volume_id} onValueChange={handleVolumeSelect} required>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="اختر المجلد" />
                </SelectTrigger>
                <SelectContent>
                  {volumes.map((volume) => (
                    <SelectItem key={volume.id} value={volume.id} className="text-sm sm:text-base">
                      المجلد {volume.volume_number} - {volume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue_number" className="text-sm sm:text-base">
                رقم العدد *
              </Label>
              <Input
                id="issue_number"
                type="number"
                min="1"
                value={issueForm.issue_number}
                onChange={(e) => setIssueForm({ ...issueForm, issue_number: e.target.value })}
                placeholder="1"
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue_title" className="text-sm sm:text-base">
                عنوان العدد *
              </Label>
              <Input
                id="issue_title"
                value={issueForm.title}
                onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                placeholder="العدد الأول"
                required
                className="text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue_description" className="text-sm sm:text-base">
                وصف العدد
              </Label>
              <Textarea
                id="issue_description"
                value={issueForm.description}
                onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                placeholder="وصف العدد..."
                rows={3}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowIssueModal(false)
                  setEditingIssue(null)
                  setIssueForm({ volume_id: "", volume_number: "", issue_number: "", title: "", description: "" })
                }}
                disabled={submitting}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#FFD700] text-[#001f3f] hover:bg-yellow-400 w-full sm:w-auto text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : editingIssue ? (
                  "حفظ التعديلات"
                ) : (
                  "إضافة العدد"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showResearchModal} onOpenChange={setShowResearchModal}>
        <DialogContent className="mx-2 sm:mx-4 max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#001f3f] text-base sm:text-lg leading-tight">
              إدارة أبحاث العدد: {selectedIssue?.title}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={researchTab} onValueChange={setResearchTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                إضافة
              </TabsTrigger>
              <TabsTrigger value="remove" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                حذف
              </TabsTrigger>
            </TabsList>

            {/* تبويب الإضافة */}
            <TabsContent value="add" className="space-y-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-4">
                الأبحاث المقبولة المتاحة للإضافة إلى هذا العدد
              </div>

              {unassignedResearch.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                    <p className="text-sm sm:text-base text-gray-500">لا توجد أبحاث متاحة للإضافة</p>
                    <p className="text-xs text-gray-400 mt-1">عدد الأبحاث: {unassignedResearch.length}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
                  {unassignedResearch.map((research) => (
                    <Card key={research.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#001f3f] mb-1 text-sm sm:text-base leading-tight">
                              {research.research_title || "عنوان غير متوفر"}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              بواسطة: {research.researcher_name || "باحث غير محدد"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                              {research.research_abstract || "ملخص غير متوفر"}
                            </p>
                            <div className="text-xs text-gray-400 mt-2">
                              ID: {research.id} | Issue ID: {research.issue_id || "null"}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddResearchToIssue(research.id)}
                            className="bg-[#001f3f] text-white hover:bg-[#003366] w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="sm:hidden mr-2">إضافة</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* تبويب الحذف */}
            <TabsContent value="remove" className="space-y-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-4">الأبحاث الموجودة في هذا العدد</div>

              {issueResearch.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
                    <p className="text-sm sm:text-base text-gray-500">لا توجد أبحاث في هذا العدد</p>
                    <p className="text-xs text-gray-400 mt-1">عدد الأبحاث: {issueResearch.length}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:gap-4 max-h-80 sm:max-h-96 overflow-y-auto">
                  {issueResearch.map((research) => (
                    <Card key={research.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#001f3f] mb-1 text-sm sm:text-base leading-tight">
                              {research.research_title || "عنوان غير متوفر"}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              بواسطة: {research.researcher_name || "باحث غير محدد"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                              {research.research_abstract || "ملخص غير متوفر"}
                            </p>
                            <div className="text-xs text-gray-400 mt-2">
                              ID: {research.id} | Issue ID: {research.issue_id}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveResearchFromIssue(research.id)}
                            className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="sm:hidden mr-2">حذف</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowResearchModal(false)}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
