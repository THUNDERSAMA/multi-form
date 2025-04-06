"use client"

import type React from "react"

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
    <div>
      <h3 className="mb-3">Step 1: Enter Pincode</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="pincode" className="form-label">
            Pincode
          </label>
          <input
            type="text"
            className="form-control"
            id="pincode"
            value={formData.pincode}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            required
            pattern="[0-9]{6}"
            maxLength={6}
          />
          <div className="form-text">Please enter a valid 6-digit pincode</div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  )
}

