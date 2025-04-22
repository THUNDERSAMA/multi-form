"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export type Address = {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

export type CourierDetail = {
  weight: string
  length: string
  waybill: string
  quantity: string
  width: string
  height: string
  description: string
  trackingId: string
  toAddress: Address
  totalAmount: string
  shippingMethod: "surface" | "express"
  paymentMethod: "cod" | "prepaid"
}

export type FormData = {
  pincode: string
  courierPartner: string
  courierPrice: string
  courierType: "parcel" | "document"
  riskSurcharge: string
  riskfactor: "owner-risk" | "courier-risk"
  clientInvoice: string
  toAddress: Address
  fromAddress: Address
  courierDetails: CourierDetail
  constantFields: string[]
  multipleCouriers: CourierDetail[]
  payementType: string
  courierImage: string
  trackingId: string
  waybill: string
  quantity: string
  totalAmount: string
  shippingMethod: "surface" | "express"
  paymentMethod: "cod" | "prepaid"
}

// Default empty form data
const defaultFormData: FormData = {
  pincode: "",
  courierPartner: "",
  courierPrice: "",
  courierType: "parcel",
  riskSurcharge: "",
  riskfactor: "owner-risk",
  clientInvoice: "",
  toAddress: {
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  },
  fromAddress: {
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  },
  courierDetails: {
    weight: "",
    length: "",
    width: "",
    height: "",
    description: "",
    trackingId: "",
    waybill: "",
    quantity: "",
    toAddress: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    },
    totalAmount: "",
    shippingMethod: "surface",
    paymentMethod: "cod",
  },
  constantFields: [],
  multipleCouriers: [],
  payementType: "cod",
  courierImage: "",
  trackingId: "",
  totalAmount: "",
  waybill: "",
  quantity: "",
  shippingMethod: "surface",
  paymentMethod: "prepaid",
}

interface EditParcelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parcelId: string
  onSuccess?: () => void
}

export function EditParcelDialog({ open, onOpenChange, parcelId, onSuccess }: EditParcelDialogProps) {
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch parcel data when dialog opens
  useEffect(() => {
    if (open && parcelId) {
      fetchParcelData(parcelId)
    }
  }, [open, parcelId])

  const fetchParcelData = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`/api/parcels/${id}`)
      // if (!response.ok) throw new Error('Failed to fetch parcel data')
      // const data = await response.json()

      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on the parcel ID
      const mockData: FormData = {
        pincode: "10001",
        courierPartner: "FutureCourier",
        courierPrice: "25.99",
        courierType: "parcel",
        riskSurcharge: "2.50",
        riskfactor: "owner-risk",
        clientInvoice: id,
        toAddress: {
          name: "John Doe",
          address: "456 Park Ave",
          city: "New York",
          state: "NY",
          pincode: "10022",
          phone: "1234567890",
        },
        fromAddress: {
          name: "Sender Name",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          pincode: "10001",
          phone: "0987654321",
        },
        courierDetails: {
          weight: "1.5",
          length: "30",
          width: "20",
          height: "10",
          description: "Small Package",
          trackingId: id,
          waybill: id,
          quantity: "1",
          toAddress: {
            name: "John Doe",
            address: "456 Park Ave",
            city: "New York",
            state: "NY",
            pincode: "10022",
            phone: "1234567890",
          },
          totalAmount: "25.99",
          shippingMethod: "surface",
          paymentMethod: "cod",
        },
        constantFields: [],
        multipleCouriers: [],
        payementType: "cod",
        courierImage: "",
        trackingId: id,
        totalAmount: "25.99",
        waybill: id,
        quantity: "1",
        shippingMethod: "surface",
        paymentMethod: "cod",
      }

      setFormData(mockData)
    } catch (err) {
      console.error("Error fetching parcel data:", err)
      setError("Failed to load parcel data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load parcel data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    if (section === "toAddress" || section === "fromAddress") {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      })
    } else if (section === "courierDetails") {
      setFormData({
        ...formData,
        courierDetails: {
          ...formData.courierDetails,
          [field]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleRadioChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`/api/parcels/${parcelId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) throw new Error('Failed to update parcel')
      // const data = await response.json()

      // For demo purposes, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Parcel details updated successfully",
      })

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("Error updating parcel:", err)
      setError("Failed to update parcel. Please try again.")
      toast({
        title: "Error",
        description: "Failed to update parcel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Parcel Details</DialogTitle>
          <DialogDescription>Update the information for parcel #{parcelId}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading parcel data...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchParcelData(parcelId)}>Try Again</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="sender">Sender Details</TabsTrigger>
                    <TabsTrigger value="receiver">Receiver Details</TabsTrigger>
                    <TabsTrigger value="package">Package Details</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trackingId">Tracking ID</Label>
                        <Input
                          id="trackingId"
                          value={formData.trackingId}
                          onChange={(e) => handleInputChange("trackingId", "trackingId", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waybill">Waybill Number</Label>
                        <Input
                          id="waybill"
                          value={formData.waybill}
                          onChange={(e) => handleInputChange("waybill", "waybill", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courierPartner">Courier Partner</Label>
                        <Input
                          id="courierPartner"
                          value={formData.courierPartner}
                          onChange={(e) => handleInputChange("courierPartner", "courierPartner", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="courierPrice">Courier Price</Label>
                        <Input
                          id="courierPrice"
                          value={formData.courierPrice}
                          onChange={(e) => handleInputChange("courierPrice", "courierPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalAmount">Total Amount</Label>
                        <Input
                          id="totalAmount"
                          value={formData.totalAmount}
                          onChange={(e) => handleInputChange("totalAmount", "totalAmount", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientInvoice">Client Invoice</Label>
                        <Input
                          id="clientInvoice"
                          value={formData.clientInvoice}
                          onChange={(e) => handleInputChange("clientInvoice", "clientInvoice", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Courier Type</Label>
                      <RadioGroup
                        value={formData.courierType}
                        onValueChange={(value) => handleRadioChange("courierType", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="parcel" id="parcel" />
                          <Label htmlFor="parcel">Parcel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="document" id="document" />
                          <Label htmlFor="document">Document</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Risk Factor</Label>
                      <RadioGroup
                        value={formData.riskfactor}
                        onValueChange={(value) => handleRadioChange("riskfactor", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="owner-risk" id="owner-risk" />
                          <Label htmlFor="owner-risk">Owner Risk</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="courier-risk" id="courier-risk" />
                          <Label htmlFor="courier-risk">Courier Risk</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Shipping Method</Label>
                      <RadioGroup
                        value={formData.shippingMethod}
                        onValueChange={(value) => handleRadioChange("shippingMethod", value as "surface" | "express")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="surface" id="surface" />
                          <Label htmlFor="surface">Surface</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express">Express</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleRadioChange("paymentMethod", value as "cod" | "prepaid")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prepaid" id="prepaid" />
                          <Label htmlFor="prepaid">Prepaid</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  {/* Sender Details Tab */}
                  <TabsContent value="sender" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromName">Name</Label>
                        <Input
                          id="fromName"
                          value={formData.fromAddress.name}
                          onChange={(e) => handleInputChange("fromAddress", "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromPhone">Phone</Label>
                        <Input
                          id="fromPhone"
                          value={formData.fromAddress.phone}
                          onChange={(e) => handleInputChange("fromAddress", "phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromAddress">Address</Label>
                      <Textarea
                        id="fromAddress"
                        value={formData.fromAddress.address}
                        onChange={(e) => handleInputChange("fromAddress", "address", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromCity">City</Label>
                        <Input
                          id="fromCity"
                          value={formData.fromAddress.city}
                          onChange={(e) => handleInputChange("fromAddress", "city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromState">State</Label>
                        <Input
                          id="fromState"
                          value={formData.fromAddress.state}
                          onChange={(e) => handleInputChange("fromAddress", "state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromPincode">Pincode</Label>
                        <Input
                          id="fromPincode"
                          value={formData.fromAddress.pincode}
                          onChange={(e) => handleInputChange("fromAddress", "pincode", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Receiver Details Tab */}
                  <TabsContent value="receiver" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="toName">Name</Label>
                        <Input
                          id="toName"
                          value={formData.toAddress.name}
                          onChange={(e) => handleInputChange("toAddress", "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toPhone">Phone</Label>
                        <Input
                          id="toPhone"
                          value={formData.toAddress.phone}
                          onChange={(e) => handleInputChange("toAddress", "phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toAddress">Address</Label>
                      <Textarea
                        id="toAddress"
                        value={formData.toAddress.address}
                        onChange={(e) => handleInputChange("toAddress", "address", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="toCity">City</Label>
                        <Input
                          id="toCity"
                          value={formData.toAddress.city}
                          onChange={(e) => handleInputChange("toAddress", "city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toState">State</Label>
                        <Input
                          id="toState"
                          value={formData.toAddress.state}
                          onChange={(e) => handleInputChange("toAddress", "state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toPincode">Pincode</Label>
                        <Input
                          id="toPincode"
                          value={formData.toAddress.pincode}
                          onChange={(e) => handleInputChange("toAddress", "pincode", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Package Details Tab */}
                  <TabsContent value="package" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          value={formData.courierDetails.weight}
                          onChange={(e) => handleInputChange("courierDetails", "weight", e.target.value)}
                          type="number"
                          step="0.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange("quantity", "quantity", e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input
                          id="length"
                          value={formData.courierDetails.length}
                          onChange={(e) => handleInputChange("courierDetails", "length", e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input
                          id="width"
                          value={formData.courierDetails.width}
                          onChange={(e) => handleInputChange("courierDetails", "width", e.target.value)}
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          value={formData.courierDetails.height}
                          onChange={(e) => handleInputChange("courierDetails", "height", e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.courierDetails.description}
                        onChange={(e) => handleInputChange("courierDetails", "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
