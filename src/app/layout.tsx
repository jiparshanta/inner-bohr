import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MaintenanceGate } from "@/components/layout/MaintenanceGate";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { cn } from "@/lib/utils";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EzDarta — Register Your Business in Nepal",
  description: "The fastest way to register your company in Nepal. EzDarta handles OCR filing, PAN/VAT registration, and compliance — all online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(sora.variable, plusJakartaSans.variable, "min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <SessionProvider>
          <MaintenanceGate>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </MaintenanceGate>
        </SessionProvider>
      </body>
    </html>
  );
}
