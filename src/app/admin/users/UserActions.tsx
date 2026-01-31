"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, ShieldOff, UserX, UserCheck, Trash2 } from "lucide-react"
import { updateUserRole, toggleUserStatus, deleteUser } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  isActive: boolean
}

export function UserActions({ user }: { user: User }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleRoleChange = async () => {
    setIsLoading(true)
    const newRole = user.role === "admin" ? "user" : "admin"
    const result = await updateUserRole(user.id, newRole)
    if ("error" in result && result.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setIsOpen(false)
    router.refresh()
  }

  const handleStatusToggle = async () => {
    setIsLoading(true)
    const result = await toggleUserStatus(user.id)
    if ("error" in result && result.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setIsOpen(false)
    router.refresh()
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deleteUser(user.id)
    if ("error" in result && result.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setShowDelete(false)
    setIsOpen(false)
    router.refresh()
  }

  if (showDelete) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Delete user?</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Yes"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDelete(false)}
          disabled={isLoading}
        >
          No
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-white shadow-lg dark:bg-slate-800">
            <div className="p-1">
              <button
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
                onClick={handleRoleChange}
                disabled={isLoading}
              >
                {user.role === "admin" ? (
                  <>
                    <ShieldOff className="h-4 w-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Make Admin
                  </>
                )}
              </button>
              <button
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
                onClick={handleStatusToggle}
                disabled={isLoading}
              >
                {user.isActive ? (
                  <>
                    <UserX className="h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
              <button
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  setShowDelete(true)
                  setIsOpen(false)
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete User
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
