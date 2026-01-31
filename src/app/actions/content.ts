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

// ==================== PAGE CONTENT ====================

export async function getAllPageContent() {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const content = await prisma.pageContent.findMany({
    orderBy: [{ page: "asc" }, { section: "asc" }, { key: "asc" }],
  })

  return { content }
}

export async function getPageContent(page: string, section?: string) {
  const where: { page: string; section?: string } = { page }
  if (section) where.section = section

  const content = await prisma.pageContent.findMany({
    where,
    orderBy: { key: "asc" },
  })

  // Convert to a key-value object for easy access
  const contentMap: Record<string, string> = {}
  content.forEach((item) => {
    contentMap[`${item.section}.${item.key}`] = item.value
  })

  return { content: contentMap, raw: content }
}

export async function upsertPageContent(data: {
  page: string
  section: string
  key: string
  value: string
  type?: string
}) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const content = await prisma.pageContent.upsert({
    where: {
      page_section_key: {
        page: data.page,
        section: data.section,
        key: data.key,
      },
    },
    update: {
      value: data.value,
      type: data.type || "text",
    },
    create: {
      page: data.page,
      section: data.section,
      key: data.key,
      value: data.value,
      type: data.type || "text",
    },
  })

  revalidatePath("/")
  revalidatePath(`/${data.page}`)
  revalidatePath("/admin/content")

  return { content }
}

export async function deletePageContent(id: string) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  await prisma.pageContent.delete({ where: { id } })

  revalidatePath("/")
  revalidatePath("/admin/content")

  return { success: true }
}

// ==================== SERVICES ====================

export async function getAllServices(includeInactive = false) {
  const where = includeInactive ? {} : { isActive: true }

  const services = await prisma.service.findMany({
    where,
    orderBy: { sortOrder: "asc" },
  })

  return { services }
}

export async function createService(data: {
  name: string
  description?: string
  price?: number
  icon?: string
  features?: string[]
}) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const maxOrder = await prisma.service.aggregate({ _max: { sortOrder: true } })

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      icon: data.icon,
      features: data.features ? JSON.stringify(data.features) : null,
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
    },
  })

  revalidatePath("/services")
  revalidatePath("/admin/content")

  return { service }
}

export async function updateService(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    icon?: string
    features?: string[]
    isActive?: boolean
    sortOrder?: number
  }
) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const service = await prisma.service.update({
    where: { id },
    data: {
      ...data,
      features: data.features ? JSON.stringify(data.features) : undefined,
    },
  })

  revalidatePath("/services")
  revalidatePath("/admin/content")

  return { service }
}

export async function deleteService(id: string) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  await prisma.service.delete({ where: { id } })

  revalidatePath("/services")
  revalidatePath("/admin/content")

  return { success: true }
}

// ==================== FAQs ====================

export async function getAllFAQs(includeUnpublished = false) {
  const where = includeUnpublished ? {} : { isPublished: true }

  const faqs = await prisma.fAQ.findMany({
    where,
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  })

  return { faqs }
}

export async function createFAQ(data: {
  question: string
  answer: string
  category?: string
}) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const maxOrder = await prisma.fAQ.aggregate({ _max: { sortOrder: true } })

  const faq = await prisma.fAQ.create({
    data: {
      question: data.question,
      answer: data.answer,
      category: data.category,
      sortOrder: (maxOrder._max.sortOrder || 0) + 1,
    },
  })

  revalidatePath("/")
  revalidatePath("/admin/content")

  return { faq }
}

export async function updateFAQ(
  id: string,
  data: {
    question?: string
    answer?: string
    category?: string
    isPublished?: boolean
    sortOrder?: number
  }
) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  const faq = await prisma.fAQ.update({
    where: { id },
    data,
  })

  revalidatePath("/")
  revalidatePath("/admin/content")

  return { faq }
}

export async function deleteFAQ(id: string) {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  await prisma.fAQ.delete({ where: { id } })

  revalidatePath("/")
  revalidatePath("/admin/content")

  return { success: true }
}

// ==================== SEED DEFAULT CONTENT ====================

export async function seedDefaultContent() {
  const adminCheck = await checkAdmin()
  if (!adminCheck.isAdmin) return adminCheck

  // Check if content already exists
  const existingContent = await prisma.pageContent.count()
  if (existingContent > 0) {
    return { error: "Content already exists. Delete existing content first." }
  }

  // Seed homepage content
  const homeContent = [
    { page: "home", section: "hero", key: "title", value: "Register Your Company in Nepal" },
    { page: "home", section: "hero", key: "subtitle", value: "Fast, Easy, and 100% Online" },
    { page: "home", section: "hero", key: "description", value: "The easiest way to register your company in Nepal. OCR compliant, fully digital process with expert support." },
    { page: "home", section: "hero", key: "cta_primary", value: "Get Started" },
    { page: "home", section: "hero", key: "cta_secondary", value: "Learn More" },
    { page: "home", section: "features", key: "title", value: "Why Choose Us?" },
    { page: "home", section: "features", key: "feature1_title", value: "100% Online Process" },
    { page: "home", section: "features", key: "feature1_description", value: "Complete your registration from anywhere without visiting any office." },
    { page: "home", section: "features", key: "feature2_title", value: "Expert Support" },
    { page: "home", section: "features", key: "feature2_description", value: "Our team of experts will guide you through every step of the process." },
    { page: "home", section: "features", key: "feature3_title", value: "Fast Processing" },
    { page: "home", section: "features", key: "feature3_description", value: "Get your company registered in as little as 7 working days." },
    { page: "home", section: "cta", key: "title", value: "Ready to Start Your Business?" },
    { page: "home", section: "cta", key: "description", value: "Join thousands of entrepreneurs who have successfully registered their companies with us." },
    { page: "home", section: "cta", key: "button_text", value: "Register Now" },
  ]

  // Seed about page content
  const aboutContent = [
    { page: "about", section: "hero", key: "title", value: "About NepalCompanyReg" },
    { page: "about", section: "hero", key: "description", value: "We are dedicated to simplifying the company registration process in Nepal." },
    { page: "about", section: "mission", key: "title", value: "Our Mission" },
    { page: "about", section: "mission", key: "description", value: "To make company registration accessible, affordable, and hassle-free for every entrepreneur in Nepal." },
    { page: "about", section: "vision", key: "title", value: "Our Vision" },
    { page: "about", section: "vision", key: "description", value: "To be the leading platform for business registration and compliance services in Nepal." },
  ]

  await prisma.pageContent.createMany({
    data: [...homeContent, ...aboutContent],
  })

  // Seed default services
  const services = [
    { name: "Company Registration", description: "Complete Pvt. Ltd. company registration with all documentation", price: 15000, icon: "Building2", sortOrder: 1 },
    { name: "PAN Registration", description: "Get your Permanent Account Number for tax purposes", price: 5000, icon: "FileText", sortOrder: 2 },
    { name: "Company Stamp", description: "Official company stamp/seal for documents", price: 2000, icon: "Stamp", sortOrder: 3 },
    { name: "Letterhead Design", description: "Professional letterhead design for your company", price: 3000, icon: "FileImage", sortOrder: 4 },
  ]

  await prisma.service.createMany({ data: services })

  // Seed default FAQs
  const faqs = [
    { question: "How long does company registration take?", answer: "Typically 7-14 working days after document submission.", category: "registration", sortOrder: 1 },
    { question: "What documents are required?", answer: "Citizenship copy, passport photos, and signature specimens of all shareholders.", category: "registration", sortOrder: 2 },
    { question: "What is the minimum capital required?", answer: "The minimum authorized capital for a Pvt. Ltd. company is NPR 1,00,000.", category: "registration", sortOrder: 3 },
    { question: "What payment methods do you accept?", answer: "We accept eSewa, Khalti, ConnectIPS, and bank transfers.", category: "payment", sortOrder: 4 },
    { question: "Can I track my application status?", answer: "Yes, you can track your application status through your dashboard after logging in.", category: "general", sortOrder: 5 },
  ]

  await prisma.fAQ.createMany({ data: faqs })

  revalidatePath("/")
  revalidatePath("/admin/content")

  return { success: true, message: "Default content seeded successfully" }
}
