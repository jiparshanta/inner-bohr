"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react"
import { createFAQ, updateFAQ, deleteFAQ } from "@/app/actions/content"

type FAQ = {
  id: string
  question: string
  answer: string
  category: string | null
  isPublished: boolean
  sortOrder: number
}

export function FAQsEditor({ faqs }: { faqs: FAQ[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<FAQ>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
    category: "",
  })

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id)
    setEditData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
    })
  }

  const handleSave = async (id: string) => {
    setIsLoading(true)
    await updateFAQ(id, {
      question: editData.question,
      answer: editData.answer,
      category: editData.category || undefined,
    })
    setEditingId(null)
    setIsLoading(false)
    router.refresh()
  }

  const handleTogglePublished = async (faq: FAQ) => {
    setIsLoading(true)
    await updateFAQ(faq.id, { isPublished: !faq.isPublished })
    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    setIsLoading(true)
    await deleteFAQ(id)
    setIsLoading(false)
    router.refresh()
  }

  const handleAddNew = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      alert("Please enter both question and answer")
      return
    }

    setIsLoading(true)
    await createFAQ({
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category || undefined,
    })
    setNewFAQ({ question: "", answer: "", category: "" })
    setShowAddForm(false)
    setIsLoading(false)
    router.refresh()
  }

  // Group FAQs by category
  const faqsByCategory: Record<string, FAQ[]> = {}
  faqs.forEach((faq) => {
    const cat = faq.category || "General"
    if (!faqsByCategory[cat]) {
      faqsByCategory[cat] = []
    }
    faqsByCategory[cat].push(faq)
  })

  const categories = ["general", "registration", "payment", "other"]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Label>Question *</Label>
                <Input
                  placeholder="Enter the question"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Answer *</Label>
              <textarea
                className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                placeholder="Enter the answer..."
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
              />
            </div>
            <Button onClick={handleAddNew} disabled={isLoading}>
              Add FAQ
            </Button>
          </CardContent>
        </Card>
      )}

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No FAQs yet. Add your first FAQ or click "Create Default Content".
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Card key={faq.id} className={!faq.isPublished ? "opacity-60" : ""}>
              <CardContent className="p-4">
                {editingId === faq.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <Label>Question</Label>
                        <Input
                          value={editData.question || ""}
                          onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <select
                          className="w-full p-2 border rounded-md text-sm"
                          value={editData.category || ""}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Answer</Label>
                      <textarea
                        className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                        value={editData.answer || ""}
                        onChange={(e) => setEditData({ ...editData, answer: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(faq.id)} disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center gap-2">
                        {expandedId === faq.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <h4 className="font-medium">{faq.question}</h4>
                        {!faq.isPublished && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Unpublished
                          </span>
                        )}
                        {faq.category && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize">
                            {faq.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTogglePublished(faq)}
                          disabled={isLoading}
                        >
                          {faq.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(faq)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(faq.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {expandedId === faq.id && (
                      <div className="mt-3 pl-6 text-sm text-muted-foreground border-l-2 border-muted ml-2">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
