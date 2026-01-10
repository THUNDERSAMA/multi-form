"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
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
import { Check, Clock, X, Download, FileText, Edit, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import PODTemplate from "./pod-template"
import type { Courier } from "@/lib/courierType"
import { Console } from "console"
import { EditParcelDialog } from "./EditParcelDialog"
import { Toaster, toast } from 'sonner';
import DeliveryCardSkeleton from "@/components/loader/deliverySkeleton"
import Invoice from "@/components/multiform_ui/invoice"


export default function CouriersPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [selectedCourier, setSelectedCourier] = useState<(Courier[])[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [podModalOpen, setPodModalOpen] = useState(false)
  const router = useRouter()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [courierToEdit, setCourierToEdit] = useState<(Courier[])[0] | null>(null)
  const [parcelIdToEdit, setParcelIdToEdit] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Infinite scroll states
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  
  // Correct password for this demo
  const CORRECT_PASSWORD = "123"
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    // Reset authentication state when component mounts
    setIsAuthenticated(false)
    setIsPasswordModalOpen(true)
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchCouriers(true)
    }
  }, [isAuthenticated])

  // Fetch couriers function with pagination
  const fetchCouriers = async (isInitial = false) => {
    if (!isAuthenticated) return
    
    if (isInitial) {
      setIsLoading(true)
      setOffset(0)
      setCouriers([])
    } else {
      setIsLoadingMore(true)
    }

    try {
      const currentOffset = isInitial ? 0 : offset
      const response = await fetch(`/api/getData?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`)
      
      const data = await response.json()
      console.log("Response:", data)
      
      if (data.data && Array.isArray(data.data)) {
        if (isInitial) {
          setCouriers(data.data)
        } else {
          setCouriers(prev => [...prev, ...data.data])
        }
        
        // Update pagination state
        setHasMore(data.pagination?.hasMore || false)
        setTotalCount(data.pagination?.total || 0)
        setOffset(currentOffset + data.data.length)
      } else {
        setCouriers([])
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching couriers:", error)
      toast.error("Failed to load couriers")
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Handle load more button click
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchCouriers(false)
    }
  }

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setIsPasswordModalOpen(false)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleConfirmCourier = async (id: any) => {
    console.log("Confirming courier with ID:", id)
    
    const response = await fetch("/api/updateData", {
      method: "POST",
      body: JSON.stringify({ id, status: "confirm" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      console.error("Error confirming courier:", response.statusText)
      return
    }
    
    const data = await response.json()
    if (data.data.status === "success") {
      console.log("Courier confirmed successfully")
      toast.success("Courier confirmed successfully ✅")
      
      // Update local state instead of full refresh
      setCouriers(prevCouriers => 
        prevCouriers.map(courier => 
          courier.id === id ? { ...courier, status: 1 } : courier
        )
      )
      
      setDetailsOpen(false)
    }
  }

  const handleCancelCourier = async (id: any) => {
    console.log("Cancelling courier with ID:", id)
    
    const response = await fetch("/api/updateData", {
      method: "POST",
      body: JSON.stringify({ id, status: "cancel" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      console.error("Error cancelling courier:", response.statusText)
      return
    }
    
    const data = await response.json()
    if (data.data.status === "success") {
      console.log("Courier cancelled successfully")
      toast.success("Courier cancelled ❌ successfully")
      
      // Update local state instead of full refresh
      setCouriers(prevCouriers => 
        prevCouriers.map(courier => 
          courier.id === id ? { ...courier, status: 2 } : courier
        )
      )
      
      setDetailsOpen(false)
    }
  }

  const handleEditCourier = (id: any) => {
    setParcelIdToEdit(id)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    console.log("Parcel updated successfully")
    // Refresh data to show updates
    fetchCouriers(true)
  }

  const generatePOD = () => {
    setPodModalOpen(true)
  }

  const podRef = useRef<HTMLDivElement>(null)
  const downloadPOD = async () => {
    if (podRef.current) {
      const canvas = await html2canvas(podRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `POD-${selectedCourier?.id}.png`
      link.href = dataUrl
      link.click()
    }
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

  const renderCouriers = (filterStatus?: string) => {
    const filtered = filterStatus
      ? couriers.filter((c) => c.status.toString() === filterStatus)
      : couriers

    if (filtered.length === 0 && !isLoading) {
      return (
        <p className="col-span-full text-center text-gray-400">No data found</p>
      )
    }

    return filtered.map((courier) => (
      <CourierCard
        key={courier.id}
        courier={courier}
        onViewDetails={() => {
          setSelectedCourier(courier)
          setDetailsOpen(true)
        }}
        statusBadge={getStatusBadge(
          courier.status == 0
            ? "pending"
            : courier.status == 1
            ? "confirmed"
            : "cancelled"
        )}
        onEdit={() => handleEditCourier(courier.id)}
      />
    ))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courier Bookings</h1>
        {totalCount > 0 && (
          <p className="text-sm text-gray-600">
            Showing {couriers.length} of {totalCount} bookings
          </p>
        )}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
            {[...Array(8)].map((_, index) => (
              <DeliveryCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <TabsContent 
              value="all" 
              className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1"
            >
              {renderCouriers()}
            </TabsContent>
            
            <TabsContent 
              value="pending" 
              className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1"
            >
              {renderCouriers("0")}
            </TabsContent>
            
            <TabsContent 
              value="confirmed" 
              className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1"
            >
              {renderCouriers("1")}
            </TabsContent>
            
            <TabsContent 
              value="cancelled" 
              className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1"
            >
              {renderCouriers("2")}
            </TabsContent>

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="col-span-full flex justify-center py-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[200px]"
                  size="lg"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Loading...
                    </>
                  ) : (
                    <>Load More</>
                  )}
                </Button>
              </div>
            )}

            {!hasMore && couriers.length > 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No more bookings to load</p>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Courier Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="">
          {selectedCourier && (
            <>
            {(() => {
              const parsedData = typeof selectedCourier.data === "string"
                ? JSON.parse(selectedCourier.data)
                : selectedCourier.data
              console.log("Parsed Data:", selectedCourier.date_time)
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Courier Booking Details</DialogTitle>
                    <DialogDescription>Booking ID: {parsedData.trackingId}</DialogDescription>
                  </DialogHeader>
                
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4 w-full">
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Customer</Label>
                      <div className="col-span-2 text-gray-800">{parsedData.fromAddress.name}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Pickup</Label>
                      <div className="col-span-2 text-gray-800">{parsedData.fromAddress.address}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Delivery</Label>
                      <div className="col-span-2 text-gray-800">{parsedData.toAddress.address}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Package</Label>
                      <div className="col-span-2 text-gray-800 capitalize">{parsedData.courierType}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Date & Time</Label>
                      <div className="col-span-2 text-gray-800">{selectedCourier.date_time}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Price</Label>
                      <div className="col-span-2 text-gray-800 font-semibold">₹{parsedData.courierPrice}</div>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label className="text-right text-gray-600 font-medium">Status</Label>
                      <div className="col-span-2">
                        {getStatusBadge(
                          selectedCourier.status == 0
                            ? "pending"
                            : selectedCourier.status == 1
                            ? "confirmed"
                            : "cancelled"
                        )}
                      </div>
                    </div>
                  </div>
                
                  <DialogFooter className="flex justify-between flex-wrap gap-2 pt-4">
                    {selectedCourier.status == 0 && (
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
                
                    <div className="flex gap-2 ml-auto">
                      <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                        Close
                      </Button>
                      <Button onClick={generatePOD} className="flex items-center gap-2">
                        <FileText size={16} /> Generate POD
                      </Button>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Invoice formData={parsedData} shortCode={parsedData.shortTrackingId}/>
                    </div>
                  </DialogFooter>
                </>
              )
            })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* POD Modal */}
      <Dialog open={podModalOpen} onOpenChange={setPodModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Proof of Delivery (POD)</DialogTitle>
            <DialogDescription>Preview and download the proof of delivery document</DialogDescription>
          </DialogHeader>

          <div className="py-4 overflow-auto max-h-[70vh]">
            <div ref={podRef}>{selectedCourier && <PODTemplate courier={selectedCourier} />}</div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPodModalOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadPOD} className="flex items-center gap-2">
              <Download size={16} /> Download POD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {parcelIdToEdit && (
        <EditParcelDialog
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          parcelId={parcelIdToEdit}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

// Courier Card Component
function CourierCard({
  courier,
  onViewDetails,
  statusBadge,
  onEdit
}: {
  courier: Courier
  onViewDetails: () => void
  onEdit: () => void
  statusBadge: React.ReactNode
}) { 
  const parsedData = typeof courier.data === 'string' ? JSON.parse(courier.data) : courier.data
  
  return (
    <Card className="w-90 h-72 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
            {parsedData.toAddress.address}
          </CardTitle>
          {statusBadge}
        </div>
        <CardDescription className="flex items-center gap-1 text-xs mt-1">
          <Clock size={12} />
          {courier.date_time}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-2 flex-1 overflow-hidden">
        <div className="text-sm">
          <span className="text-muted-foreground text-xs">From:</span>
          <p className="font-medium line-clamp-1">{parsedData.fromAddress.address}</p>
        </div>
        
        <div className="flex gap-4 text-xs">
          <div className="flex-1 min-w-0">
            <span className="text-muted-foreground">Package:</span>
            <p className="font-medium truncate">{parsedData.courierType}</p>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-muted-foreground">Partner:</span>
            <p className="font-medium truncate">{parsedData.courierPartner}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-1 rounded dark:bg-green-900 dark:text-green-300">
          ₹{parsedData.courierPrice}
        </span>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
            <Edit size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={onViewDetails} className="h-8 text-xs">
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}