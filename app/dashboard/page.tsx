"use client"
import Cookies from 'js-cookie'
import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, BarChart3, Box, Clock, FileOutput, Package, PackageCheck, Truck, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/multiform_ui/tabs"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// Mock data for charts
const dailyDeliveries = [18, 25, 32, 28, 36, 30, 42]
const weeklyDeliveries = [145, 132, 164, 187, 203, 178, 196]
const monthlyDeliveries = [580, 620, 750, 690, 730, 810, 860]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  

  useEffect(() => {
    setMounted(true)

    // Set up canvas for chart
    const setupChart = () => {
      const canvas = document.getElementById("deliveries-chart") as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw chart based on active tab
      const activeTab =
        document.querySelector('[data-state="active"][role="tab"]')?.getAttribute("data-value") || "daily"
      const data =
        activeTab === "daily" ? dailyDeliveries : activeTab === "weekly" ? weeklyDeliveries : monthlyDeliveries

      // Chart dimensions
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // Find max value for scaling
      const maxValue = Math.max(...data)

      // Draw axes
      ctx.beginPath()
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1

      // X-axis
      ctx.moveTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)

      // Y-axis
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.stroke()

      // Draw data points and lines
      ctx.beginPath()
      ctx.strokeStyle = "hsl(270, 76%, 58%)"
      ctx.lineWidth = 2

      // Calculate bar width
      const barWidth = chartWidth / data.length - 10

      // Draw bars
      data.forEach((value, index) => {
        const x = padding + index * (chartWidth / (data.length - 1))
        const barHeight = (value / maxValue) * chartHeight
        const y = canvas.height - padding - barHeight

        // Draw bar
        ctx.fillStyle = "hsl(270, 76%, 58%)"
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)

        // Draw value above bar
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(value.toString(), x, y - 10)

        // Draw day/week/month label
        const labels =
          activeTab === "daily"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : activeTab === "weekly"
              ? ["W1", "W2", "W3", "W4", "W5", "W6", "W7"]
              : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

        ctx.fillText(labels[index], x, canvas.height - padding + 20)
      })
    }

    setupChart()

    // Add event listener for tab changes
    const tabsList = document.querySelector('[role="tabslist"]')
    if (tabsList) {
      tabsList.addEventListener("click", setupChart)
    }

    // Cleanup
    return () => {
      const tabsList = document.querySelector('[role="tabslist"]')
      if (tabsList) {
        tabsList.removeEventListener("click", setupChart)
      }
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: </span>
          <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[75%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">267</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <ArrowUp className="h-3 w-3" />
              <span>8% increase</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[45%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center gap-1 text-xs text-red-500">
              <ArrowDown className="h-3 w-3" />
              <span>3% decrease</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[60%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,249</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <ArrowUp className="h-3 w-3" />
              <span>15% increase</span>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[85%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Delivery Statistics</CardTitle>
            <CardDescription>Overview of delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="daily" className="space-y-4">
                <div className="h-[300px] w-full">
                  <canvas id="deliveries-chart" width="600" height="300"></canvas>
                </div>
              </TabsContent>
              <TabsContent value="weekly" className="space-y-4">
                <div className="h-[300px] w-full">
                  <canvas id="deliveries-chart" width="600" height="300"></canvas>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="space-y-4">
                <div className="h-[300px] w-full">
                  <canvas id="deliveries-chart" width="600" height="300"></canvas>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>On-time delivery metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">On-Time Delivery</span>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Package Integrity</span>
                  </div>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[98%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[87%] rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Delivery Efficiency</span>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[78%] rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/couriers" className="flex items-center p-3 rounded-lg hover:bg-gray-100">
              <Package className="mr-2 h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Manage Couriers</div>
                <div className="text-sm text-muted-foreground">View, confirm, or cancel courier bookings</div>
              </div>
            </Link>
            <Link href="/dashboard/bulk-pod" className="flex items-center p-3 rounded-lg hover:bg-gray-100">
              <FileOutput className="mr-2 h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Generate Bulk PODs</div>
                <div className="text-sm text-muted-foreground">Create multiple proof of delivery documents</div>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Last 5 completed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "QC7823456", customer: "John Smith", status: "Delivered", time: "Today, 10:23 AM" },
                { id: "QC7823455", customer: "Emma Johnson", status: "Delivered", time: "Today, 09:45 AM" },
                { id: "QC7823454", customer: "Michael Brown", status: "Delivered", time: "Today, 08:30 AM" },
                { id: "QC7823453", customer: "Sophia Williams", status: "Delivered", time: "Yesterday, 04:15 PM" },
                { id: "QC7823452", customer: "James Davis", status: "Delivered", time: "Yesterday, 02:50 PM" },
              ].map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{delivery.id}</p>
                    <p className="text-xs text-muted-foreground">{delivery.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-green-500">{delivery.status}</p>
                    <p className="text-xs text-muted-foreground">{delivery.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
            <CardDescription>Most frequent delivery locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { city: "New York", country: "United States", count: 342 },
                { city: "Los Angeles", country: "United States", count: 265 },
                { city: "London", country: "United Kingdom", count: 198 },
                { city: "Toronto", country: "Canada", count: 176 },
                { city: "Sydney", country: "Australia", count: 143 },
              ].map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{location.city}</p>
                    <p className="text-xs text-muted-foreground">{location.country}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-medium text-primary">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
