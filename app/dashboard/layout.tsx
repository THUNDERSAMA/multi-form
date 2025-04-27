"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Home, LogOut, Menu, Package, PackageSearch, Settings, Truck, User, X } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { cn } from "@/lib/utils"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Book Courier",
    href: "/dashboard/book",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    title: "Parcel Details",
    href: "/dashboard/parcels",
    icon: <PackageSearch className="h-5 w-5" />,
  },
  {
    title: "Confirm Parcel",
    href: "/dashboard/couriers",
    icon: <PackageSearch className="h-5 w-5" />,
  },
  {
    title: "Bulk pod",
    href: "/dashboard/bulk-pod",
    icon: <PackageSearch className="h-5 w-5" />,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
 const router = useRouter()
   useEffect(() => {
     const token = Cookies.get('token')
 
     if (!token) {
       router.replace('/') // If no token is found, redirect to login page
       return
     }
 
     // Validate the token by making an API call
     const validateToken = async () => {
       try {
         const res = await fetch('/api/verify', {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         })
 
         if (!res.ok) throw new Error('Token validation failed')
       } catch (error) {
         console.error(error)
         router.replace('/') // Redirect to login if token validation fails
       }
     }
 
     validateToken()
   }, [router])
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">courierWallah</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile navigation overlay */}
        {isMobileNavOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        {/* Mobile navigation sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/40 bg-background p-6 shadow-lg transition-transform duration-300 md:hidden",
            isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">courierWallah</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop navigation sidebar */}
        <div className="hidden w-64 flex-shrink-0 border-r border-border/40 bg-background/95 md:block">
          <div className="flex h-full flex-col">
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border/40 p-4">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@quantum.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="container py-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
