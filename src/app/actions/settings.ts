"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function getUserProfile() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
    },
  })

  if (!user) {
    return { error: "User not found" }
  }

  return { user }
}

export async function updateProfile(data: {
  name?: string
  phone?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  })

  revalidatePath("/dashboard/settings")

  return { user }
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user || !user.password) {
    return { error: "User not found or no password set" }
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password)
  if (!isValid) {
    return { error: "Current password is incorrect" }
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  // Check if user has any approved companies
  const approvedCompanies = await prisma.company.count({
    where: { userId: session.user.id, status: "approved" },
  })

  if (approvedCompanies > 0) {
    return { error: "Cannot delete account with approved companies. Please contact support." }
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  })

  return { success: true }
}
