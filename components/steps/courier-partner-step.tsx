"use client"

import type React from "react"

import type { FormData } from "../multi-step-form"

interface CourierPartnerStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

// Sample courier partners data
const courierPartners = [
  { id: "bluedart", name: "Blue Dart", logo: "/placeholder.svg?height=80&width=120" },
  { id: "dhl", name: "DHL", logo: "/placeholder.svg?height=80&width=120" },
  { id: "fedex", name: "FedEx", logo: "/placeholder.svg?height=80&width=120" },
  { id: "dtdc", name: "DTDC", logo: "/placeholder.svg?height=80&width=120" },
  { id: "xpressbees", name: "xpressbees", logo: "/placeholder.svg?height=80&width=120" },
  { id: "dhelivery", name: "dhelivery", logo: "/placeholder.svg?height=80&width=120" },
]

export default function CourierPartnerStep({ formData, updateFormData, nextStep, prevStep }: CourierPartnerStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.courierPartner) {
      nextStep()
    } else {
      alert("Please select a courier partner")
    }
  }

  return (
    <div>
      <h3 className="mb-3">Step 2: Choose Courier Partner</h3>
      <form onSubmit={handleSubmit}>
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          {courierPartners.map((partner) => (
            <div className="col" key={partner.id}>
              <div
                className={`card h-100 ${formData.courierPartner === partner.id ? "border-primary" : ""}`}
                onClick={() => updateFormData({ courierPartner: partner.id })}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    className="mb-3"
                    style={{ maxHeight: "80px" }}
                  />
                  <h5 className="card-title text-center">{partner.name}</h5>
                  {formData.courierPartner === partner.id && (
                    <div className="position-absolute top-0 end-0 p-2">
                      <span className="badge bg-primary rounded-pill">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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

