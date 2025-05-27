"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Search } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"

interface TrackingResult {
  id: string
  status: "in-transit" | "delivered" | "processing" | "out-for-delivery"
  location: string
  history: {
    date: string
    status: string
    location: string
  }[]
}

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  function getCurrentDateTime(timestamp: string) {
    const date = new Date(timestamp.replace(" ", "T"));
const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};
const formattedDate = date.toLocaleString("en-US", options).replace(",", " -");
    return formattedDate;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setIsLoading(true)

    // Simulate API call
    
      if (trackingNumber.length > 14) {
        //fetch parcel details from api
        const response = await fetch("/api/getbyId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId: trackingNumber }),
        })
        
        const data = await response.json()
        //console.log("DATA:", data)
        //console.log("DATA:", data.data)
       // console.log("DATA:", data.data.data)
       // console.log("DATA:", data.data.data.pincode)
        console.log("DATA:", data.data.id)
        
        const datas= data.data.data;
      if (data.data.delivered==1)
      {
         setResult({
          id: trackingNumber,
          status: data.data.delivered==0?"in-transit":"delivered",
          location: datas.fromAddress.address,
          
          history: [
            {
              date: getCurrentDateTime(data.data.dtime),
              status: "In Transit",
              location: "kolkata, West Bengal",
            },
            
            {
              date: getCurrentDateTime(data.data.data_time_delv),
              status: "Package delivered",
              location: datas.toAddress.address,
            },
          ],
        })
      }
      else{
          setResult({
          id: trackingNumber,
          status: data.data.delivered==0?"in-transit":"delivered",
          location: datas.fromAddress.address,
          
          history: [
            {
              date: getCurrentDateTime(data.data.dtime),
              status: "In Transit",
              location: "kolkata, West Bengal",
            },
            
            
          ],
        })
      }
      } 
      else if (trackingNumber.length < 14) {
         //decode the tracking id
         const deoderesponse = await fetch("/api/decode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: trackingNumber }),
        })
        const deodeddata = await deoderesponse.json()
        console.log("DATA:", deodeddata.decoded);
         const decodedId = deodeddata.decoded;
        const response = await fetch("/api/getbyId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackingId: decodedId }),
        })
        
        const data = await response.json();
         console.log("DATA:", data.data.id)
       
        const datas= data.data.data;
      
          if (data.data.delivered==1)
      {
         setResult({
          id: trackingNumber,
          status: data.data.delivered==0?"in-transit":"delivered",
          location: datas.fromAddress.address,
          
          history: [
            {
              date: getCurrentDateTime(data.data.dtime),
              status: "In Transit",
              location: "kolkata, West Bengal",
            },
            
            {
              date: getCurrentDateTime(data.data.data_time_delv),
              status: "Package delivered",
              location: datas.toAddress.address,
            },
          ],
        })
      }
      else{
          setResult({
          id: trackingNumber,
          status: data.data.delivered==0?"in-transit":"delivered",
          location: datas.fromAddress.address,
          
          history: [
            {
              date: getCurrentDateTime(data.data.dtime),
              status: "In Transit",
              location: "kolkata, West Bengal",
            },
            
            
          ],
        })
      }
      } 
      else {
        setError("No parcel found with this tracking ID")
        setResult(null)
      }
       
      
      setIsLoading(false)
    
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "text-blue-500"
      case "delivered":
        return "text-green-500"
      case "processing":
        return "text-yellow-500"
      case "out-for-delivery":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Track Your Parcel</h1>
          <p className="mt-4 text-muted-foreground">
            Enter your tracking number to get real-time updates on your delivery.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Package Tracker</CardTitle>
            <CardDescription>Enter the tracking number provided in your confirmation email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking-number"
                    placeholder="e.g., QC1234567890"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Searching..."
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Track
                      </>
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">Try using "QC1234567890" for a demo result</p>
              </div>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-6"
              >
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Tracking ID: {result.id}</h3>
                      <p className={`text-sm ${getStatusColor(result.status)}`}>
                        Status: {result.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">{result.location}</p>
                    </div>
                   
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">Tracking History</h3>
                  <div className="space-y-4">
                    {result.history.map((item, index) => (
                      <div key={index} className="relative pl-6">
                        {index !== result.history.length - 1 && (
                          <div className="absolute left-[0.6rem] top-[1.6rem] h-full w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.date}</p>
                          <p className="text-sm">{item.status}</p>
                          <p className="text-sm text-muted-foreground">{item.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
