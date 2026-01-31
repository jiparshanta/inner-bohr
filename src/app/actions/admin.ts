"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Helper to check admin access
async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized", isAdmin: false }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "admin") {
    return { error: "Access denied. Admin privileges required.", isAdmin: false }
  }

  return { isAdmin: true }
}

// Dashboard Stats
export async function getAdminStats() {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const [
    totalUsers,
    totalCompanies,
    pendingCompanies,
    approvedCompanies,
    totalPayments,
    completedPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.company.count({ where: { status: "pending" } }),
    prisma.company.count({ where: { status: "approved" } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    }),
  ])

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  const recentCompanies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  return {
    stats: {
      totalUsers,
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalRevenue: totalPayments._sum.amount || 0,
      completedRevenue: completedPayments._sum.amount || 0,
    },
    recentUsers,
    recentCompanies,
  }
}

// User Management
export async function getAllUsers(page = 1, limit = 10, search = "") {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { companies: true, payments: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, pages: Math.ceil(total / limit) }
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const session = await auth()
  if (userId === session?.user?.id) {
    return { error: "Cannot change your own role" }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function toggleUserStatus(userId: string) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const session = await auth()
  if (userId === session?.user?.id) {
    return { error: "Cannot deactivate your own account" }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: "User not found" }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(userId: string) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const session = await auth()
  if (userId === session?.user?.id) {
    return { error: "Cannot delete your own account" }
  }

  await prisma.user.delete({ where: { id: userId } })

  revalidatePath("/admin/users")
  return { success: true }
}

// Company Management
export async function getAllCompanies(page = 1, limit = 10, status = "", search = "") {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { registrationNumber: { contains: search } },
    ]
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { payments: true } },
      },
    }),
    prisma.company.count({ where }),
  ])

  return { companies, total, pages: Math.ceil(total / limit) }
}

export async function updateCompanyStatus(
  companyId: string,
  status: "pending" | "under_review" | "approved" | "rejected",
  data?: { registrationNumber?: string; panNumber?: string; rejectionReason?: string }
) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const updateData: Record<string, unknown> = { status }

  if (status === "approved") {
    updateData.approvedAt = new Date()
    updateData.rejectedAt = null
    updateData.rejectionReason = null
    if (data?.registrationNumber) updateData.registrationNumber = data.registrationNumber
    if (data?.panNumber) updateData.panNumber = data.panNumber
  } else if (status === "rejected") {
    updateData.rejectedAt = new Date()
    updateData.approvedAt = null
    if (data?.rejectionReason) updateData.rejectionReason = data.rejectionReason
  }

  await prisma.company.update({
    where: { id: companyId },
    data: updateData,
  })

  revalidatePath("/admin/companies")
  return { success: true }
}

// Payment Management
export async function getAllPayments(page = 1, limit = 10, status = "") {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const where = status ? { status } : {}

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        company: { select: { name: true } },
      },
    }),
    prisma.payment.count({ where }),
  ])

  return { payments, total, pages: Math.ceil(total / limit) }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "pending" | "completed" | "failed" | "refunded",
  transactionId?: string
) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const updateData: Record<string, unknown> = { status }
  if (status === "completed") {
    updateData.paidAt = new Date()
    if (transactionId) updateData.transactionId = transactionId
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: updateData,
  })

  revalidatePath("/admin/payments")
  return { success: true }
}

// Site Settings
export async function getSiteSettings() {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  })

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "default" },
    })
  }

  return { settings }
}

export async function updateSiteSettings(data: {
  siteName?: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  registrationFee?: number
  panRegistrationFee?: number
  maintenanceMode?: boolean
}) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  })

  revalidatePath("/admin/settings")
  return { settings }
}
