"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
    <div>
      <h3 className="mb-3">Step 5: Courier Details</h3>
      <form onSubmit={handleSubmit}>
        {/* Tracking ID Field */}
        <div className="mb-4">
          <label htmlFor="trackingId" className="form-label">
            Tracking ID
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="trackingId"
              value={formData.trackingId}
              readOnly
              aria-describedby="trackingIdHelp"
            />
            <span className="input-group-text">
              <i className="bi bi-lock-fill"></i>
            </span>
          </div>
          <div id="trackingIdHelp" className="form-text">
            This unique tracking ID is automatically generated and cannot be edited.
          </div>
        </div>

        {/* New Courier Detail Fields */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label htmlFor="totalAmount" className="form-label">
              Total Amount (₹)
            </label>
            <input
              type="number"
              className="form-control"
              id="totalAmount"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="shippingMethod" className="form-label">
              Shipping Method
            </label>
            <select
              className="form-select"
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
          <div className="col-md-4">
            <label htmlFor="paymentMethod" className="form-label">
              Payment Method
            </label>
            <select
              className="form-select"
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="prepaid">Prepaid</option>
            </select>
          </div>
        </div>

        {formData.courierType === "document" && (
          <div className="mb-4 p-3 border rounded">
            <div className="mb-3">
              <h5>Select Constant Fields</h5>
              <p className="form-text">Select fields that will remain constant across multiple couriers</p>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="constantWeight"
                  value="weight"
                  checked={formData.constantFields.includes("weight")}
                  onChange={handleConstantFieldChange}
                />
                <label className="form-check-label" htmlFor="constantWeight">
                  Weight
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="constantDimensions"
                  value="dimensions"
                  checked={formData.constantFields.includes("dimensions")}
                  onChange={handleConstantFieldChange}
                />
                <label className="form-check-label" htmlFor="constantDimensions">
                  Dimensions
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="constantDescription"
                  value="description"
                  checked={formData.constantFields.includes("description")}
                  onChange={handleConstantFieldChange}
                />
                <label className="form-check-label" htmlFor="constantDescription">
                  Description
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="constantShippingMethod"
                  value="shippingMethod"
                  checked={formData.constantFields.includes("shippingMethod")}
                  onChange={handleConstantFieldChange}
                />
                <label className="form-check-label" htmlFor="constantShippingMethod">
                  Shipping Method
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="constantPaymentMethod"
                  value="paymentMethod"
                  checked={formData.constantFields.includes("paymentMethod")}
                  onChange={handleConstantFieldChange}
                />
                <label className="form-check-label" htmlFor="constantPaymentMethod">
                  Payment Method
                </label>
              </div>
            </div>

            {formData.constantFields.length > 0 && (
              <>
                <div className="mb-3">
                  <button type="button" className="btn btn-outline-primary" onClick={addCourier}>
                    <i className="bi bi-plus-circle me-2"></i>Add Another Courier
                  </button>
                </div>

                {multiCouriers.length > 0 && (
                  <div className="mb-3">
                    <h5>Multiple Couriers</h5>
                    {multiCouriers.map((courier, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <span>Courier #{index + 1}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeCourier(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        <div className="card-body">
                          {/* Tracking ID for this courier */}
                          <div className="mb-3">
                            <label className="form-label">Tracking ID</label>
                            <input type="text" className="form-control" value={courier.trackingId} readOnly />
                          </div>

                          {/* To Address for this courier */}
                          <div className="mb-3">
                            <h6>Recipient Address</h6>
                            <div className="row g-2">
                              <div className="col-md-6">
                                <label className="form-label">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={courier.toAddress.name}
                                  onChange={(e) => updateCourierAddress(index, "name", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Phone</label>
                                <input
                                  type="tel"
                                  className="form-control"
                                  value={courier.toAddress.phone}
                                  onChange={(e) => updateCourierAddress(index, "phone", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label">Address</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={courier.toAddress.address}
                                  onChange={(e) => updateCourierAddress(index, "address", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">City</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={courier.toAddress.city}
                                  onChange={(e) => updateCourierAddress(index, "city", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">State</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={courier.toAddress.state}
                                  onChange={(e) => updateCourierAddress(index, "state", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Pincode</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={courier.toAddress.pincode}
                                  onChange={(e) => updateCourierAddress(index, "pincode", e.target.value)}
                                  required
                                  pattern="[0-9]{6}"
                                  maxLength={6}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            {!formData.constantFields.includes("weight") && (
                              <div className="col-md-6">
                                <label className="form-label">Weight (kg)</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={courier.weight}
                                  onChange={(e) => updateCourier(index, "weight", e.target.value)}
                                  step="0.01"
                                  min="0"
                                  required
                                />
                              </div>
                            )}

                            {!formData.constantFields.includes("dimensions") && (
                              <div className="col-md-6">
                                <label className="form-label">Dimensions (cm)</label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="L"
                                    value={courier.length}
                                    onChange={(e) => updateCourier(index, "length", e.target.value)}
                                    min="0"
                                    required
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="W"
                                    value={courier.width}
                                    onChange={(e) => updateCourier(index, "width", e.target.value)}
                                    min="0"
                                    required
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="H"
                                    value={courier.height}
                                    onChange={(e) => updateCourier(index, "height", e.target.value)}
                                    min="0"
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            {!formData.constantFields.includes("description") && (
                              <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea
                                  className="form-control"
                                  value={courier.description}
                                  onChange={(e) => updateCourier(index, "description", e.target.value)}
                                  rows={2}
                                ></textarea>
                              </div>
                            )}

                            <div className="col-md-4">
                              <label className="form-label">Total Amount (₹)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={courier.totalAmount}
                                onChange={(e) => updateCourier(index, "totalAmount", e.target.value)}
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>

                            {!formData.constantFields.includes("shippingMethod") && (
                              <div className="col-md-4">
                                <label className="form-label">Shipping Method</label>
                                <select
                                  className="form-select"
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
                              <div className="col-md-4">
                                <label className="form-label">Payment Method</label>
                                <select
                                  className="form-select"
                                  value={courier.paymentMethod}
                                  onChange={(e) =>
                                    updateCourier(index, "paymentMethod", e.target.value as "cod" | "prepaid")
                                  }
                                  required
                                >
                                  <option value="cod">COD</option>
                                  <option value="prepaid">Prepaid</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {(formData.constantFields.length === 0 || formData.courierType === "parcel") && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="weight" className="form-label">
                Weight (kg)
              </label>
              <input
                type="number"
                className="form-control"
                id="weight"
                name="weight"
                value={formData.courierDetails.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="dimensions" className="form-label">
                Dimensions (cm)
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
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
                  className="form-control"
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
                  className="form-control"
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
            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.courierDetails.description}
                onChange={handleChange}
                rows={3}
              ></textarea>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" onClick={prevStep}>
            Previous
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

