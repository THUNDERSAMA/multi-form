"use client"

import type React from "react"

import type { FormData } from "../multi-step-form"

interface ToAddressStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function ToAddressStep({ formData, updateFormData, nextStep, prevStep }: ToAddressStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateFormData({
      toAddress: {
        ...formData.toAddress,
        [name]: value,
      },
    })
  }

  return (
    <div>
      <h3 className="mb-3">Step 4: Recipient Address</h3>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.toAddress.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.toAddress.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={formData.toAddress.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="state"
              name="state"
              value={formData.toAddress.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="pincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="pincode"
              name="pincode"
              value={formData.toAddress.pincode}
              onChange={handleChange}
              required
              pattern="[0-9]{6}"
              maxLength={6}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.toAddress.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
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

