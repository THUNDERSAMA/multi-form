"use client"
import MultiStepForm from "@/components/multi-step-form"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Courier Service</h1>
      <MultiStepForm />
    </main>
  )
}

