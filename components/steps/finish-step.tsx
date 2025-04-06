"use client"

import type React from "react"

import { useState } from "react"
import type { FormData } from "../multi-step-form"

interface FinishStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  prevStep: () => void
}

export default function FinishStep({ formData, updateFormData, prevStep }: FinishStepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit the form data to your backend
    alert("Form submitted successfully!")
    console.log("Form data:", formData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ courierImage: file })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <h3 className="mb-3">Step 7: Finish</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h5>Upload Courier Image</h5>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              id="courierImage"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <div className="form-text">Please upload a clear image of your parcel/document</div>
          </div>

          {imagePreview && (
            <div className="text-center mb-3">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Courier preview"
                className="img-thumbnail"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Order Summary</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Tracking ID</h6>
                <p className="font-monospace">{formData.trackingId}</p>
              </div>
              <div className="col-md-6">
                <h6>Courier Partner</h6>
                <p>{formData.courierPartner}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>Courier Type</h6>
                <p>{formData.courierType === "parcel" ? "Parcel" : "Document"}</p>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <h6>From</h6>
                <address>
                  {formData.fromAddress.name}
                  <br />
                  {formData.fromAddress.address}
                  <br />
                  {formData.fromAddress.city}, {formData.fromAddress.state} - {formData.fromAddress.pincode}
                  <br />
                  Phone: {formData.fromAddress.phone}
                </address>
              </div>
              <div className="col-md-6">
                <h6>To</h6>
                <address>
                  {formData.toAddress.name}
                  <br />
                  {formData.toAddress.address}
                  <br />
                  {formData.toAddress.city}, {formData.toAddress.state} - {formData.toAddress.pincode}
                  <br />
                  Phone: {formData.toAddress.phone}
                </address>
              </div>
            </div>

            <div className="mb-3">
              <h6>Courier Details</h6>
              {formData.isConstantField && formData.multipleCouriers.length > 0 ? (
                <div>
                  <p>Multiple couriers: {formData.multipleCouriers.length}</p>
                  <p>Constant field: {formData.constantField}</p>
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <p>Weight: {formData.courierDetails.weight} kg</p>
                    <p>
                      Dimensions: {formData.courierDetails.length} × {formData.courierDetails.width} ×{" "}
                      {formData.courierDetails.height} cm
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>Description: {formData.courierDetails.description || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            Previous
          </button>
          <button type="submit" className="btn btn-success">
            Submit Order
          </button>
        </div>
      </form>
    </div>
  )
}

