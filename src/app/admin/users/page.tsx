import { getAllUsers } from "@/app/actions/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { UserActions } from "./UserActions"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const search = params.search || ""

  const result = await getAllUsers(page, 10, search)

  if ("error" in result && result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const users = "users" in result ? result.users : []
  const total = "total" in result ? result.total : 0
  const pages = "pages" in result ? result.pages : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage all registered users ({total} total)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {!users || users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Role</div>
                <div>Status</div>
                <div>Companies</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-1 md:grid-cols-7 gap-2 md:gap-4 p-4 rounded-lg border items-center"
                >
                  <div>
                    <p className="font-medium">{user.name || "No name"}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                  </div>
                  <div className="hidden md:block text-sm">{user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.phone || "-"}</div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="text-sm">{user._count.companies} companies</div>
                  <div>
                    <UserActions user={user} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages && pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/admin/users?page=${p}${search ? `&search=${search}` : ""}`}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
