"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { upsertPageContent, deletePageContent } from "@/app/actions/content"

type ContentItem = {
  id: string
  page: string
  section: string
  key: string
  value: string
  type: string
  isPublished: boolean
}

type ContentByPage = Record<string, ContentItem[]>

export function ContentEditor({ contentByPage }: { contentByPage: ContentByPage }) {
  const router = useRouter()
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newContent, setNewContent] = useState({
    page: "",
    section: "",
    key: "",
    value: "",
  })

  const togglePage = (page: string) => {
    setExpandedPages((prev) => ({ ...prev, [page]: !prev[page] }))
  }

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id)
    setEditValue(item.value)
  }

  const handleSave = async (item: ContentItem) => {
    setIsLoading(true)
    await upsertPageContent({
      page: item.page,
      section: item.section,
      key: item.key,
      value: editValue,
    })
    setEditingId(null)
    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    setIsLoading(true)
    await deletePageContent(id)
    setIsLoading(false)
    router.refresh()
  }

  const handleAddNew = async () => {
    if (!newContent.page || !newContent.section || !newContent.key || !newContent.value) {
      alert("Please fill all fields")
      return
    }

    setIsLoading(true)
    await upsertPageContent(newContent)
    setNewContent({ page: "", section: "", key: "", value: "" })
    setShowAddForm(false)
    setIsLoading(false)
    router.refresh()
  }

  const pages = Object.keys(contentByPage)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Page Content</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Page</Label>
                <Input
                  placeholder="e.g., home"
                  value={newContent.page}
                  onChange={(e) => setNewContent({ ...newContent, page: e.target.value })}
                />
              </div>
              <div>
                <Label>Section</Label>
                <Input
                  placeholder="e.g., hero"
                  value={newContent.section}
                  onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                />
              </div>
              <div>
                <Label>Key</Label>
                <Input
                  placeholder="e.g., title"
                  value={newContent.key}
                  onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddNew} disabled={isLoading} className="w-full">
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label>Value</Label>
              <textarea
                className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                placeholder="Content value..."
                value={newContent.value}
                onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No content yet. Click "Create Default Content" to get started.
          </CardContent>
        </Card>
      ) : (
        pages.map((page) => (
          <Card key={page}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => togglePage(page)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize flex items-center gap-2">
                  {expandedPages[page] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {page} Page
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  {contentByPage[page].length} items
                </span>
              </div>
            </CardHeader>
            {expandedPages[page] && (
              <CardContent className="space-y-3">
                {contentByPage[page].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          {item.section}
                        </span>
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                          {item.key}
                        </span>
                      </div>
                      {editingId === item.id ? (
                        <textarea
                          className="w-full p-2 border rounded-md text-sm min-h-[60px]"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm">{item.value}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingId === item.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(item)}
                            disabled={isLoading}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  )
}
