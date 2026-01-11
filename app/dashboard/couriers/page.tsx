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
  const [selectedCourier, setSelectedCourier] = useState<(Courier[])[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [podModalOpen, setPodModalOpen] = useState(false)
  const router = useRouter()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [courierToEdit, setCourierToEdit] = useState<(Courier[])[0] | null>(null)
  const [parcelIdToEdit, setParcelIdToEdit] = useState<string | null>(null)
  
  // Separate state for each tab
  const [allCouriers, setAllCouriers] = useState<Courier[]>([])
  const [pendingCouriers, setPendingCouriers] = useState<Courier[]>([])
  const [confirmedCouriers, setConfirmedCouriers] = useState<Courier[]>([])
  const [cancelledCouriers, setCancelledCouriers] = useState<Courier[]>([])
  
  // Separate loading and pagination states for each tab
  const [allState, setAllState] = useState({ isLoading: false, isLoadingMore: false, hasMore: true, offset: 0, total: 0 })
  const [pendingState, setPendingState] = useState({ isLoading: false, isLoadingMore: false, hasMore: true, offset: 0, total: 0 })
  const [confirmedState, setConfirmedState] = useState({ isLoading: false, isLoadingMore: false, hasMore: true, offset: 0, total: 0 })
  const [cancelledState, setCancelledState] = useState({ isLoading: false, isLoadingMore: false, hasMore: true, offset: 0, total: 0 })
  
  const [activeTab, setActiveTab] = useState("pending")
  
  // Correct password for this demo
  const CORRECT_PASSWORD = "123"
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    // Reset authentication state when component mounts
    setIsAuthenticated(false)
    setIsPasswordModalOpen(true)
  }, [])

  // Initial data fetch for active tab
  useEffect(() => {
    if (isAuthenticated) {
      fetchCouriersForTab(activeTab, true)
    }
  }, [isAuthenticated, activeTab])

  // Fetch couriers for specific tab
  const fetchCouriersForTab = async (tab: string, isInitial = false) => {
    if (!isAuthenticated) return
    
    // Determine which state and setter to use
    let state, setState, setCouriers
    let statusFilter = ""
    
    switch (tab) {
      case "all":
        state = allState
        setState = setAllState
        setCouriers = setAllCouriers
        statusFilter = ""
        break
      case "pending":
        state = pendingState
        setState = setPendingState
        setCouriers = setPendingCouriers
        statusFilter = "0"
        break
      case "confirmed":
        state = confirmedState
        setState = setConfirmedState
        setCouriers = setConfirmedCouriers
        statusFilter = "1"
        break
      case "cancelled":
        state = cancelledState
        setState = setCancelledState
        setCouriers = setCancelledCouriers
        statusFilter = "2"
        break
      default:
        return
    }
    
    if (isInitial) {
      setState({ ...state, isLoading: true, offset: 0 })
      setCouriers([])
    } else {
      setState({ ...state, isLoadingMore: true })
    }

    try {
      const currentOffset = isInitial ? 0 : state.offset
      const url = statusFilter 
        ? `/api/getData?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}&status=${statusFilter}`
        : `/api/getData?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}`
      
      const response = await fetch(url)
      const data = await response.json()
      console.log("Fetch URL:", url);
      console.log(`Response for ${tab}:`, data)
      
      if (data.data && Array.isArray(data.data)) {
        if (isInitial) {
          setCouriers(data.data)
        } else {
          setCouriers(prev => [...prev, ...data.data])
        }
        
        // Update state
        setState({
          isLoading: false,
          isLoadingMore: false,
          hasMore: data.pagination?.hasMore || false,
          offset: currentOffset + data.data.length,
          total: data.pagination?.total || 0
        })
      } else {
        setCouriers([])
        setState({
          isLoading: false,
          isLoadingMore: false,
          hasMore: false,
          offset: 0,
          total: 0
        })
      }
    } catch (error) {
      console.error(`Error fetching ${tab} couriers:`, error)
      toast.error("Failed to load couriers")
      setState({
        ...state,
        isLoading: false,
        isLoadingMore: false
      })
    }
  }

  // Handle load more for current tab
  const handleLoadMore = () => {
    const stateMap: any = {
      all: allState,
      pending: pendingState,
      confirmed: confirmedState,
      cancelled: cancelledState
    }
    
    const state = stateMap[activeTab]
    if (!state.isLoadingMore && state.hasMore) {
      fetchCouriersForTab(activeTab, false)
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
      
      // Refresh data for all tabs to sync with database
      fetchCouriersForTab("all", true)
      fetchCouriersForTab("pending", true)
      fetchCouriersForTab("confirmed", true)
      
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
      
      // Refresh data for all tabs to sync with database
      fetchCouriersForTab("all", true)
      fetchCouriersForTab("pending", true)
      fetchCouriersForTab("cancelled", true)
      
      setDetailsOpen(false)
    }
  }

  const handleEditCourier = (id: any) => {
    setParcelIdToEdit(id)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    console.log("Parcel updated successfully")
    // Refresh data for current tab
    fetchCouriersForTab(activeTab, true)
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

  // Render function for grid cards (all, pending, cancelled)
  const renderGridCouriers = (couriers: Courier[], state: any) => {
    if (couriers.length === 0 && !state.isLoading) {
      return (
        <p className="col-span-full text-center text-gray-400">No data found</p>
      )
    }

    return couriers.map((courier) => (
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

  // Render function for horizontal cards (confirmed)
  const renderHorizontalCouriers = (couriers: Courier[], state: any) => {
    if (couriers.length === 0 && !state.isLoading) {
      return (
        <p className="col-span-full text-center text-gray-400">No data found</p>
      )
    }

    return couriers.map((courier) => (
      <CourierCardHorizontal
        key={courier.id}
        courier={courier}
        onViewDetails={() => {
          setSelectedCourier(courier)
          setDetailsOpen(true)
        }}
        statusBadge={getStatusBadge("confirmed")}
        onEdit={() => handleEditCourier(courier.id)}
      />
    ))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courier Bookings</h1>
        {activeTab === "all" && allState.total > 0 && (
          <p className="text-sm text-gray-600">
            Showing {allCouriers.length} of {allState.total} bookings
          </p>
        )}
        {activeTab === "pending" && pendingState.total > 0 && (
          <p className="text-sm text-gray-600">
            Showing {pendingCouriers.length} of {pendingState.total} bookings
          </p>
        )}
        {activeTab === "confirmed" && confirmedState.total > 0 && (
          <p className="text-sm text-gray-600">
            Showing {confirmedCouriers.length} of {confirmedState.total} bookings
          </p>
        )}
        {activeTab === "cancelled" && cancelledState.total > 0 && (
          <p className="text-sm text-gray-600">
            Showing {cancelledCouriers.length} of {cancelledState.total} bookings
          </p>
        )}
      </div>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        {/* ALL TAB */}
        <TabsContent value="all">
          {allState.isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
              {[...Array(8)].map((_, index) => (
                <DeliveryCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
                {renderGridCouriers(allCouriers, allState)}
              </div>

              {allState.hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={allState.isLoadingMore}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    {allState.isLoadingMore ? (
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

              {!allState.hasMore && allCouriers.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No more bookings to load</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* PENDING TAB */}
        <TabsContent value="pending">
          {pendingState.isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
              {[...Array(8)].map((_, index) => (
                <DeliveryCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
                {renderGridCouriers(pendingCouriers, pendingState)}
              </div>

              {pendingState.hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={pendingState.isLoadingMore}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    {pendingState.isLoadingMore ? (
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

              {!pendingState.hasMore && pendingCouriers.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No more bookings to load</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* CONFIRMED TAB - Horizontal Layout */}
        <TabsContent value="confirmed">
          {confirmedState.isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {renderHorizontalCouriers(confirmedCouriers, confirmedState)}
              </div>

              {confirmedState.hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={confirmedState.isLoadingMore}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    {confirmedState.isLoadingMore ? (
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

              {!confirmedState.hasMore && confirmedCouriers.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No more bookings to load</p>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* CANCELLED TAB */}
        <TabsContent value="cancelled">
          {cancelledState.isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
              {[...Array(8)].map((_, index) => (
                <DeliveryCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1">
                {renderGridCouriers(cancelledCouriers, cancelledState)}
              </div>

              {cancelledState.hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={cancelledState.isLoadingMore}
                    className="min-w-[200px]"
                    size="lg"
                  >
                    {cancelledState.isLoadingMore ? (
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

              {!cancelledState.hasMore && cancelledCouriers.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No more bookings to load</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
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

// Regular Courier Card Component (for grid layout)
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

// Horizontal Courier Card Component (for confirmed tab)
function CourierCardHorizontal({
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
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section - Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">
                    {parsedData.toAddress.address}
                  </h3>
                  {statusBadge}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  From: {parsedData.fromAddress.address}
                </p>
              </div>
            </div>
          </div>

          {/* Middle section - Details */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Package</p>
              <p className="text-sm font-medium capitalize">{parsedData.courierType}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Partner</p>
              <p className="text-sm font-medium">{parsedData.courierPartner}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Clock size={12} />
                {courier.date_time.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Right section - Price and actions */}
          <div className="flex items-center gap-3">
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1.5 rounded">
              ₹{parsedData.courierPrice}
            </span>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-9 w-9 p-0">
                <Edit size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={onViewDetails} className="h-9">
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}