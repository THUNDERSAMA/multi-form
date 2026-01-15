"use client"
import Cookies from 'js-cookie'
import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, BarChart3, Box, Clock, FileOutput, Package, PackageCheck, Truck, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/multiform_ui/tabs"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PodData {
  available: number
  lastUpdated: string
  totalIssued: number
  totalReturned: number
}

interface DashboardStats {
  recentDeliveries: Array<{
    trackingId: string
    customerName: string
    destination: string
    city: string
    amount: string
    deliveredAt: string
    courierPartner: string
  }>
  topDestinations: Array<{
    location: string
    count: number
  }>
  totalDeliveries: {
    total: number
    currentMonth: number
    previousMonth: number
    percentageChange: number
  }
  activeShipments: {
    total: number
    currentMonth: number
    previousMonth: number
    percentageChange: number
  }
  todayBookings: {
    today: number
    yesterday: number
    percentageChange: number
  }
  dailyDeliveries: number[]
  weeklyDeliveries: number[]
  monthlyDeliveries: number[]
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [podData, setPodData] = useState<PodData | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Fetch dashboard stats
    async function fetchDashboardStats() {
      try {
        const response = await fetch("/api/dashboard?action=getDashboardStats")
        const data = await response.json()
        
        if (data.success) {
          setDashboardStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch POD data
    async function fetchPodData() {
      try {
        const response = await fetch("/api/pod", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch POD data")
        }

        const data = await response.json()
        setPodData(data.data)
      } catch (error) {
        console.error("Error fetching POD data:", error)
      }
    }
    
    fetchDashboardStats()
    fetchPodData()
  }, [])

  useEffect(() => {
    if (!mounted || !dashboardStats) return

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
        activeTab === "daily" ? dashboardStats.dailyDeliveries : 
        activeTab === "weekly" ? dashboardStats.weeklyDeliveries : 
        dashboardStats.monthlyDeliveries

      // Chart dimensions
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // Find max value for scaling
      const maxValue = Math.max(...data, 1) // Ensure at least 1 to avoid division by zero

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

      // Calculate bar width
      const barWidth = (chartWidth / data.length) * 0.7

      // Draw bars
      data.forEach((value, index) => {
        const x = padding + (index + 0.5) * (chartWidth / data.length)
        const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0
        const y = canvas.height - padding - barHeight

        // Draw bar
        ctx.fillStyle = "hsl(270, 76%, 58%)"
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight)

        // Draw value above bar
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "center"
        if (value > 0) {
          ctx.fillText(value.toString(), x, y - 10)
        }

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
    const tabsList = document.querySelector('[role="tablist"]')
    if (tabsList) {
      tabsList.addEventListener("click", setupChart)
    }

    // Cleanup
    return () => {
      const tabsList = document.querySelector('[role="tablist"]')
      if (tabsList) {
        tabsList.removeEventListener("click", setupChart)
      }
    }
  }, [mounted, dashboardStats])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else if (hours < 48) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }

  const renderPercentageChange = (change: number) => {
    const isPositive = change >= 0
    if (change === 0) return <p className="text-xs text-muted-foreground">No change</p>
    
    return (
      <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span>{Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}</span>
      </div>
    )
  }

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    )
  }

  if (!dashboardStats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load dashboard data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <div className="text-2xl font-bold">{dashboardStats.totalDeliveries.total.toLocaleString()}</div>
            {renderPercentageChange(dashboardStats.totalDeliveries.percentageChange)}
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
            <div className="text-2xl font-bold">{dashboardStats.activeShipments.total.toLocaleString()}</div>
            {renderPercentageChange(dashboardStats.activeShipments.percentageChange)}
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[45%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Booked Today</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayBookings.today}</div>
            {renderPercentageChange(dashboardStats.todayBookings.percentageChange)}
            <div className="mt-4 h-1 w-full rounded-full bg-muted">
              <div className="h-1 w-[60%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>

        {podData && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available PODs</CardTitle>
              <FileOutput className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{podData.available}</div>
              <p className="text-xs text-muted-foreground">
                Issued: {podData.totalIssued} | Returned: {podData.totalReturned}
              </p>
              <div className="mt-4 h-1 w-full rounded-full bg-muted">
                <div 
                  className="h-1 rounded-full bg-primary" 
                  style={{ 
                    width: `${Math.min(100, (podData.available / (podData.totalIssued + podData.totalReturned || 1)) * 100)}%` 
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}
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
              {dashboardStats.recentDeliveries.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No recent deliveries</p>
              ) : (
                dashboardStats.recentDeliveries.map((delivery, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{delivery.trackingId}</p>
                      <p className="text-xs text-muted-foreground">{delivery.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-green-500">Delivered</p>
                      <p className="text-xs text-muted-foreground">{formatDate(delivery.deliveredAt)}</p>
                    </div>
                  </div>
                ))
              )}
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
              {dashboardStats.topDestinations.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No destination data</p>
              ) : (
                dashboardStats.topDestinations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{location.location}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-xs font-medium text-primary">{location.count}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}