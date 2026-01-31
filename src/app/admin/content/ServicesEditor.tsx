"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save, Trash2, Eye, EyeOff } from "lucide-react"
import { createService, updateService, deleteService } from "@/app/actions/content"

type Service = {
  id: string
  name: string
  description: string | null
  price: number | null
  icon: string | null
  features: string | null
  isActive: boolean
  sortOrder: number
}

export function ServicesEditor({ services }: { services: Service[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Service>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    icon: "",
  })

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setEditData({
      name: service.name,
      description: service.description || "",
      price: service.price,
      icon: service.icon || "",
    })
  }

  const handleSave = async (id: string) => {
    setIsLoading(true)
    await updateService(id, {
      name: editData.name,
      description: editData.description || undefined,
      price: editData.price || undefined,
      icon: editData.icon || undefined,
    })
    setEditingId(null)
    setIsLoading(false)
    router.refresh()
  }

  const handleToggleActive = async (service: Service) => {
    setIsLoading(true)
    await updateService(service.id, { isActive: !service.isActive })
    setIsLoading(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    setIsLoading(true)
    await deleteService(id)
    setIsLoading(false)
    router.refresh()
  }

  const handleAddNew = async () => {
    if (!newService.name) {
      alert("Please enter a service name")
      return
    }

    setIsLoading(true)
    await createService({
      name: newService.name,
      description: newService.description || undefined,
      price: newService.price ? parseFloat(newService.price) : undefined,
      icon: newService.icon || undefined,
    })
    setNewService({ name: "", description: "", price: "", icon: "" })
    setShowAddForm(false)
    setIsLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Services</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  placeholder="Service name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Price (NPR)</Label>
                <Input
                  type="number"
                  placeholder="15000"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Icon (Lucide)</Label>
                <Input
                  placeholder="Building2"
                  value={newService.icon}
                  onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddNew} disabled={isLoading} className="w-full">
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                className="w-full p-2 border rounded-md text-sm min-h-[60px]"
                placeholder="Service description..."
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No services yet. Add your first service or click "Create Default Content".
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id} className={!service.isActive ? "opacity-60" : ""}>
              <CardContent className="p-4">
                {editingId === service.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={editData.name || ""}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Price (NPR)</Label>
                        <Input
                          type="number"
                          value={editData.price || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={editData.icon || ""}
                          onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <textarea
                        className="w-full p-2 border rounded-md text-sm min-h-[60px]"
                        value={editData.description || ""}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(service.id)} disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        {!service.isActive && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        {service.price && (
                          <span className="font-medium">NPR {service.price.toLocaleString()}</span>
                        )}
                        {service.icon && (
                          <span className="text-muted-foreground">Icon: {service.icon}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(service)}
                        disabled={isLoading}
                      >
                        {service.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
