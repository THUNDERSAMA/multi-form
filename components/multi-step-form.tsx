"use client"

import { useState } from "react"
import { Camera, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import PincodeStep from "./steps/pincode-step"
import CourierPartnerStep from "./steps/courier-partner-step"
import CourierTypeStep from "./steps/courier-type-step"
import ToAddressStep from "./steps/to-address-step"
import CourierDetailsStep from "./steps/courier-details-step"
import FromAddressStep from "./steps/from-address-step"
import FinishStep from "./steps/finish-step"
import ProgressBar from "./progress-bar"

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

// Compression function
function compressBase64(
  base64: string | ArrayBuffer | null,
  quality: number = 0.6
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!base64 || typeof base64 !== "string") {
      reject(new Error("Invalid base64 input"))
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = base64

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get 2D context"))
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const compressed = canvas.toDataURL("image/jpeg", quality)
      resolve(compressed)
    }

    img.onerror = (err) => {
      reject(new Error("Image load error: " + err))
    }
  })
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isScanning, setIsScanning] = useState(false)
  const [formData, setFormData] = useState<FormData>({
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
  })

  const totalSteps = formData.courierType === "parcel" ? 7 : 7

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const updateFormData = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data })
  }

  // AI Scan functionality
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsScanning(true)

      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string
          
          // Compress the image
          const compressedBase64 = await compressBase64(base64, 0.6)
          
          // Save to formData
          updateFormData({ courierImage: compressedBase64 })
          
          // Send to Groq AI
          const response = await fetch("/api/scan-parcel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: compressedBase64 }),
          })

          if (!response.ok) {
            throw new Error("Failed to scan image")
          }

          const data = await response.json()
          
          toast.promise(Promise.resolve(data), {
            loading: 'Scanning parcel details...',
            success: 'Parcel details scanned successfully!',
            error: 'Failed to scan parcel details.',
          })
          
          // Batch all updates into a single call to prevent state overwrites
          const updates: Partial<FormData> = {}

          // Update toAddress
          if (data.toAddress) {
            updates.toAddress = {
              name: data.toAddress.name || "",
              address: data.toAddress.address || "",
              city: data.toAddress.city || "",
              state: data.toAddress.state || "",
              pincode: data.toAddress.pincode || "",
              phone: data.toAddress.phone || "",
            }
          }

          // Update fromAddress
          if (data.fromAddress) {
            updates.fromAddress = {
              name: data.fromAddress.name || "",
              address: data.fromAddress.address || "",
              city: data.fromAddress.city || "",
              state: data.fromAddress.state || "",
              pincode: data.fromAddress.pincode || "",
              phone: data.fromAddress.phone || "",
            }
          }

          // Update courierDetails
          if (data.courierDetails) {
            updates.courierDetails = {
              ...formData.courierDetails,
              weight: data.courierDetails.weight || "",
              length: data.courierDetails.length || "",
              width: data.courierDetails.width || "",
              height: data.courierDetails.height || "",
              description: data.courierDetails.description || "",
              trackingId: data.courierDetails.trackingId || "",
              waybill: data.courierDetails.waybill || "",
              quantity: data.courierDetails.quantity || "",
              toAddress: data.toAddress || formData.courierDetails.toAddress,
            }
          }

          // Update top-level fields
          if (data.trackingId) updates.trackingId = data.trackingId
          if (data.waybill) updates.waybill = data.waybill
          if (data.quantity) updates.quantity = data.quantity
          if (data.pincode) updates.pincode = data.pincode

          // Apply all updates at once
          updateFormData(updates)
          
          // Log the updated form data
          console.log("AI Scan Complete - Updated Form Data:", {
            ...formData,
            ...updates
          })
        } catch (error) {
          console.error("Error processing image:", error)
          toast.error("Failed to process image. Please try again.")
        } finally {
          setIsScanning(false)
        }
      }

      reader.onerror = () => {
        toast.error("Failed to read image file")
        setIsScanning(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image. Please try again.")
      setIsScanning(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PincodeStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />
      case 2:
        return (
          <CourierPartnerStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return (
          <CourierTypeStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 4:
        return (
          <ToAddressStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
        )
      case 5:
        return (
          <CourierDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 6:
        return (
          <FromAddressStep
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 7:
        return <FinishStep formData={formData} updateFormData={updateFormData} prevStep={prevStep} />
      default:
        return <PincodeStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-muted">
      <div className="p-6 md:p-8">
        {/* AI Scan Button */}
        <div className="mb-6">
          <label
            htmlFor="ai-scan-upload"
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
              transition-all duration-200 cursor-pointer
              ${
                isScanning
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
              }
            `}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                AI Scan
                <Upload className="w-4 h-4" />
              </>
            )}
          </label>
          <input
            id="ai-scan-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isScanning}
            className="hidden"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload a photo of your parcel to auto-fill details
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="transition-opacity duration-300">{renderStep()}</div>
      </div>
    </div>
  )
}