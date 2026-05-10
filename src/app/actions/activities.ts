"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getCompanyActivities(companyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" as const }
  }

  const company = await prisma.company.findFirst({
    where: { id: companyId, userId: session.user.id },
    select: { id: true },
  })

  if (!company) {
    return { error: "Company not found" as const }
  }

  const activities = await prisma.companyActivity.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return { activities }
}
