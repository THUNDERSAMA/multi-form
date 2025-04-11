"use client"

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
import MultiStepForm from "@/components/multi-step-form"

// Reusing the booking form from the public site but with admin features
export default function BookCourierPage() {
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Book Courier</h1>
      </div>
      <MultiStepForm />
    </div>
  )
}
