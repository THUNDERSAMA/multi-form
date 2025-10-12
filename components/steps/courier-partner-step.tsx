"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { FormData } from "../multi-step-form"
import { useEffect, useState } from "react"

interface CourierPartnerStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}
const courierPartners = [
  { id: "xpressbees", name: "Xpressbees", logo: "/xpressbees.avif?height=80&width=120" },
  { id: "dhelivery", name: "Dhelivery", logo: "/Delhivery.jpg?height=80&width=120" },
  { id: "dtdc", name: "Dtdc", logo: "/dtdc.jpg?height=80&width=120" },
  { id: "elegant_courier", name: "Elegant_courier", logo: "/elegant.jpg?height=80&width=120" },
  { id: "elegant_enterprise", name: "Elegant_enterprise", logo: "/enterprise.png?height=80&width=120" },
]

// Sample courier partners data

//get courier partners from API which give service to pincode

export default function CourierPartnerStep({ formData, updateFormData, nextStep, prevStep }: CourierPartnerStepProps) {
  const [courierPartnersData,setCourierPartners] = useState(courierPartners || [])
  useEffect(() => {
    const getCourierPartners = async () => {
      try {
        const response = await fetch("/api/courier-partners"
        , {
         method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pincode: formData.pincode ,type: formData.shippingMethod||"surface" }),
        })
        
        const data = await response.json()
        console.log("DATA:", data.data);
        //const filteredPartners = courierPartnersData.filter((courierPartnersData) => JSON.parse(data.data).includes(courierPartnersData.name));
        //console.log("Filtered Partners:", filteredPartners)
        setCourierPartners(data.data)
      } catch (error) {
        console.error("Error fetching courier partners:", error)
      }
    }
    getCourierPartners()
  }
    , [])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.courierPartner) {
      nextStep()
    } else {
      alert("Please select a courier partner")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Choose Courier Partner</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {courierPartnersData.map((partner) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={partner.id}
              className={`bg-white dark:bg-white/10 dark:backdrop-blur-lg  dark:border-white/20 dark:text-gray-100 rounded-xl p-6 shadow-sm cursor-pointer transition-all duration-200 ${
                formData.courierPartner === partner.id
                  ? "border-spacing-2 border-4 border-indigo-500 shadow-md"
                  : "border border-gray-200 hover:shadow-md"
              }`}
              onClick={() => updateFormData({ courierPartner: partner.id })}
            >
              <div className="flex flex-col items-center justify-center">
                <img src={partner.logo || "/placeholder.svg"} alt={partner.name} className="mb-4 h-16 object-contain" />
                <h5 className="font-medium text-gray-800 dark:text-gray-100">{partner.name}</h5>
                {formData.courierPartner === partner.id && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-500 text-white rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
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

