"use client"

import { Textarea } from "@/components/multiform_ui/textarea"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, Download, MapPin, Package, Printer, Search, Truck, User } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/multiform_ui/select"
import { Separator } from "@/components/multiform_ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/multiform_ui/tabs"

interface ParcelDetails {
  id: string
  status: "processing" | "in-transit" | "out-for-delivery" | "delivered" | "exception"
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  packageType: string
  weight: string
  dimensions: string
  createdAt: string
  estimatedDelivery: string
  history: {
    date: string
    status: string
    location: string
    notes?: string
  }[]
}

export default function ParcelsPage() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""

  const [trackingId, setTrackingId] = useState(initialId)
  const [searchInput, setSearchInput] = useState(initialId)
  const [isLoading, setIsLoading] = useState(false)
  const [parcel, setParcel] = useState<ParcelDetails | null>(null)
  const [error, setError] = useState("")
  const [newStatus, setNewStatus] = useState("in-transit")
  const [newLocation, setNewLocation] = useState("")
  const [newNotes, setNewNotes] = useState("")

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setTrackingId(searchInput)

      // Demo data
      if (searchInput.startsWith("QC")) {
        setParcel({
          id: searchInput,
          status: "in-transit",
          senderName: "John Smith",
          senderAddress: "123 Main St, New York, NY 10001, USA",
          recipientName: "Jane Doe",
          recipientAddress: "456 Market St, San Francisco, CA 94103, USA",
          packageType: "Standard",
          weight: "2.5 kg",
          dimensions: "30 × 20 × 15 cm",
          createdAt: "Apr 10, 2025, 09:45 AM",
          estimatedDelivery: "Apr 15, 2025",
          history: [
            {
              date: "Apr 12, 2025, 10:30 AM",
              status: "In Transit",
              location: "Chicago Distribution Center, IL",
              notes: "Package transferred to long-haul carrier",
            },
            {
              date: "Apr 11, 2025, 02:15 PM",
              status: "In Transit",
              location: "Cleveland Sorting Facility, OH",
            },
            {
              date: "Apr 10, 2025, 09:45 AM",
              status: "Processing",
              location: "New York Processing Center, NY",
              notes: "Package received and processed",
            },
          ],
        })
      } else {
        setError("No parcel found with this tracking ID")
        setParcel(null)
      }
    }, 1000)
  }

  const handleUpdateStatus = () => {
    if (!newLocation) {
      return
    }

    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (parcel) {
        const statusMap: Record<string, string> = {
          processing: "Processing",
          "in-transit": "In Transit",
          "out-for-delivery": "Out for Delivery",
          delivered: "Delivered",
          exception: "Exception",
        }

        const newHistory = [
          {
            date: new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            status: statusMap[newStatus],
            location: newLocation,
            notes: newNotes || undefined,
          },
          ...parcel.history,
        ]

        setParcel({
          ...parcel,
          status: newStatus as any,
          history: newHistory,
        })

        setNewLocation("")
        setNewNotes("")
      }
    }, 800)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "text-yellow-500"
      case "in transit":
      case "in-transit":
        return "text-blue-500"
      case "out for delivery":
      case "out-for-delivery":
        return "text-purple-500"
      case "delivered":
        return "text-green-500"
      case "exception":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Parcel Details</h1>
        {parcel && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Label
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parcel</CardTitle>
          <CardDescription>Enter a tracking ID to view parcel details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter tracking ID (e.g., QC1234567890)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Try using any ID starting with "QC" for demo results</p>
        </CardContent>
      </Card>

      {parcel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Parcel {parcel.id}</CardTitle>
                <CardDescription>Created on {parcel.createdAt}</CardDescription>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  parcel.status === "delivered"
                    ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                    : parcel.status === "in-transit"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400"
                      : parcel.status === "out-for-delivery"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400"
                        : parcel.status === "exception"
                          ? "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                }`}
              >
                {parcel.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking History</TabsTrigger>
                  <TabsTrigger value="update">Update Status</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Sender Information</h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <User className="mt-1 h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{parcel.senderName}</p>
                                <p className="text-sm text-muted-foreground">{parcel.senderAddress}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Recipient Information</h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <User className="mt-1 h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{parcel.recipientName}</p>
                                <p className="text-sm text-muted-foreground">{parcel.recipientAddress}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Package Information</h3>
                        <Card>
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Package Type</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.packageType}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Weight</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.weight}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Dimensions</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.dimensions}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Delivery Information</h3>
                        <Card>
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Created Date</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.createdAt}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Estimated Delivery</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.estimatedDelivery}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Truck className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Current Status</span>
                              </div>
                              <span className={`text-sm font-medium ${getStatusColor(parcel.status)}`}>
                                {parcel.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tracking" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tracking History</CardTitle>
                      <CardDescription>Complete history of this parcel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {parcel.history.map((item, index) => (
                          <div key={index} className="relative pl-6">
                            {index !== parcel.history.length - 1 && (
                              <div className="absolute left-[0.6rem] top-[1.6rem] h-full w-px bg-border" />
                            )}
                            <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{item.date}</p>
                                <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                                  {item.status}
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-3 w-3 text-muted-foreground" />
                                <p className="text-sm">{item.location}</p>
                              </div>
                              {item.notes && <p className="text-sm text-muted-foreground pl-5">{item.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="update" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Parcel Status</CardTitle>
                      <CardDescription>Add a new status update to this parcel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">New Status</Label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="in-transit">In Transit</SelectItem>
                              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="exception">Exception</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="Enter current location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Add any additional notes"
                            value={newNotes}
                            onChange={(e) => setNewNotes(e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleUpdateStatus} disabled={isLoading || !newLocation}>
                        {isLoading ? "Updating..." : "Update Status"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
