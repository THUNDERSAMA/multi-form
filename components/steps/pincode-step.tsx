"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { FormData } from "../multi-step-form"

interface PincodeStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
}

export default function PincodeStep({ formData, updateFormData, nextStep }: PincodeStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Enter Pincode</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-50">
            Pincode
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            id="pincode"
            value={formData.pincode}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            required
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Enter 6-digit pincode"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-50">Please enter a valid 6-digit pincode</p>
        </div>
        <div className="flex justify-end">
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

