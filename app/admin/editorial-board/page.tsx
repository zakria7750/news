"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { supabase, type EditorialBoardMember } from "@/lib/supabase/client"
import Image from "next/image"

const positionOptions = [
  { value: "editor_in_chief", label: "رئيس التحرير" },
  { value: "managing_editor", label: "مدير التحرير" },
  { value: "executive_manager", label: "المدير التنفيذي" },
  { value: "technical_committee", label: "عضو اللجنة الفنية" },
  { value: "advisory_committee", label: "عضو اللجنة الاستشارية" },
]

export default function AdminEditorialBoardPage() {
  const [members, setMembers] = useState<EditorialBoardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState("الكل")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<EditorialBoardMember | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    country: "",
    image: null as File | null,
  })
  const [imageUploading, setImageUploading] = useState(false)

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `editorial-board/${fileName}`

      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("images").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const deleteImage = async (imageUrl: string) => {
    try {
      const path = imageUrl.split("/").pop()
      if (path && path !== "placeholder.svg") {
        await supabase.storage.from("images").remove([`editorial-board/${path}`])
      }
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
      setMessageText("حدث خطأ في جلب البيانات")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMember.name || !newMember.position || !newMember.country) {
      setMessageText("يرجى ملء جميع الحقول المطلوبة")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    setImageUploading(true)
    try {
      let imageUrl = "/placeholder.svg"

      if (newMember.image) {
        const uploadedUrl = await uploadImage(newMember.image)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const { error } = await supabase.from("editorial_board_members").insert([
        {
          name: newMember.name,
          position: positionOptions.find((p) => p.value === newMember.position)?.label || newMember.position,
          country: newMember.country,
          section: newMember.position,
          image_url: imageUrl,
        },
      ])

      if (error) throw error

      setShowAddModal(false)
      setNewMember({ name: "", position: "", country: "", image: null })
      fetchMembers()

      setMessageText("تم إضافة العضو بنجاح")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error adding member:", error)
      setMessageText("حدث خطأ أثناء إضافة العضو")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
    } finally {
      setImageUploading(false)
    }
  }

  const handleEditMember = (member: EditorialBoardMember) => {
    setEditingMember(member)
    setShowEditModal(true)
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    setImageUploading(true)
    try {
      let imageUrl = editingMember.image_url

      if (newMember.image) {
        if (editingMember.image_url && !editingMember.image_url.includes("placeholder")) {
          await deleteImage(editingMember.image_url)
        }

        const uploadedUrl = await uploadImage(newMember.image)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      const { error } = await supabase
        .from("editorial_board_members")
        .update({
          name: editingMember.name,
          position: editingMember.position,
          country: editingMember.country,
          image_url: imageUrl,
        })
        .eq("id", editingMember.id)

      if (error) throw error

      setShowEditModal(false)
      setEditingMember(null)
      setNewMember({ name: "", position: "", country: "", image: null })
      fetchMembers()

      setMessageText("تم تحديث العضو بنجاح")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error updating member:", error)
      setMessageText("حدث خطأ أثناء تحديث العضو")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
    } finally {
      setImageUploading(false)
    }
  }

  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!memberToDelete) return

    try {
      const memberToDeleteData = members.find((m) => m.id === memberToDelete)

      if (memberToDeleteData?.image_url && !memberToDeleteData.image_url.includes("placeholder")) {
        await deleteImage(memberToDeleteData.image_url)
      }

      const { error } = await supabase.from("editorial_board_members").delete().eq("id", memberToDelete)

      if (error) throw error

      setShowDeleteDialog(false)
      setMemberToDelete(null)
      fetchMembers()

      setMessageText("تم حذف العضو بنجاح")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error("Error deleting member:", error)
      setMessageText("حدث خطأ أثناء حذف العضو")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPosition = selectedPosition === "الكل" || member.section === selectedPosition
    return matchesSearch && matchesPosition
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001f3f] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse animate-slide-down">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{messageText}</span>
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse animate-shake">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{messageText}</span>
        </div>
      )}

      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#001f3f]">إدارة هيئة التحرير</h1>
            <p className="text-gray-600 mt-1">إضافة وتعديل وحذف أعضاء هيئة التحرير</p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#001f3f] text-white px-6 py-2 rounded-lg hover:bg-[#003366] transition-colors flex items-center space-x-2 space-x-reverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>إضافة عضو جديد</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <input
                type="text"
                placeholder="البحث بالاسم أو البلد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تصفية حسب المنصب</label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
              >
                <option value="الكل">جميع المناصب</option>
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#001f3f] mb-4">الأعضاء ({filteredMembers.length})</h2>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-gray-500 text-lg">لا توجد أعضاء</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <Image
                        src={member.image_url || "/placeholder.svg"}
                        alt={member.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#001f3f]">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.position}</p>
                        <p className="text-sm text-gray-500">{member.country}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="تعديل"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="حذف"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#001f3f]">إضافة عضو جديد</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العضو *</label>
                  <input
                    type="text"
                    required
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                    placeholder="د. أحمد محمد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنصب *</label>
                  <select
                    required
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                  >
                    <option value="">اختر المنصب</option>
                    {positionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البلد *</label>
                  <input
                    type="text"
                    required
                    value={newMember.country}
                    onChange={(e) => setNewMember({ ...newMember, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                    placeholder="المملكة العربية السعودية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">صورة العضو</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">اختر صورة بصيغة JPG أو PNG</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={imageUploading}
                    className="flex-1 bg-[#001f3f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imageUploading ? "جاري الحفظ..." : "إضافة العضو"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={imageUploading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#001f3f]">تعديل العضو</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingMember(null)
                    setNewMember({ name: "", position: "", country: "", image: null })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العضو *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                    placeholder="د. أحمد محمد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنصب *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.position}
                    onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                    placeholder="رئيس التحرير"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البلد *</label>
                  <input
                    type="text"
                    required
                    value={editingMember.country}
                    onChange={(e) => setEditingMember({ ...editingMember, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                    placeholder="المملكة العربية السعودية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تغيير الصورة</label>
                  {editingMember.image_url && (
                    <div className="mb-2">
                      <Image
                        src={editingMember.image_url || "/placeholder.svg"}
                        alt={editingMember.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <p className="text-xs text-gray-500 mt-1">الصورة الحالية</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">اختر صورة جديدة بصيغة JPG أو PNG (اختياري)</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={imageUploading}
                    className="flex-1 bg-[#001f3f] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imageUploading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingMember(null)
                      setNewMember({ name: "", position: "", country: "", image: null })
                    }}
                    disabled={imageUploading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 text-center mb-6">
                هل أنت متأكد من حذف هذا العضو؟ لا يمكن التراجع عن هذا الإجراء.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => {
                    setShowDeleteDialog(false)
                    setMemberToDelete(null)
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
