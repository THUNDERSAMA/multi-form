"use client"

import type React from "react"
import { useState } from "react"
import type { FormData } from "../multi-step-form"
import Invoice from "../ui/invoice"
interface FinishStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  prevStep: () => void
}

export default function FinishStep({ formData, updateFormData, prevStep }: FinishStepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataJson = JSON.stringify(
        formData,
        (key, value) => {
          if (value instanceof File) {
            return {
              name: value.name,
              type: value.type,
              size: value.size,
            }
          }
          return value
        },
        2
      )
      console.log("Form data JSON:", formDataJson)
      setSubmissionStatus({
        success: true,
        message: "Order submitted successfully! Check the console for the JSON data.",
      })
    } catch (error) {
      console.error("Error converting form data to JSON:", error)
      setSubmissionStatus({
        success: false,
        message: "Error submitting order. Please try again.",
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ courierImage: file })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  
    
    // border-t border-dashed
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Step 7: Finish</h3>

      {submissionStatus && (
        <div
          className={`p-4 mb-4 rounded-lg text-sm ${submissionStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {submissionStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">Upload Courier Image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-4 text-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="mx-auto rounded shadow-md max-h-48 object-contain"
              />
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-lg font-semibold text-blue-700 mb-2">Order Summary</h4>
          <div className="space-y-4">
            {/* Basic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-600">Tracking ID</span>
                <p className="text-gray-800 font-mono">{formData.trackingId}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Courier Partner</span>
                <p className="text-gray-800">{formData.courierPartner}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-600">Courier Type</span>
                <p className="text-gray-800">{formData.courierType}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Shipping Method</span>
                <p className="text-gray-800">{formData.shippingMethod}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-600">Payment Method</span>
                <p className="text-gray-800">{formData.paymentMethod}</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-700">From</h5>
                <address className="text-gray-600 text-sm">
                  {formData.fromAddress.name}<br />
                  {formData.fromAddress.address}<br />
                  {formData.fromAddress.city}, {formData.fromAddress.state} - {formData.fromAddress.pincode}<br />
                  Phone: {formData.fromAddress.phone}
                </address>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-700">To</h5>
                <address className="text-gray-600 text-sm">
                  {formData.toAddress.name}<br />
                  {formData.toAddress.address}<br />
                  {formData.toAddress.city}, {formData.toAddress.state} - {formData.toAddress.pincode}<br />
                  Phone: {formData.toAddress.phone}
                </address>
              </div>
            </div>

            {/* Courier Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Weight:</span> {formData.courierDetails.weight} kg</p>
                <p><span className="font-medium">Dimensions:</span> {formData.courierDetails.length} × {formData.courierDetails.width} × {formData.courierDetails.height} cm</p>
              </div>
              <div>
                <p><span className="font-medium">Description:</span> {formData.courierDetails.description || "N/A"}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{formData.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Previous
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Submit Order
          </button>
        </div>

        {submissionStatus?.success && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="text-sm text-blue-700 underline hover:text-blue-900"
              onClick={() => document.getElementById("jsonToggle")?.classList.toggle("hidden")}
            >
              Toggle JSON View
            </button>
            <Invoice formData={formData} />
            {/* <pre id="jsonToggle" className="mt-2 hidden bg-gray-100 p-4 rounded overflow-auto max-h-64 text-xs">
              {JSON.stringify(
                formData,
                (key, value) => (value instanceof File ? { name: value.name, type: value.type, size: value.size } : value),
                2
              )}
            </pre> */}
          </div>

        )}
      </form>
    </div>
  )
}

