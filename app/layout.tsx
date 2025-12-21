// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Courier Service",
//   description: "Multi-step form for courier service",
//     generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>{children}</body>
//     </html>
//   )
// }



// import './globals.css'

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })
export const viewport = {
  themeColor: '#000000',
};
export const metadata: Metadata = {
  title: "courierWallah - Fast Futuristic Delivery",
  description: "Next-generation courier service with lightning-fast deliveries",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "courierWallah",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
          <Toaster position="top-center" />
          <ClientLayout>
            <main className="flex-1">{children}</main>
            </ClientLayout>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
