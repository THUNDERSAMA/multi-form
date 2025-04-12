"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Clock, X } from "lucide-react"

// Mock data for couriers
const mockCouriers = [
  {
    id: "1",
    customerName: "John Doe",
    pickupAddress: "123 Main St, New York, NY",
    deliveryAddress: "456 Park Ave, New York, NY",
    packageType: "Document",
    status: "pending",
    date: "2025-04-12",
    time: "14:30",
    price: "$25.99",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    pickupAddress: "789 Broadway, New York, NY",
    deliveryAddress: "101 5th Ave, New York, NY",
    packageType: "Small Package",
    status: "pending",
    date: "2025-04-12",
    time: "15:45",
    price: "$32.50",
  },
  {
    id: "3",
    customerName: "Robert Johnson",
    pickupAddress: "222 West St, New York, NY",
    deliveryAddress: "333 East St, New York, NY",
    packageType: "Medium Package",
    status: "confirmed",
    date: "2025-04-13",
    time: "09:15",
    price: "$45.75",
  },
  {
    id: "4",
    customerName: "Emily Davis",
    pickupAddress: "444 North Ave, New York, NY",
    deliveryAddress: "555 South Blvd, New York, NY",
    packageType: "Large Package",
    status: "cancelled",
    date: "2025-04-13",
    time: "11:30",
    price: "$58.25",
  },
]

export default function CouriersPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [couriers, setCouriers] = useState(mockCouriers)
  const [selectedCourier, setSelectedCourier] = useState<(typeof mockCouriers)[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const router = useRouter()

  // Correct password for this demo
  const CORRECT_PASSWORD = "admin123"

  useEffect(() => {
    // Reset authentication state when component mounts
    setIsAuthenticated(false)
    setIsPasswordModalOpen(true)
  }, [])

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setIsPasswordModalOpen(false)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleConfirmCourier = (id: string) => {
    setCouriers(couriers.map((courier) => (courier.id === id ? { ...courier, status: "confirmed" } : courier)))
    setDetailsOpen(false)
  }

  const handleCancelCourier = (id: string) => {
    setCouriers(couriers.map((courier) => (courier.id === id ? { ...courier, status: "cancelled" } : courier)))
    setDetailsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>Please enter the admin password to view courier bookings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? "border-red-500" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit()
                  }
                }}
              />
              {passwordError && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Courier Bookings</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {couriers.map((courier) => (
            <CourierCard
              key={courier.id}
              courier={courier}
              onViewDetails={() => {
                setSelectedCourier(courier)
                setDetailsOpen(true)
              }}
              statusBadge={getStatusBadge(courier.status)}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {couriers
            .filter((c) => c.status === "pending")
            .map((courier) => (
              <CourierCard
                key={courier.id}
                courier={courier}
                onViewDetails={() => {
                  setSelectedCourier(courier)
                  setDetailsOpen(true)
                }}
                statusBadge={getStatusBadge(courier.status)}
              />
            ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {couriers
            .filter((c) => c.status === "confirmed")
            .map((courier) => (
              <CourierCard
                key={courier.id}
                courier={courier}
                onViewDetails={() => {
                  setSelectedCourier(courier)
                  setDetailsOpen(true)
                }}
                statusBadge={getStatusBadge(courier.status)}
              />
            ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {couriers
            .filter((c) => c.status === "cancelled")
            .map((courier) => (
              <CourierCard
                key={courier.id}
                courier={courier}
                onViewDetails={() => {
                  setSelectedCourier(courier)
                  setDetailsOpen(true)
                }}
                statusBadge={getStatusBadge(courier.status)}
              />
            ))}
        </TabsContent>
      </Tabs>

      {/* Courier Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedCourier && (
            <>
              <DialogHeader>
                <DialogTitle>Courier Booking Details</DialogTitle>
                <DialogDescription>Booking ID: {selectedCourier.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Customer</Label>
                  <div className="col-span-2">{selectedCourier.customerName}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Pickup</Label>
                  <div className="col-span-2">{selectedCourier.pickupAddress}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Delivery</Label>
                  <div className="col-span-2">{selectedCourier.deliveryAddress}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Package</Label>
                  <div className="col-span-2">{selectedCourier.packageType}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Date & Time</Label>
                  <div className="col-span-2">
                    {selectedCourier.date} at {selectedCourier.time}
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Price</Label>
                  <div className="col-span-2">{selectedCourier.price}</div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-2">{getStatusBadge(selectedCourier.status)}</div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                {selectedCourier.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelCourier(selectedCourier.id)}
                      className="flex items-center gap-2"
                    >
                      <X size={16} /> Cancel Booking
                    </Button>
                    <Button
                      onClick={() => handleConfirmCourier(selectedCourier.id)}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} /> Confirm Booking
                    </Button>
                  </>
                )}
                {selectedCourier.status !== "pending" && <Button onClick={() => setDetailsOpen(false)}>Close</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Courier Card Component
function CourierCard({
  courier,
  onViewDetails,
  statusBadge,
}: {
  courier: (typeof mockCouriers)[0]
  onViewDetails: () => void
  statusBadge: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{courier.customerName}</CardTitle>
          {statusBadge}
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock size={14} />
          {courier.date} at {courier.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div>
            <span className="text-sm font-medium">Pickup:</span> {courier.pickupAddress}
          </div>
          <div>
            <span className="text-sm font-medium">Delivery:</span> {courier.deliveryAddress}
          </div>
          <div>
            <span className="text-sm font-medium">Package:</span> {courier.packageType}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="font-medium">{courier.price}</div>
        <Button variant="outline" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
