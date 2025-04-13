"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

interface CourierData {
  id: string
  customerName: string
  pickupAddress: string
  deliveryAddress: string
  packageType: string
  date: string
  time: string
  price: string
}

interface GeneratePODModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courier: CourierData | null
}

export default function GeneratePODModal({ open, onOpenChange, courier }: GeneratePODModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!open || !courier) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Setup canvas size
    canvas.width = 800
    canvas.height = 1000

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, 120)
    ctx.fillStyle = "#fff"
    ctx.font = "bold 36px Arial"
    ctx.fillText("FutureCourier", 40, 70)
    ctx.font = "20px Arial"
    ctx.fillText("Proof of Delivery", 40, 100)

    // Date
    ctx.textAlign = "right"
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width - 40, 70)
    ctx.textAlign = "left"

    // Divider
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 160)
    ctx.lineTo(canvas.width - 40, 160)
    ctx.stroke()

    // Parcel info
    ctx.fillStyle = "#000"
    ctx.font = "bold 24px Arial"
    ctx.fillText("Parcel Information", 40, 200)
    ctx.font = "18px Arial"
    ctx.fillText(`Tracking ID: ${courier.id}`, 40, 240)
    ctx.fillText(`Type: ${courier.packageType}`, 40, 270)
    ctx.fillText(`Price: ₹${courier.price}`, 40, 300)

    // Sender
    ctx.font = "bold 24px Arial"
    ctx.fillText("Sender", 40, 360)
    ctx.font = "18px Arial"
    ctx.fillText(`Name: ${courier.customerName}`, 40, 400)
    ctx.fillText(`Pickup Address: ${courier.pickupAddress}`, 40, 430)

    // Recipient
    ctx.font = "bold 24px Arial"
    ctx.fillText("Recipient", 40, 500)
    ctx.font = "18px Arial"
    ctx.fillText(`Delivery Address: ${courier.deliveryAddress}`, 40, 540)
    ctx.fillText(`Date: ${courier.date}`, 40, 570)
    ctx.fillText(`Time: ${courier.time}`, 40, 600)

    // Signature box
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(40, 650, 400, 150)
    ctx.stroke()
    ctx.font = "bold 18px Arial"
    ctx.fillText("Recipient Signature:", 40, 640)

    // Footer
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80)
    ctx.fillStyle = "#000"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText(
      "This document serves as proof of delivery for the specified parcel.",
      canvas.width / 2,
      canvas.height - 40
    )
    ctx.textAlign = "left"

    // Barcode (using a secondary canvas to avoid async loading)
    const barcodeCanvas = document.createElement("canvas")
    JsBarcode(barcodeCanvas, courier.id, { format: "CODE128", displayValue: false })
    ctx.drawImage(barcodeCanvas, 500, 240, 250, 60)
  }, [open, courier])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !courier) return
    const link = document.createElement("a")
    link.download = `POD_${courier.id}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Proof of Delivery</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="border rounded shadow-lg max-w-full"
            style={{ backgroundColor: "#fff" }} // Helps during debug
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleDownload}>Download POD</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
