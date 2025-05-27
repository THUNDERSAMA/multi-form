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
  trackingId: string
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
  courierimage: string,
          courierName: string,
          courierPrice: string,
          payementType:string,
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
  const [id, setId] = useState(0)
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("Please enter a tracking ID")
      return
    }

    setIsLoading(true)
    //setError("")

    // Simulate API call
    
      
      setTrackingId(searchInput)

      
      if (searchInput.length > 14) {
        //fetch parcel details from api
        const response = await fetch("/api/getbyId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId: searchInput }),
        })
        
        const data = await response.json()
        //console.log("DATA:", data)
        //console.log("DATA:", data.data)
       // console.log("DATA:", data.data.data)
       // console.log("DATA:", data.data.data.pincode)
        console.log("DATA:", data.data.id)
        setId(data.data.id)
        const datas= data.data.data;
        setParcel({
          id: searchInput,
          trackingId: searchInput,
          status: data.data.delivered==0?"in-transit":"delivered",
          senderName: datas.fromAddress.name,
          senderAddress: datas.fromAddress.address,
          recipientName: datas.toAddress.name,
          recipientAddress: datas.toAddress.address,
          packageType: datas.courierType,
          weight: datas.courierDetails.weight,
          dimensions: datas.courierDetails.length + " × " + datas.courierDetails.width + " × " + datas.courierDetails.height,
          createdAt: data.data.dtime,
          estimatedDelivery: "",
          courierimage: datas.courierImage,
          courierName: datas.courierPartner,
          courierPrice: datas.courierPrice,
          payementType: datas.payementType,
          history: [
            
          ],
        })
      } 
      else if (searchInput.length < 14) {
         //decode the tracking id
         const deoderesponse = await fetch("/api/decode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: searchInput }),
        })
        const deodeddata = await deoderesponse.json()
        console.log("DATA:", deodeddata.decoded);
         const decodedId = deodeddata.decoded;
        const response = await fetch("/api/getbyId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId: decodedId }),
        })
        
        const data = await response.json();
         console.log("DATA:", data.data.id)
        setId(data.data.id)
        const datas= data.data.data;
        setParcel({
          id: searchInput,
          trackingId: decodedId,
          status: data.data.delivered==0?"in-transit":"delivered",
          senderName: datas.fromAddress.name,
          senderAddress: datas.fromAddress.address,
          recipientName: datas.toAddress.name,
          recipientAddress: datas.toAddress.address,
          packageType: datas.courierType,
          weight: datas.courierDetails.weight,
          dimensions: datas.courierDetails.length + " × " + datas.courierDetails.width + " × " + datas.courierDetails.height,
          createdAt: data.data.dtime,
          estimatedDelivery: "",
          courierimage: datas.courierImage,
          courierName: datas.courierName,
          courierPrice: datas.courierPrice,
          payementType: datas.payementType,
          history: [
            
          ],
        })
      } 
      else {
        setError("No parcel found with this tracking ID")
        setParcel(null)
      }
   setIsLoading(false)
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

  const handleToogle = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const isChecked = event.target.checked;
    if (!isChecked) {
  const response = await fetch("/api/updateData", {
      method: "POST",
      body: JSON.stringify({ id, status: "not-delivered" }),
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
      console.log("Courier set to transit")
      alert("Courier set to transit")
     
    }
    }
    else {
      const response = await fetch("/api/updateData", {
      method: "POST",
      body: JSON.stringify({ id, status: "delivered" }),
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
      console.log("Courier set to delivered")
      alert("Courier set to delivered")
     
    }
      console.log("Parcel is delivered");
     
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Parcel Details</h1>
        {/* {parcel && (
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
        )} */}
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
                placeholder="Enter tracking ID (e.g., ELEUgh2025047606494892)"
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
                  {/* <TabsTrigger value="tracking">Tracking History</TabsTrigger>
                  <TabsTrigger value="update">Update Status</TabsTrigger> */}
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
                       <div>
                        <h3 className="mb-2 text-lg font-medium">Courier image</h3>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <img src={parcel.courierimage} alt="Courier" className="h-auto w-auto rounded-md" />
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
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">Tracking id</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.trackingId}</span>
                            </div>
                            <Separator />
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
                                <span className="text-sm">Payment method</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.packageType}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">courier name</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.courierName}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">courier price</span>
                              </div>
                              <span className="text-sm font-medium">{parcel.courierPrice}</span>
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
                              <label className="inline-flex items-center me-5 cursor-pointer">
  <input
    type="checkbox"
    value="delivered"
    className="sr-only peer"
    defaultChecked={parcel.status !== "in-transit"}
    onChange={handleToogle}
  />
  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Delivered</span>
</label>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* <TabsContent value="tracking" className="space-y-4">
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
                </TabsContent> */}
                {/* <TabsContent value="update" className="space-y-4">
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
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
