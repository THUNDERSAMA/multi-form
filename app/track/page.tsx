"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Search } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"

interface TrackingResult {
  id: string
  status: "in-transit" | "delivered" | "processing" | "out-for-delivery"
  location: string
  estimatedDelivery: string
  history: {
    date: string
    status: string
    location: string
  }[]
}

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (trackingNumber.toLowerCase() === "qc1234567890") {
        setResult({
          id: "QC1234567890",
          status: "in-transit",
          location: "Distribution Center, New York",
          estimatedDelivery: "April 15, 2025",
          history: [
            {
              date: "April 12, 2025 - 09:30 AM",
              status: "In Transit",
              location: "Distribution Center, New York",
            },
            {
              date: "April 11, 2025 - 02:15 PM",
              status: "Package Processed",
              location: "Sorting Facility, Boston",
            },
            {
              date: "April 10, 2025 - 10:45 AM",
              status: "Package Received",
              location: "Quantum Courier Facility, Boston",
            },
          ],
        })
      } else {
        setError("No package found with this tracking number. Please check and try again.")
        setResult(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "text-blue-500"
      case "delivered":
        return "text-green-500"
      case "processing":
        return "text-yellow-500"
      case "out-for-delivery":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Track Your Parcel</h1>
          <p className="mt-4 text-muted-foreground">
            Enter your tracking number to get real-time updates on your delivery.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Package Tracker</CardTitle>
            <CardDescription>Enter the tracking number provided in your confirmation email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking-number"
                    placeholder="e.g., QC1234567890"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Searching..."
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Track
                      </>
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">Try using "QC1234567890" for a demo result</p>
              </div>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-6"
              >
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Tracking ID: {result.id}</h3>
                      <p className={`text-sm ${getStatusColor(result.status)}`}>
                        Status: {result.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">{result.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">{result.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">Tracking History</h3>
                  <div className="space-y-4">
                    {result.history.map((item, index) => (
                      <div key={index} className="relative pl-6">
                        {index !== result.history.length - 1 && (
                          <div className="absolute left-[0.6rem] top-[1.6rem] h-full w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.date}</p>
                          <p className="text-sm">{item.status}</p>
                          <p className="text-sm text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
