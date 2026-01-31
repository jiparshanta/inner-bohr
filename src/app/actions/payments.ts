"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUserPayments() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return { payments }
}

export async function getPaymentById(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      company: true,
    },
  })

  if (!payment) {
    return { error: "Payment not found" }
  }

  return { payment }
}

export async function createPayment(data: {
  companyId?: string
  amount: number
  method: string
  description?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  // Verify company belongs to user if provided
  if (data.companyId) {
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, userId: session.user.id },
    })
    if (!company) {
      return { error: "Company not found" }
    }
  }

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      companyId: data.companyId,
      amount: data.amount,
      method: data.method,
      description: data.description,
      status: "pending",
    },
  })

  revalidatePath("/dashboard/payments")

  return { payment }
}

// Simulate payment completion (in real app, this would be called by payment gateway webhook)
export async function completePayment(id: string, transactionId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const existing = await prisma.payment.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!existing) {
    return { error: "Payment not found" }
  }

  if (existing.status !== "pending") {
    return { error: "Payment is not in pending status" }
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      status: "completed",
      transactionId,
      paidAt: new Date(),
    },
  })

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard")

  return { payment }
}

export async function getPaymentStats() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const [totalPaid, pendingPayments, completedCount] = await Promise.all([
    prisma.payment.aggregate({
      where: { userId: session.user.id, status: "completed" },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { userId: session.user.id, status: "pending" },
      _sum: { amount: true },
    }),
    prisma.payment.count({
      where: { userId: session.user.id, status: "completed" },
    }),
  ])

  return {
    stats: {
      totalPaid: totalPaid._sum.amount || 0,
      pendingAmount: pendingPayments._sum.amount || 0,
      completedCount,
    },
  }
}
