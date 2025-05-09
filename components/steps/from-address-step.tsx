"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { FormData } from "../multi-step-form"

interface FromAddressStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function FromAddressStep({ formData, updateFormData, nextStep, prevStep }: FromAddressStepProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/getPrice"
      , {
       method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pincode: formData.pincode ,type: formData.shippingMethod||"surface",courier: formData.courierPartner ,weight: formData.courierDetails.weight,length: formData.courierDetails.length,width: formData.courierDetails.width,height: formData.courierDetails.height,quantity: formData.courierDetails.quantity}),
      })
      
      const data = await response.json()
      console.log("DATA:", data);
      formData.courierPrice = data.data.status;
      
    } catch (error) {
      console.error("Error fetching courier partners:", error)
    }
    console.log("Form in last stage from here prices should be fetched:");
    nextStep()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({
      fromAddress: {
        ...formData.fromAddress,
        [name]: value,
      },
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-50">Sender Address</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="name"
              name="name"
              value={formData.fromAddress.name}
              onChange={handleChange}
              required
              placeholder="Enter sender's full name"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="address"
              name="address"
              value={formData.fromAddress.address}
              onChange={handleChange}
              required
              placeholder="Enter street address"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="city" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              City
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="city"
              name="city"
              value={formData.fromAddress.city}
              onChange={handleChange}
              required
              placeholder="Enter city"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="state" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              State
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="state"
              name="state"
              value={formData.fromAddress.state}
              onChange={handleChange}
              required
              placeholder="Enter state"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="pincode" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Pincode
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="pincode"
              name="pincode"
              value={formData.fromAddress.pincode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Enter 6-digit pincode"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="phone" className="block text-sm font-medium  text-gray-700 dark:text-gray-50 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="phone"
              name="phone"
              value={formData.fromAddress.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-6 py-3 bg-gray-200  text-gray-700 dark:text-gray-50 dark:bg-slate-500 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200"
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

