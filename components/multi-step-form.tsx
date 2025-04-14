"use client"

import { useState } from "react"
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
  courierPrice: string,
  courierType: "parcel" | "document"
  toAddress: Address
  fromAddress: Address
  courierDetails: CourierDetail
  constantFields: string[]
  multipleCouriers: CourierDetail[]
  payementType: string
  courierImage: string
  trackingId: string
  waybill: string,
  quantity: string,
  totalAmount: string
  shippingMethod: "surface" | "express"
  paymentMethod: "cod" | "prepaid"
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    pincode: "",
    courierPartner: "",
    courierPrice: "",
    courierType: "parcel",
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-700">
      <div className="p-6 md:p-8">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="transition-opacity duration-300">{renderStep()}</div>
      </div>
    </div>
  )
}

