"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Filter, Printer } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/multiform_ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/multiform_ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/multiform_ui/table"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last7days")
  const [reportType, setReportType] = useState("delivery")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select parameters to generate a custom report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery Performance</SelectItem>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="customer">Customer Activity</SelectItem>
                  <SelectItem value="inventory">Inventory Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="start-date" type="date" className="pl-10" disabled={dateRange !== "custom"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="end-date" type="date" className="pl-10" disabled={dateRange !== "custom"} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="delivery">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Delivery Performance Report</CardTitle>
                <CardDescription>Last 7 days delivery statistics</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Deliveries</TableHead>
                    <TableHead>On-Time</TableHead>
                    <TableHead>Delayed</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "Apr 12, 2025", total: 42, onTime: 39, delayed: 3, rate: "92.9%" },
                    { date: "Apr 11, 2025", total: 38, onTime: 35, delayed: 3, rate: "92.1%" },
                    { date: "Apr 10, 2025", total: 45, onTime: 43, delayed: 2, rate: "95.6%" },
                    { date: "Apr 9, 2025", total: 36, onTime: 33, delayed: 3, rate: "91.7%" },
                    { date: "Apr 8, 2025", total: 41, onTime: 38, delayed: 3, rate: "92.7%" },
                    { date: "Apr 7, 2025", total: 39, onTime: 37, delayed: 2, rate: "94.9%" },
                    { date: "Apr 6, 2025", total: 32, onTime: 30, delayed: 2, rate: "93.8%" },
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.onTime}</TableCell>
                      <TableCell>{row.delayed}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Summary Report</CardTitle>
                <CardDescription>Last 7 days financial overview</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "Apr 12, 2025", revenue: "$4,250", expenses: "$2,830", profit: "$1,420", margin: "33.4%" },
                    { date: "Apr 11, 2025", revenue: "$3,980", expenses: "$2,650", profit: "$1,330", margin: "33.4%" },
                    { date: "Apr 10, 2025", revenue: "$4,520", expenses: "$3,010", profit: "$1,510", margin: "33.4%" },
                    { date: "Apr 9, 2025", revenue: "$3,650", expenses: "$2,430", profit: "$1,220", margin: "33.4%" },
                    { date: "Apr 8, 2025", revenue: "$4,120", expenses: "$2,740", profit: "$1,380", margin: "33.5%" },
                    { date: "Apr 7, 2025", revenue: "$3,890", expenses: "$2,590", profit: "$1,300", margin: "33.4%" },
                    { date: "Apr 6, 2025", revenue: "$3,280", expenses: "$2,180", profit: "$1,100", margin: "33.5%" },
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.revenue}</TableCell>
                      <TableCell>{row.expenses}</TableCell>
                      <TableCell>{row.profit}</TableCell>
                      <TableCell>{row.margin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Activity Report</CardTitle>
                <CardDescription>Last 7 days customer statistics</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>New Customers</TableHead>
                    <TableHead>Active Customers</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: "Apr 12, 2025", new: 8, active: 156, orders: 42, avg: "$101.19" },
                    { date: "Apr 11, 2025", new: 6, active: 148, orders: 38, avg: "$104.74" },
                    { date: "Apr 10, 2025", new: 9, active: 162, orders: 45, avg: "$100.44" },
                    { date: "Apr 9, 2025", new: 5, active: 143, orders: 36, avg: "$101.39" },
                    { date: "Apr 8, 2025", new: 7, active: 152, orders: 41, avg: "$100.49" },
                    { date: "Apr 7, 2025", new: 6, active: 145, orders: 39, avg: "$99.74" },
                    { date: "Apr 6, 2025", new: 4, active: 138, orders: 32, avg: "$102.50" },
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.new}</TableCell>
                      <TableCell>{row.active}</TableCell>
                      <TableCell>{row.orders}</TableCell>
                      <TableCell>{row.avg}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Status Report</CardTitle>
                <CardDescription>Current inventory levels and usage</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Used (7 days)</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { item: "Small Boxes", stock: 245, used: 128, reorder: 100, status: "In Stock" },
                    { item: "Medium Boxes", stock: 186, used: 95, reorder: 80, status: "In Stock" },
                    { item: "Large Boxes", stock: 72, used: 43, reorder: 50, status: "In Stock" },
                    { item: "Packing Tape", stock: 38, used: 26, reorder: 40, status: "Low Stock" },
                    { item: "Bubble Wrap", stock: 156, used: 87, reorder: 100, status: "In Stock" },
                    { item: "Labels", stock: 520, used: 273, reorder: 200, status: "In Stock" },
                    { item: "Shipping Forms", stock: 95, used: 82, reorder: 100, status: "Low Stock" },
                  ].map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.item}</TableCell>
                      <TableCell>{row.stock}</TableCell>
                      <TableCell>{row.used}</TableCell>
                      <TableCell>{row.reorder}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            row.status === "In Stock"
                              ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400"
                          }`}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
