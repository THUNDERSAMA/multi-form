"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check, Package } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/multiform_ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/multiform_ui/select"
import { Textarea } from "@/components/multiform_ui/textarea"

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderZip: "",
    senderCountry: "us",

    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",
    recipientCity: "",
    recipientZip: "",
    recipientCountry: "us",

    packageType: "standard",
    weight: "",
    dimensions: "",
    description: "",

    deliverySpeed: "standard",
    insurance: false,
    trackingService: "standard",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
      setTrackingNumber("QC" + Math.floor(Math.random() * 10000000000))
    }, 2000)
  }

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step === i
                    ? "border-primary bg-primary text-primary-foreground"
                    : step > i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground bg-background text-muted-foreground"
                }`}
              >
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              <span className="mt-2 text-xs font-medium">
                {i === 1 ? "Sender" : i === 2 ? "Recipient" : i === 3 ? "Package" : "Options"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted" />
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  const renderSenderForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sender-name">Full Name</Label>
            <Input
              id="sender-name"
              value={formData.senderName}
              onChange={(e) => updateFormData("senderName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email">Email</Label>
            <Input
              id="sender-email"
              type="email"
              value={formData.senderEmail}
              onChange={(e) => updateFormData("senderEmail", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sender-phone">Phone Number</Label>
          <Input
            id="sender-phone"
            value={formData.senderPhone}
            onChange={(e) => updateFormData("senderPhone", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sender-address">Address</Label>
          <Input
            id="sender-address"
            value={formData.senderAddress}
            onChange={(e) => updateFormData("senderAddress", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sender-city">City</Label>
            <Input
              id="sender-city"
              value={formData.senderCity}
              onChange={(e) => updateFormData("senderCity", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-zip">Postal/ZIP Code</Label>
            <Input
              id="sender-zip"
              value={formData.senderZip}
              onChange={(e) => updateFormData("senderZip", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-country">Country</Label>
            <Select value={formData.senderCountry} onValueChange={(value) => updateFormData("senderCountry", value)}>
              <SelectTrigger id="sender-country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  const renderRecipientForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="recipient-name">Full Name</Label>
            <Input
              id="recipient-name"
              value={formData.recipientName}
              onChange={(e) => updateFormData("recipientName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Email</Label>
            <Input
              id="recipient-email"
              type="email"
              value={formData.recipientEmail}
              onChange={(e) => updateFormData("recipientEmail", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient-phone">Phone Number</Label>
          <Input
            id="recipient-phone"
            value={formData.recipientPhone}
            onChange={(e) => updateFormData("recipientPhone", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient-address">Address</Label>
          <Input
            id="recipient-address"
            value={formData.recipientAddress}
            onChange={(e) => updateFormData("recipientAddress", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="recipient-city">City</Label>
            <Input
              id="recipient-city"
              value={formData.recipientCity}
              onChange={(e) => updateFormData("recipientCity", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-zip">Postal/ZIP Code</Label>
            <Input
              id="recipient-zip"
              value={formData.recipientZip}
              onChange={(e) => updateFormData("recipientZip", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-country">Country</Label>
            <Select
              value={formData.recipientCountry}
              onValueChange={(value) => updateFormData("recipientCountry", value)}
            >
              <SelectTrigger id="recipient-country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  const renderPackageForm = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="package-type">Package Type</Label>
          <RadioGroup
            id="package-type"
            value={formData.packageType}
            onValueChange={(value) => updateFormData("packageType", value)}
            className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            <div>
              <RadioGroupItem value="standard" id="pkg-standard" className="peer sr-only" />
              <Label
                htmlFor="pkg-standard"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Standard
                <span className="mt-1 text-xs text-muted-foreground">Regular packages</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="express" id="pkg-express" className="peer sr-only" />
              <Label
                htmlFor="pkg-express"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Express
                <span className="mt-1 text-xs text-muted-foreground">Priority handling</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="fragile" id="pkg-fragile" className="peer sr-only" />
              <Label
                htmlFor="pkg-fragile"
                className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Fragile
                <span className="mt-1 text-xs text-muted-foreground">Special care</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0.1"
              step="0.1"
              value={formData.weight}
              onChange={(e) => updateFormData("weight", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions (L × W × H cm)</Label>
            <Input
              id="dimensions"
              placeholder="e.g., 30 × 20 × 10"
              value={formData.dimensions}
              onChange={(e) => updateFormData("dimensions", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Package Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the contents of your package"
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            rows={3}
          />
        </div>
      </div>
    )
  }

  const renderOptionsForm = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="delivery-speed">Delivery Speed</Label>
          <Select value={formData.deliverySpeed} onValueChange={(value) => updateFormData("deliverySpeed", value)}>
            <SelectTrigger id="delivery-speed">
              <SelectValue placeholder="Select speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (3-5 business days)</SelectItem>
              <SelectItem value="express">Express (1-2 business days)</SelectItem>
              <SelectItem value="priority">Priority (Next day)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tracking-service">Tracking Service</Label>
          <Select value={formData.trackingService} onValueChange={(value) => updateFormData("trackingService", value)}>
            <SelectTrigger id="tracking-service">
              <SelectValue placeholder="Select tracking option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Tracking</SelectItem>
              <SelectItem value="premium">Premium Tracking (Real-time updates)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="insurance"
              checked={formData.insurance as boolean}
              onChange={(e) => updateFormData("insurance", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="insurance">Add Shipping Insurance</Label>
          </div>
          <p className="text-xs text-muted-foreground">Protect your package against loss or damage during transit.</p>
        </div>
      </div>
    )
  }

  const renderConfirmation = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Booking Complete!</h2>
        <p className="mt-2 text-muted-foreground">Your parcel has been booked successfully.</p>
        <div className="mt-6 rounded-lg border bg-card p-4">
          <p className="text-sm font-medium">Tracking Number</p>
          <p className="text-xl font-bold text-primary">{trackingNumber}</p>
          <p className="mt-2 text-xs text-muted-foreground">Use this number to track your package.</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/track">Track Your Parcel</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Book Your Parcel</h1>
          <p className="mt-4 text-muted-foreground">Fill in the details below to book your parcel for delivery.</p>
        </div>

        {isComplete ? (
          renderConfirmation()
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Booking Form
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Enter sender information"
                  : step === 2
                    ? "Enter recipient information"
                    : step === 3
                      ? "Enter package details"
                      : "Choose delivery options"}
              </CardDescription>
              {renderStepIndicator()}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && renderSenderForm()}
                {step === 2 && renderRecipientForm()}
                {step === 3 && renderPackageForm()}
                {step === 4 && renderOptionsForm()}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <div className={step > 1 ? "w-full sm:w-auto" : "w-full"}>
                {step < 4 ? (
                  <Button type="button" onClick={handleNext} className="w-full">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Processing..." : "Complete Booking"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
