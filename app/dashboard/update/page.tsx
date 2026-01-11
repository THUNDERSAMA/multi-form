"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, Package } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { Textarea } from "@/components/multiform_ui/textarea"

interface PodData {
  available: number
  lastUpdated: string
  totalIssued: number
  totalReturned: number
}

export default function PodUpdatePage() {
  const [quantity, setQuantity] = useState<number>(1)
  const [updateBy, setUpdateBy] = useState("")
  const [comments, setComments] = useState("")
  const [podData, setPodData] = useState<PodData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch POD data on component mount
  useEffect(() => {
    fetchPodData()
  }, [])

  const fetchPodData = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/pod", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch POD data")
      }

      const data = await response.json()
      setPodData(data.data)
    } catch (err: any) {
      setError(err.message || "Failed to load POD data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0) {
      setQuantity(num)
    } else if (value === "") {
      setQuantity(0)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(0, prev - 1))
  }

  const handleSubmit = async (e: React.FormEvent, action: "increment" | "decrement") => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!updateBy.trim()) {
      setError("Please enter who is updating")
      return
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0")
      return
    }

    if (action === "decrement" && podData && quantity > podData.available) {
      setError(`Cannot issue ${quantity} PODs. Only ${podData.available} available.`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/pod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          quantity,
          updatedBy: updateBy,
          comments: comments.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update POD quantity")
      }

      const data = await response.json()
      setSuccess(
        action === "increment"
          ? `Successfully added ${quantity} PODs`
          : `Successfully issued ${quantity} PODs`
      )

      // Refresh POD data
      await fetchPodData()

      // Reset form
      setQuantity(1)
      setUpdateBy("")
      setComments("")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update POD quantity")
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">POD Quantity Update</h1>
          <p className="mt-4 text-muted-foreground">
            Manage proof of delivery documents inventory
          </p>
        </div>

        {/* POD Available Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading POD data...</p>
                </div>
              ) : podData ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <Package className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Available PODs</p>
                    <p className="text-3xl font-bold text-primary">{podData.available}</p>
                  </div>
                  <div className="text-center">
                    <Plus className="mx-auto mb-2 h-8 w-8 text-green-500" />
                    <p className="text-sm font-medium text-muted-foreground">Total issued</p>
                    <p className="text-3xl font-bold text-green-600">{podData.totalReturned}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-bold text-blue-600">📅</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-semibold">{podData.lastUpdated}</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-destructive">Failed to load POD data</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Update Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update POD Quantity</CardTitle>
            <CardDescription>
              Add returned PODs or issue new PODs to delivery personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Quantity Input with +/- buttons */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={decrementQuantity}
                    disabled={quantity <= 0}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  
                  <div className="relative flex-1">
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="h-14 rounded-full border-2 text-center text-2xl font-bold"
                      placeholder="0"
                    />
                    <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 p-2">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Update By */}
              <div className="space-y-2">
                <Label htmlFor="updateBy">Updated By *</Label>
                <Input
                  id="updateBy"
                  placeholder="Enter your name"
                  value={updateBy}
                  onChange={(e) => setUpdateBy(e.target.value)}
                  className="rounded-full"
                  required
                />
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any notes or comments about this update..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700"
                >
                  {success}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "increment")}
                  disabled={isSubmitting}
                  className="h-12 gap-2"
                  variant="default"
                >
                  <Plus className="h-5 w-5" />
                  {isSubmitting ? "Processing..." : "Add Returned PODs"}
                </Button>
<Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "decrement")}
                  disabled={isSubmitting}
                  className="h-12 gap-2"
                  variant="default"
                >
                  <Minus className="h-5 w-5" />
                  {isSubmitting ? "Processing..." : "issue PODs"}
                </Button>
                
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}