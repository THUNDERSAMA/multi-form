"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Label } from "@/components/multiform_ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/multiform_ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/multiform_ui/select"
import { Slider } from "@/components/multiform_ui/slider"

export default function CalculatePage() {
  const [packageType, setPackageType] = useState("standard")
  const [weight, setWeight] = useState(1)
  const [fromCountry, setFromCountry] = useState("us")
  const [toCountry, setToCountry] = useState("ca")
  const [deliverySpeed, setDeliverySpeed] = useState("standard")
  const [price, setPrice] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = () => {
    setIsCalculating(true)

    // Simulate API call
    setTimeout(() => {
      // Simple calculation logic
      const baseRate = packageType === "standard" ? 10 : packageType === "express" ? 15 : 20
      const weightRate = weight * 2
      const internationalFee = fromCountry !== toCountry ? 15 : 0
      const speedMultiplier = deliverySpeed === "standard" ? 1 : deliverySpeed === "express" ? 1.5 : 2

      const calculatedPrice = (baseRate + weightRate + internationalFee) * speedMultiplier
      setPrice(Number.parseFloat(calculatedPrice.toFixed(2)))
      setIsCalculating(false)
    }, 1000)
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rate Calculator</h1>
          <p className="mt-4 text-muted-foreground">
            Get an instant quote for your shipment based on weight, dimensions, and destination.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Shipping Rate Calculator
            </CardTitle>
            <CardDescription>Fill in the details below to calculate your shipping rate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="package-type">Package Type</Label>
                <RadioGroup
                  id="package-type"
                  value={packageType}
                  onValueChange={setPackageType}
                  className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                  <div>
                    <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
                    <Label
                      htmlFor="standard"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Standard
                      <span className="mt-1 text-xs text-muted-foreground">Regular packages</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="express" id="express" className="peer sr-only" />
                    <Label
                      htmlFor="express"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Express
                      <span className="mt-1 text-xs text-muted-foreground">Priority handling</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="fragile" id="fragile" className="peer sr-only" />
                    <Label
                      htmlFor="fragile"
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Fragile
                      <span className="mt-1 text-xs text-muted-foreground">Special care</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weight">Weight (kg): {weight}</Label>
                </div>
                <Slider
                  id="weight"
                  min={0.1}
                  max={30}
                  step={0.1}
                  value={[weight]}
                  onValueChange={(value) => setWeight(value[0])}
                  className="py-4"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from-country">From</Label>
                  <Select value={fromCountry} onValueChange={setFromCountry}>
                    <SelectTrigger id="from-country">
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
                <div className="space-y-2">
                  <Label htmlFor="to-country">To</Label>
                  <Select value={toCountry} onValueChange={setToCountry}>
                    <SelectTrigger id="to-country">
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

              <div className="space-y-2">
                <Label htmlFor="delivery-speed">Delivery Speed</Label>
                <Select value={deliverySpeed} onValueChange={setDeliverySpeed}>
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
              {isCalculating ? "Calculating..." : "Calculate Rate"}
            </Button>

            {price !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 w-full rounded-lg border bg-card p-4 text-center"
              >
                <p className="text-sm font-medium">Estimated Shipping Cost</p>
                <p className="text-3xl font-bold text-primary">${price}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  This is an estimate. Final price may vary based on actual dimensions and weight.
                </p>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
