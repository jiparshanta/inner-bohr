"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUserCompanies() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const companies = await prisma.company.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return { companies }
}

export async function getCompanyById(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const company = await prisma.company.findFirst({
    where: {
      id,
      userId: session.user.id
    },
    include: {
      payments: true
    }
  })

  if (!company) {
    return { error: "Company not found" }
  }

  return { company }
}

export async function createCompany(data: {
  name: string
  nameNepali?: string
  type: string
  address?: string
  district?: string
  municipality?: string
  wardNo?: string
  capital?: string
  businessObjectives?: string
  selectedServices?: string[]
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const company = await prisma.company.create({
    data: {
      userId: session.user.id,
      name: data.name,
      nameNepali: data.nameNepali,
      type: data.type,
      address: data.address,
      district: data.district,
      municipality: data.municipality,
      wardNo: data.wardNo,
      capital: data.capital,
      businessObjectives: data.businessObjectives,
      selectedServices: data.selectedServices ? JSON.stringify(data.selectedServices) : null,
      status: "pending",
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/companies")

  return { company }
}

export async function updateCompany(
  id: string,
  data: {
    name?: string
    nameNepali?: string
    address?: string
    district?: string
    municipality?: string
    wardNo?: string
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const existing = await prisma.company.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    return { error: "Company not found" }
  }

  const company = await prisma.company.update({
    where: { id },
    data,
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/companies")

  return { company }
}

export async function deleteCompany(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const existing = await prisma.company.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    return { error: "Company not found" }
  }

  if (existing.status === "approved") {
    return { error: "Cannot delete an approved company" }
  }

  await prisma.company.delete({
    where: { id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/companies")

  return { success: true }
}

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const [total, pending, approved, totalPayments] = await Promise.all([
    prisma.company.count({ where: { userId: session.user.id } }),
    prisma.company.count({ where: { userId: session.user.id, status: "pending" } }),
    prisma.company.count({ where: { userId: session.user.id, status: "approved" } }),
    prisma.payment.aggregate({
      where: { userId: session.user.id, status: "completed" },
      _sum: { amount: true },
    }),
  ])

  const recentCompanies = await prisma.company.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return {
    stats: {
      total,
      pending,
      approved,
      totalPayments: totalPayments._sum.amount || 0,
    },
    recentCompanies,
  }
}
