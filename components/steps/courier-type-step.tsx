"use client"

import type React from "react"

import type { FormData } from "../multi-step-form"

interface CourierTypeStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function CourierTypeStep({ formData, updateFormData, nextStep, prevStep }: CourierTypeStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div>
      <h3 className="mb-3">Step 3: Choose Courier Type</h3>
      <form onSubmit={handleSubmit}>
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          <div className="col">
            <div
              className={`card h-100 ${formData.courierType === "parcel" ? "border-primary" : ""}`}
              onClick={() => updateFormData({ courierType: "parcel" })}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-box-seam fs-1"></i>
                </div>
                <h5 className="card-title">Parcel</h5>
                <p className="card-text">Send packages, goods, or physical items</p>
                {formData.courierType === "parcel" && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary rounded-pill">
                      <i className="bi bi-check-lg"></i>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col">
            <div
              className={`card h-100 ${formData.courierType === "document" ? "border-primary" : ""}`}
              onClick={() => updateFormData({ courierType: "document" })}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-file-earmark-text fs-1"></i>
                </div>
                <h5 className="card-title">Document</h5>
                <p className="card-text">Send letters, documents, or paperwork</p>
                {formData.courierType === "document" && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary rounded-pill">
                      <i className="bi bi-check-lg"></i>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
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

