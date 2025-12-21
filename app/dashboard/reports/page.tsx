"use client"

import { useEffect, useState } from "react"
import { Calendar, Download, FileText, Filter, Printer } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/multiform_ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/multiform_ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/multiform_ui/table"
import type { Courier } from "@/lib/courierType"
import { useToast } from "@/components/ui/use-toast"
import { downloadJSONasXLSX } from "@/lib/export"
  import { Toaster, toast } from 'sonner';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last7days")
  const [reportType, setReportType] = useState("delivery")
   const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [allCouriers, setAllCouriers] = useState<Courier[]>([])
  const [reportData, setReportData] = useState<any[]>([])
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  
useEffect(() => {
    // Fetch couriers from API
    const fetchCouriers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/getData")
        const data = await response.json()
        console.log("Response:", data)

        // Only include confirmed couriers (status = 1)
        const confirmedCouriers = data.data
        setAllCouriers(confirmedCouriers)
        console.log("Confirmed Couriers:", confirmedCouriers);
        // Extract unique client names for auto-suggestions
        const uniqueNames = new Set<string>()
        confirmedCouriers.forEach((courier: Courier) => {
          const parsedData = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data
          if (parsedData.fromAddress && parsedData.fromAddress.name) {
            uniqueNames.add(parsedData.fromAddress.name)
          }
        })
        setSuggestions(Array.from(uniqueNames))
        console.log("Suggestions:", Array.from(uniqueNames));
      } catch (error) {
        console.error("Error fetching couriers:", error)
        // toast({
        //   title: "Error",
        //   description: "Failed to load courier data. Please try again.",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false)
      }
    }

    
      fetchCouriers()
    
  }, [ ])
  const loadReport = () => {
    // Logic to generate report based on selected parameters
    setIsLoading(true)
    fetch("/api/getDataFilter", {
      method: "POST",
      body: JSON.stringify({
        company: searchTerm,
        filter: dateRange,
        startDate: startDate,
        endDate: endDate,
        
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Filtered Data:", data)
        setReportData(data.data)
        toast.success("Report generated successfully! ✅")
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error)
                setIsLoading(false)

      })
  }
  const DownloadReport = () => {
    // Logic to download the generated report
    if (reportData.length > 0) {
      downloadJSONasXLSX(reportData, "report.xlsx");
      
    }
  }
  useEffect(() => {
    // Filter suggestions based on input
    if (searchTerm) {
      const filtered = suggestions.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm, suggestions])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button> */}
          {!isLoading && reportData.length > 0 && (
          <Button variant="outline" size="sm" onClick={DownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select parameters to generate a custom report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* `<div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivered</SelectItem>
                  <SelectItem value="financial">Not-Delivered</SelectItem>
                  <SelectItem value="customer">Customer Activity</SelectItem>
                  <SelectItem value="inventory">Inventory Status</SelectItem>
                </SelectContent>
              </Select>
            </div>` */}
             <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="Enter client name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow for clicks
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
              />
              {showSuggestions && (
                <div className="absolute z-10 w-auto mt-1  border rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions
                    .filter((suggestion) => suggestion.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                        onClick={() => {
                          setSearchTerm(suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                </div>
              )}
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
            {dateRange === "custom" && (
            <><div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="start-date" type="date" className="pl-10" onChange={(e)=>{setStartDate(e.target.value)}} />
                </div>
              </div><div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="end-date" type="date" className="pl-10"  onChange={(e)=>{setEndDate(e.target.value)}} />
                  </div>
                </div></>)}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            

            <Button onClick={loadReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Date
                </th>
                <th scope="col" className="px-6 py-3">
                    CN-no
                </th>
                 <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Client
                </th>
                <th scope="col" className="px-6 py-3 ">
                    Destination
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                    Weight
                </th>
                <th scope="col" className="px-6 py-3 ">
                   Mode
                </th>
            </tr>
        </thead>
        <tbody>
          {reportData.length === 0 && !isLoading && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No data available for the selected criteria.
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  <div className="skeleton h-4 w-full"></div>

              </td>
              
            </tr>
          )}
          {reportData.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                {item.date || 'N/A'}
              </th>
              <td className="px-6 py-4">
                {item.cn || 'N/A'}
              </td>
               <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                {item.client || 'N/A'}
              </td>
              <td className="px-6 py-4">
                {item.destination || 'N/A'}
              </td>
              <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                {item.weight || 'N/A'}
              </td>
              <td className="px-6 py-4 ">
                {item.mode || 'N/A'}
              </td>
            </tr>
          ))}
            
        </tbody>
    </table>
</div>

    </div>
  )
}
