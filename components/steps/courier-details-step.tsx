"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { FormData } from "../multi-step-form"

interface CourierDetailsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function CourierDetailsStep({ formData, updateFormData, nextStep, prevStep }: CourierDetailsStepProps) {
  const [multiCouriers, setMultiCouriers] = useState(formData.multipleCouriers || [])
  const trackingIdGenerated = useRef(false)

  // Generate tracking ID only once when component mounts or when critical dependencies change
  useEffect(() => {
    // Only generate tracking ID if it hasn't been generated yet and we have the necessary data
    if (!trackingIdGenerated.current && formData.courierPartner && formData.toAddress.name && !formData.trackingId) {
      const courierPrefix = formData.courierPartner.substring(0, 3).toUpperCase()
      const recipientName = formData.toAddress.name.replace(/[^a-zA-Z0-9]/g, "")
      const timestamp = new Date().getTime().toString().substring(5)
      const date = new Date().toISOString().split("T")[0].replace(/-/g, "")

      const trackingId = `${courierPrefix}${recipientName}${date}${timestamp}`

      updateFormData({ trackingId })
      trackingIdGenerated.current = true
    }
  }, [formData.courierPartner, formData.toAddress.name, formData.trackingId, updateFormData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.courierType === "document" && formData.isConstantField) {
      updateFormData({ multipleCouriers: multiCouriers })
    }

    nextStep()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({
      courierDetails: {
        ...formData.courierDetails,
        [name]: value,
      },
    })
  }

  const handleConstantFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      updateFormData({
        isConstantField: (e.target as HTMLInputElement).checked,
      })
    } else {
      updateFormData({ constantField: value })
    }
  }

  const addCourier = () => {
    const newCourier = {
      weight: "",
      length: "",
      width: "",
      height: "",
      description: "",
    }
    setMultiCouriers([...multiCouriers, newCourier])
  }

  const updateCourier = (index: number, field: string, value: string) => {
    const updatedCouriers = [...multiCouriers]
    updatedCouriers[index] = {
      ...updatedCouriers[index],
      [field]: value,
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

        {formData.courierType === "document" && (
          <div className="mb-4 p-3 border rounded">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="isConstantField"
                name="isConstantField"
                checked={formData.isConstantField}
                onChange={handleConstantFieldChange}
              />
              <label className="form-check-label" htmlFor="isConstantField">
                Set a field as constant for multiple couriers
              </label>
            </div>

            {formData.isConstantField && (
              <>
                <div className="mb-3">
                  <label htmlFor="constantField" className="form-label">
                    Select constant field
                  </label>
                  <select
                    className="form-select"
                    id="constantField"
                    name="constantField"
                    value={formData.constantField}
                    onChange={handleConstantFieldChange}
                  >
                    <option value="">Select a field</option>
                    <option value="weight">Weight</option>
                    <option value="dimensions">Dimensions</option>
                    <option value="description">Description</option>
                  </select>
                </div>

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
                          <div className="row g-3">
                            {formData.constantField !== "weight" && (
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

                            {formData.constantField !== "dimensions" && (
                              <>
                                <div className="col-md-4">
                                  <label className="form-label">Length (cm)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={courier.length}
                                    onChange={(e) => updateCourier(index, "length", e.target.value)}
                                    min="0"
                                    required
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Width (cm)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={courier.width}
                                    onChange={(e) => updateCourier(index, "width", e.target.value)}
                                    min="0"
                                    required
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label">Height (cm)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={courier.height}
                                    onChange={(e) => updateCourier(index, "height", e.target.value)}
                                    min="0"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            {formData.constantField !== "description" && (
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

        {(!formData.isConstantField || formData.courierType === "parcel") && (
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

