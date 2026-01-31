"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { sendVerificationEmail } from "@/lib/email"

// Set to true to enable email verification (requires RESEND_API_KEY)
const EMAIL_VERIFICATION_ENABLED = !!process.env.RESEND_API_KEY

export async function registerUser(formData: {
  name: string
  email: string
  password: string
  phone?: string
  termsAccepted: boolean
}) {
  const { name, email, password, phone, termsAccepted } = formData

  // Validate terms acceptance
  if (!termsAccepted) {
    return { error: "You must accept the terms and conditions" }
  }

  // Validate phone if provided (10-digit validation)
  if (phone && !/^\d{10}$/.test(phone)) {
    return { error: "Phone number must be exactly 10 digits" }
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // If email verification is disabled, create user as verified
  if (!EMAIL_VERIFICATION_ENABLED) {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        emailVerified: new Date(), // Auto-verify
      },
    })

    return { success: true }
  }

  // Generate verification token
  const token = crypto.randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

  // Create user with emailVerified as null
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      emailVerified: null,
    },
  })

  // Create verification token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  // Send verification email
  try {
    await sendVerificationEmail(email, token, name)
  } catch (error) {
    // If email fails, delete the user and token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    })
    await prisma.user.delete({
      where: { id: user.id },
    })
    console.error("Failed to send verification email:", error)
    return { error: "Failed to send verification email. Please try again." }
  }

  return {
    success: true,
    message: "Please check your email to verify your account",
  }
}

export async function verifyEmail(token: string) {
  // Find the verification token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!verificationToken) {
    return { error: "Invalid verification token" }
  }

  // Check if token has expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token },
    })
    return { error: "Verification token has expired. Please register again." }
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
  })

  if (!user) {
    return { error: "User not found" }
  }

  // Update user's emailVerified timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  })

  // Delete the used verification token
  await prisma.verificationToken.delete({
    where: { token },
  })

  return { success: true }
}

export async function signInUser(formData: {
  email: string
  password: string
}) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
