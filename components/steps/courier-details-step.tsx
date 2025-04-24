"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { FormData, CourierDetail, Address } from "../multi-step-form"

interface CourierDetailsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function CourierDetailsStep({ formData, updateFormData, nextStep, prevStep }: CourierDetailsStepProps) {
  const [multiCouriers, setMultiCouriers] = useState<CourierDetail[]>(formData.multipleCouriers || [])
  const trackingIdGenerated = useRef(false)

  // Generate tracking ID for the main courier
  useEffect(() => {
    // Only generate tracking ID if it hasn't been generated yet and we have the necessary data
    if (!trackingIdGenerated.current && formData.courierPartner && formData.toAddress.name && !formData.trackingId) {
      const courierPrefix = formData.courierPartner.substring(0, 3).toUpperCase()
      const recipientName = formData.toAddress.name.replace(/[^a-zA-Z0-9]/g, "")
      const timestamp = new Date().getTime().toString().substring(5)
      const date = new Date().toISOString().split("T")[0].replace(/-/g, "")

      const trackingId = `${courierPrefix}${recipientName}${date}${timestamp}`

      updateFormData({
        trackingId,
        courierDetails: {
          ...formData.courierDetails,
          trackingId,
        },
      })
      trackingIdGenerated.current = true
    }
  }, [formData.courierPartner, formData.toAddress.name, formData.trackingId, updateFormData, formData.courierDetails])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.courierType === "document" && formData.constantFields.length > 0) {
      updateFormData({ multipleCouriers: multiCouriers })
    }

    nextStep()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateFormData({
      courierDetails: {
        ...formData.courierDetails,
        [name]: value,
      },
      [name]: value, // Also update at the root level for the main courier
    })
  }

  const handleConstantFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      // Add the field to constantFields array
      updateFormData({
        constantFields: [...formData.constantFields, value],
      })
    } else {
      // Remove the field from constantFields array
      updateFormData({
        constantFields: formData.constantFields.filter((field) => field !== value),
      })
    }
  } 
  const generateTrackingId = (recipientName: string): string => {
    const courierPrefix = formData.courierPartner.substring(0, 3).toUpperCase()
    const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, "")
    const timestamp = new Date().getTime().toString().substring(5)
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "")

    return `${courierPrefix}${sanitizedName}${date}${timestamp}`
  }
//  useEffect(() => {
//   generateTrackingId(formData.toAddress.name)
//   }, [])

  const addCourier = () => {
    const newCourier: CourierDetail = {
      weight: "",
      length: "",
      width: "",
      height: "",
      description: "",
      trackingId: "",
      toAddress: {
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      },
      waybill: "",
      quantity: "",
      totalAmount: "",
      shippingMethod: "surface",
      paymentMethod: "cod",
    }
    setMultiCouriers([...multiCouriers, newCourier])
  }

  const updateCourier = (index: number, field: string, value: string | Address) => {
    const updatedCouriers = [...multiCouriers]

    // If updating the recipient name, generate a new tracking ID
    if (
      field === "toAddress" &&
      typeof value === "object" &&
      value.name &&
      value.name !== updatedCouriers[index].toAddress.name
    ) {
      const trackingId = generateTrackingId(value.name)
      updatedCouriers[index] = {
        ...updatedCouriers[index],
        [field]: value,
        trackingId,
      }
    } else {
      updatedCouriers[index] = {
        ...updatedCouriers[index],
        [field]: value,
      }
    }

    setMultiCouriers(updatedCouriers)
  }

  const updateCourierAddress = (index: number, addressField: string, value: string) => {
    const updatedCouriers = [...multiCouriers]
    const updatedAddress = {
      ...updatedCouriers[index].toAddress,
      [addressField]: value,
    }

    // If updating the name, generate a new tracking ID
    if (addressField === "name" && value !== updatedCouriers[index].toAddress.name) {
      const trackingId = generateTrackingId(value)
      updatedCouriers[index] = {
        ...updatedCouriers[index],
        toAddress: updatedAddress,
        trackingId,
      }
    } else {
      updatedCouriers[index] = {
        ...updatedCouriers[index],
        toAddress: updatedAddress,
      }
    }

    setMultiCouriers(updatedCouriers)
  }

  const removeCourier = (index: number) => {
    const updatedCouriers = [...multiCouriers]
    updatedCouriers.splice(index, 1)
    setMultiCouriers(updatedCouriers)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Courier Details</h3>
      <form onSubmit={handleSubmit}>
        {/* Tracking ID Field */}
        <div className="mb-6">
          <label htmlFor="trackingId" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
            Tracking ID
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300  focus:outline-none transition-all duration-200 font-mono"
              id="trackingId"
              value={formData.trackingId}
              readOnly
              aria-describedby="trackingIdHelp"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p id="trackingIdHelp" className="mt-2 text-sm text-gray-500">
            This unique tracking ID is automatically generated and cannot be edited.
          </p>
        </div>
        
        {/* New Courier Detail Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Total Amount (₹)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label htmlFor="Waybill" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Waybill
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="Waybill"
              name="waybill"
              value={formData.waybill}
              onChange={handleChange}
              placeholder="Enter waybill number"
            />
          </div>
          <div>
            <label htmlFor="Quantity" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Quantity
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              step="1"
              required
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label htmlFor="shippingMethod" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Shipping Method
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="shippingMethod"
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              required
            >
              <option value="surface">Surface</option>
              <option value="express">Express</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Payment Method
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="prepaid">Prepaid</option>
              <option value="cod">Cash on Delivery (COD)</option>
              
            </select>
          </div>
          <div>
            <label htmlFor="clientInvoice" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Invoice no (client)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="clientInvoice"
              name="clientInvoice"
              value={formData.clientInvoice}
              onChange={handleChange}
              min="1"
              step="1"
              
              placeholder="Enter invoice no"
            />
          </div>
          <div>
            <label htmlFor="riskSurcharge" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Risk surcharge
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="riskSurcharge"
              name="riskSurcharge"
              value={formData.riskSurcharge}
              onChange={handleChange}
              min="1"
              step="1"
              
              placeholder="Enter charge"
            />
          </div>
          <div>
            <label htmlFor="Risk-factor" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Risk factor
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="Risk-factor"
              name="Risk-factor"
              value={formData.riskfactor}
              onChange={handleChange}
              required
            >
              <option value="owner-risk">owner-risk</option>
              <option value="courier-risk">courier-risk</option>
              
            </select>
          </div>
          <div>
            <label htmlFor="payementType" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
            Payement Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="payementType"
              name="payementType"
              value={formData.payementType}
              onChange={handleChange}
              required
            >
              <option value="cod">cod</option>
              <option value="Billed">Billed</option>
            </select>
          </div>
        </div>

        {formData.courierType === "document" && (
          <div className="mb-6 p-6  text-gray-700 dark:text-gray-50 rounded-xl border border-gray-200">
            <div className="mb-4">
              <h5 className="font-medium text-lg text-gray-50 mb-3">Select Constant Fields</h5>
              <p className="text-gray-600 mb-4">Select fields that will remain constant across multiple couriers</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200  text-gray-700 dark:text-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    value="weight"
                    checked={formData.constantFields.includes("weight")}
                    onChange={handleConstantFieldChange}
                  />
                  <span className=" text-gray-700 dark:text-gray-50">Weight</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200  text-gray-700 dark:text-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    value="dimensions"
                    checked={formData.constantFields.includes("dimensions")}
                    onChange={handleConstantFieldChange}
                  />
                  <span className=" text-gray-700 dark:text-gray-50">Dimensions</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200  text-gray-700 dark:text-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    value="description"
                    checked={formData.constantFields.includes("description")}
                    onChange={handleConstantFieldChange}
                  />
                  <span className=" text-gray-700 dark:text-gray-50">Description</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200  text-gray-700 dark:text-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    value="shippingMethod"
                    checked={formData.constantFields.includes("shippingMethod")}
                    onChange={handleConstantFieldChange}
                  />
                  <span className=" text-gray-700 dark:text-gray-50">Shipping Method</span>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200  text-gray-700 dark:text-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    value="paymentMethod"
                    checked={formData.constantFields.includes("paymentMethod")}
                    onChange={handleConstantFieldChange}
                  />
                  <span className=" text-gray-700 dark:text-gray-50">Payment Method</span>
                </label>
              </div>
            </div>

            {formData.constantFields.length > 0 && (
              <>
                <div className="mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 flex items-center"
                    onClick={addCourier}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Another Courier
                  </motion.button>
                </div>

                {multiCouriers.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-lg text-gray-800">Multiple Couriers</h5>
                    {multiCouriers.map((courier, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className=" rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                      >
                        <div className="flex justify-between items-center px-4 py-3  border-b border-gray-200">
                          <h6 className="font-medium  text-gray-700 dark:text-gray-50">Courier #{index + 1}</h6>
                          <button
                            type="button"
                            className="p-1 text-red-500 hover:text-red-700 focus:outline-none"
                            onClick={() => removeCourier(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          {/* Tracking ID for this courier */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">Tracking ID</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300  focus:outline-none transition-all duration-200 font-mono"
                              value={courier.trackingId}
                              readOnly
                            />
                          </div>

                          {/* To Address for this courier */}
                          <div className="mb-4">
                            <h6 className="font-medium  text-gray-700 dark:text-gray-50 mb-3">Recipient Address</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Name</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.name}
                                  onChange={(e) => updateCourierAddress(index, "name", e.target.value)}
                                  required
                                  placeholder="Recipient name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Phone</label>
                                <input
                                  type="tel"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.phone}
                                  onChange={(e) => updateCourierAddress(index, "phone", e.target.value)}
                                  required
                                  placeholder="Phone number"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Address</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.address}
                                  onChange={(e) => updateCourierAddress(index, "address", e.target.value)}
                                  required
                                  placeholder="Street address"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">City</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.city}
                                  onChange={(e) => updateCourierAddress(index, "city", e.target.value)}
                                  required
                                  placeholder="City"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">State</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.state}
                                  onChange={(e) => updateCourierAddress(index, "state", e.target.value)}
                                  required
                                  placeholder="State"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Pincode</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.toAddress.pincode}
                                  onChange={(e) => updateCourierAddress(index, "pincode", e.target.value)}
                                  required
                                  pattern="[0-9]{6}"
                                  maxLength={6}
                                  placeholder="6-digit pincode"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {!formData.constantFields.includes("weight") && (
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Weight (kg)</label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.weight}
                                  onChange={(e) => updateCourier(index, "weight", e.target.value)}
                                  step="0.01"
                                  min="0"
                                  required
                                  placeholder="Weight"
                                />
                              </div>
                            )}
                            
                            {!formData.constantFields.includes("dimensions") && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Dimensions (cm)</label>
                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Length"
                                    value={courier.length}
                                    onChange={(e) => updateCourier(index, "length", e.target.value)}
                                    min="0"
                                    required
                                  />
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Width"
                                    value={courier.width}
                                    onChange={(e) => updateCourier(index, "width", e.target.value)}
                                    min="0"
                                    required
                                  />
                                  <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Height"
                                    value={courier.height}
                                    onChange={(e) => updateCourier(index, "height", e.target.value)}
                                    min="0"
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            {!formData.constantFields.includes("description") && (
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Description</label>
                                <textarea
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.description}
                                  onChange={(e) => updateCourier(index, "description", e.target.value)}
                                  rows={2}
                                  placeholder="Item description"
                                ></textarea>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Total Amount (₹)</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                value={courier.totalAmount}
                                onChange={(e) => updateCourier(index, "totalAmount", e.target.value)}
                                min="0"
                                step="0.01"
                                required
                                placeholder="Amount"
                              />
                            </div>

                            {!formData.constantFields.includes("shippingMethod") && (
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Shipping Method</label>
                                <select
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.shippingMethod}
                                  onChange={(e) =>
                                    updateCourier(index, "shippingMethod", e.target.value as "surface" | "express")
                                  }
                                  required
                                >
                                  <option value="surface">Surface</option>
                                  <option value="express">Express</option>
                                </select>
                              </div>
                            )}

                            {!formData.constantFields.includes("paymentMethod") && (
                              <div>
                                <label className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-1">Payment Method</label>
                                <select
                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  value={courier.paymentMethod}
                                  onChange={(e) =>
                                    updateCourier(index, "paymentMethod", e.target.value as "cod" | "prepaid")
                                  }
                                  required
                                >
                                  <option value="cod">Cash on Delivery</option>
                                  <option value="prepaid">Prepaid</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {(formData.constantFields.length === 0 || formData.courierType === "parcel") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="weight"
                name="weight"
                value={formData.courierDetails.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                placeholder="Enter weight"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="dimensions" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Length"
                  id="length"
                  name="length"
                  value={formData.courierDetails.length}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Width"
                  id="width"
                  name="width"
                  value={formData.courierDetails.width}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Height"
                  id="height"
                  name="height"
                  value={formData.courierDetails.height}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="description"
                name="description"
                value={formData.courierDetails.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the contents of your courier"
              ></textarea>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-6 py-3 bg-gray-200  text-gray-700 dark:bg-slate-500 dark:text-gray-50 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200"
            onClick={prevStep}
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
          >
            Next
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

