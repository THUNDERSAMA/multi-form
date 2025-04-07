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
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Convert form data to JSON
      const formDataJson = JSON.stringify(
        formData,
        (key, value) => {
          // Handle File objects which can't be serialized to JSON
          if (value instanceof File) {
            return {
              name: value.name,
              type: value.type,
              size: value.size,
            }
          }
          return value
        },
        2,
      )

      // Log the JSON data to console
      console.log("Form data JSON:", formDataJson)

      // Display success message
      setSubmissionStatus({
        success: true,
        message: "Order submitted successfully! Check the console for the JSON data.",
      })

      // You would typically send this data to your backend here
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

      {submissionStatus && (
        <div className={`alert ${submissionStatus.success ? "alert-success" : "alert-danger"} mb-4`} role="alert">
          {submissionStatus.message}
        </div>
      )}

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
            {formData.constantFields.length > 0 && formData.multipleCouriers.length > 0 ? (
              <>
                <h6 className="mb-3">Multiple Couriers ({formData.multipleCouriers.length})</h6>
                <div className="mb-3">
                  <h6>Constant Fields</h6>
                  <ul className="list-group mb-3">
                    {formData.constantFields.includes("weight") && (
                      <li className="list-group-item">Weight: {formData.courierDetails.weight} kg</li>
                    )}
                    {formData.constantFields.includes("dimensions") && (
                      <li className="list-group-item">
                        Dimensions: {formData.courierDetails.length} × {formData.courierDetails.width} ×{" "}
                        {formData.courierDetails.height} cm
                      </li>
                    )}
                    {formData.constantFields.includes("description") && (
                      <li className="list-group-item">Description: {formData.courierDetails.description || "N/A"}</li>
                    )}
                    {formData.constantFields.includes("shippingMethod") && (
                      <li className="list-group-item">
                        Shipping Method: {formData.shippingMethod === "surface" ? "Surface" : "Express"}
                      </li>
                    )}
                    {formData.constantFields.includes("paymentMethod") && (
                      <li className="list-group-item">
                        Payment Method: {formData.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid"}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="accordion" id="couriersAccordion">
                  {formData.multipleCouriers.map((courier, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#courier${index}`}
                        >
                          Courier #{index + 1} - {courier.toAddress.name}
                        </button>
                      </h2>
                      <div
                        id={`courier${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#couriersAccordion"
                      >
                        <div className="accordion-body">
                          <div className="mb-2">
                            <strong>Tracking ID:</strong> <span className="font-monospace">{courier.trackingId}</span>
                          </div>
                          <div className="mb-2">
                            <strong>To Address:</strong>
                            <address className="mb-0">
                              {courier.toAddress.name}
                              <br />
                              {courier.toAddress.address}
                              <br />
                              {courier.toAddress.city}, {courier.toAddress.state} - {courier.toAddress.pincode}
                              <br />
                              Phone: {courier.toAddress.phone}
                            </address>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              {!formData.constantFields.includes("weight") && (
                                <div>
                                  <strong>Weight:</strong> {courier.weight} kg
                                </div>
                              )}
                              {!formData.constantFields.includes("dimensions") && (
                                <div>
                                  <strong>Dimensions:</strong> {courier.length} × {courier.width} × {courier.height} cm
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              {!formData.constantFields.includes("description") && (
                                <div>
                                  <strong>Description:</strong> {courier.description || "N/A"}
                                </div>
                              )}
                              <div>
                                <strong>Total Amount:</strong> ₹{courier.totalAmount}
                              </div>
                              {!formData.constantFields.includes("shippingMethod") && (
                                <div>
                                  <strong>Shipping Method:</strong>{" "}
                                  {courier.shippingMethod === "surface" ? "Surface" : "Express"}
                                </div>
                              )}
                              {!formData.constantFields.includes("paymentMethod") && (
                                <div>
                                  <strong>Payment Method:</strong>{" "}
                                  {courier.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
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
                  <div className="col-md-4">
                    <h6>Courier Type</h6>
                    <p>{formData.courierType === "parcel" ? "Parcel" : "Document"}</p>
                  </div>
                  <div className="col-md-4">
                    <h6>Shipping Method</h6>
                    <p>{formData.shippingMethod === "surface" ? "Surface" : "Express"}</p>
                  </div>
                  <div className="col-md-4">
                    <h6>Payment Method</h6>
                    <p>{formData.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid"}</p>
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
                      <p>Total Amount: ₹{formData.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
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

      {/* Add a hidden pre element to display the JSON for debugging purposes */}
      {submissionStatus?.success && (
        <div className="mt-4">
          <button
            className="btn btn-outline-secondary mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#jsonData"
            aria-expanded="false"
            aria-controls="jsonData"
          >
            Show JSON Data
          </button>
          <div className="collapse" id="jsonData">
            <div className="card card-body">
              <pre className="mb-0" style={{ maxHeight: "300px", overflow: "auto" }}>
                {JSON.stringify(
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
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

