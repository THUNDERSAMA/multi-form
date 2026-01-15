"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Package, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/multiform_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/multiform_ui/card"
import { Input } from "@/components/multiform_ui/input"
import { Label } from "@/components/multiform_ui/label"
import { Textarea } from "@/components/multiform_ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/multiform_ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/multiform_ui/dialog"

interface Courier {
  id: number
  name: string
  totalPods: number
  availablePods: number
  assignedPods: number
}

interface PodRange {
  id: number
  courier_id: number
  courier_name: string
  from_pod: string
  to_pod: string
  total_count: number
  comments: string
  assigned_at: string
}

interface AvailablePod {
  pod_number: string
  selected: boolean
}

export default function PodManagementPage() {
  // State management
  const [couriers, setCouriers] = useState<Courier[]>([])
  const [podRanges, setPodRanges] = useState<PodRange[]>([])
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Modal states
  const [showAddCourierModal, setShowAddCourierModal] = useState(false)
  const [showCourierPodsModal, setShowCourierPodsModal] = useState(false)
  const [showAddPodModal, setShowAddPodModal] = useState(false)
  const [showAssignPodModal, setShowAssignPodModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showCustomPodSelectModal, setShowCustomPodSelectModal] = useState(false)

  // Courier PODs
  const [courierAvailablePods, setCourierAvailablePods] = useState<string[]>([])
  const [loadingCourierPods, setLoadingCourierPods] = useState(false)

  // Add Courier Form
  const [newCourierName, setNewCourierName] = useState("")
  const [newCourierPodLength, setNewCourierPodLength] = useState("")

  // Add POD Form
  const [addPodCourier, setAddPodCourier] = useState("")
  const [addPodFrom, setAddPodFrom] = useState("")
  const [addPodTo, setAddPodTo] = useState("")
  const [addPodComments, setAddPodComments] = useState("")

  // Assign POD Form
  const [assignPodCourier, setAssignPodCourier] = useState("")
  const [assignMode, setAssignMode] = useState<"range" | "custom">("range")
  const [assignFromPod, setAssignFromPod] = useState("")
  const [assignToPod, setAssignToPod] = useState("")
  const [availablePodsForAssign, setAvailablePodsForAssign] = useState<AvailablePod[]>([])
  const [selectedCustomPods, setSelectedCustomPods] = useState<string[]>([])
  const [assignComments, setAssignComments] = useState("")

  // Search
  const [searchPodNumber, setSearchPodNumber] = useState("")
  const [searchCourier, setSearchCourier] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)

  // Fetch data on mount
  useEffect(() => {
    fetchCouriers()
    fetchPodRanges()
  }, [])

  // Generate aesthetic color for courier cards (dark mode compatible)
  const getCourierCardColor = (courierId: number) => {
    const colors = [
      // Vibrant but not too bright - perfect for dark mode
      { bg: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/30", text: "text-blue-400", icon: "text-blue-500" },
      { bg: "from-purple-500/20 to-purple-600/10", border: "border-purple-500/30", text: "text-purple-400", icon: "text-purple-500" },
      { bg: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/30", text: "text-pink-400", icon: "text-pink-500" },
      { bg: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: "text-emerald-500" },
      { bg: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/30", text: "text-cyan-400", icon: "text-cyan-500" },
      { bg: "from-orange-500/20 to-orange-600/10", border: "border-orange-500/30", text: "text-orange-400", icon: "text-orange-500" },
      { bg: "from-teal-500/20 to-teal-600/10", border: "border-teal-500/30", text: "text-teal-400", icon: "text-teal-500" },
      { bg: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-500/30", text: "text-indigo-400", icon: "text-indigo-500" },
      { bg: "from-rose-500/20 to-rose-600/10", border: "border-rose-500/30", text: "text-rose-400", icon: "text-rose-500" },
      { bg: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/30", text: "text-violet-400", icon: "text-violet-500" },
      { bg: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-500/30", text: "text-fuchsia-400", icon: "text-fuchsia-500" },
      { bg: "from-sky-500/20 to-sky-600/10", border: "border-sky-500/30", text: "text-sky-400", icon: "text-sky-500" },
    ]
    
    // Use courier ID to get consistent color for same courier
    return colors[courierId % colors.length]
  }

  const fetchCouriers = async () => {
    try {
      const response = await fetch("/api/pod-management?action=getCouriers")
      const data = await response.json()
      if (data.success) {
        setCouriers(data.couriers)
      }
    } catch (error) {
      console.error("Error fetching couriers:", error)
    }
  }

  const fetchPodRanges = async () => {
    try {
      const response = await fetch("/api/pod-management?action=getPodRanges")
      const data = await response.json()
      if (data.success) {
        setPodRanges(data.ranges)
      }
    } catch (error) {
      console.error("Error fetching POD ranges:", error)
    }
  }

  const handleAddCourier = async () => {
    setError("")
    setSuccess("")

    if (!newCourierName.trim() || !newCourierPodLength) {
      setError("Please fill all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/pod-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addCourier",
          name: newCourierName,
          podLength: parseInt(newCourierPodLength),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Courier added successfully!")
        setNewCourierName("")
        setNewCourierPodLength("")
        setShowAddCourierModal(false)
        fetchCouriers()
      } else {
        setError(data.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to add courier")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPod = async () => {
    setError("")
    setSuccess("")

    if (!addPodCourier || !addPodFrom || !addPodTo || !addPodComments.trim()) {
      setError("All fields are mandatory")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/pod-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addPodRange",
          courierId: addPodCourier,
          fromPod: addPodFrom,
          toPod: addPodTo,
          comments: addPodComments,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Successfully added ${data.count} PODs`)
        setAddPodFrom("")
        setAddPodTo("")
        setAddPodComments("")
        setAddPodCourier("")
        setShowAddPodModal(false)
        fetchCouriers()
        fetchPodRanges()
      } else {
        setError(data.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to add POD range")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailablePodsForCourier = async (courierId: string) => {
    try {
      const response = await fetch(
        `/api/pod-management?action=getAvailablePods&courierId=${courierId}`
      )
      const data = await response.json()

      if (data.success) {
        setAvailablePodsForAssign(
          data.pods.map((pod: string) => ({ pod_number: pod, selected: false }))
        )
      }
    } catch (error) {
      console.error("Error fetching available PODs:", error)
    }
  }

  const fetchCourierAvailablePods = async (courierId: number) => {
    setLoadingCourierPods(true)
    try {
      const response = await fetch(
        `/api/pod-management?action=getAvailablePods&courierId=${courierId}`
      )
      const data = await response.json()

      if (data.success) {
        setCourierAvailablePods(data.pods)
      } else {
        setCourierAvailablePods([])
      }
    } catch (error) {
      console.error("Error fetching courier PODs:", error)
      setCourierAvailablePods([])
    } finally {
      setLoadingCourierPods(false)
    }
  }

  const handleAssignPod = async () => {
    setError("")
    setSuccess("")

    if (!assignPodCourier || !assignComments.trim()) {
      setError("Courier and comments are mandatory")
      return
    }

    if (assignMode === "range" && (!assignFromPod || !assignToPod)) {
      setError("Please specify from and to POD numbers")
      return
    }

    if (assignMode === "custom" && selectedCustomPods.length === 0) {
      setError("Please select at least one POD")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/pod-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assignPod",
          courierId: assignPodCourier,
          mode: assignMode,
          fromPod: assignMode === "range" ? assignFromPod : null,
          toPod: assignMode === "range" ? assignToPod : null,
          customPods: assignMode === "custom" ? selectedCustomPods : null,
          comments: assignComments,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Successfully assigned ${data.count} PODs`)
        resetAssignForm()
        setShowAssignPodModal(false)
        fetchCouriers()
        fetchPodRanges()
      } else {
        setError(data.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to assign POD")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchPod = async () => {
    setError("")
    setSearchResult(null)

    if (!searchPodNumber || !searchCourier) {
      setError("Please enter POD number and select courier")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/pod-management?action=searchPod&podNumber=${searchPodNumber}&courierId=${searchCourier}`
      )
      const data = await response.json()

      if (data.success) {
        setSearchResult(data.result)
      } else {
        setError(data.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to search POD")
    } finally {
      setIsLoading(false)
    }
  }

  const resetAssignForm = () => {
    setAssignPodCourier("")
    setAssignMode("range")
    setAssignFromPod("")
    setAssignToPod("")
    setSelectedCustomPods([])
    setAssignComments("")
    setAvailablePodsForAssign([])
  }

  const toggleCustomPodSelection = (podNumber: string) => {
    setSelectedCustomPods((prev) =>
      prev.includes(podNumber)
        ? prev.filter((p) => p !== podNumber)
        : [...prev, podNumber]
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header with Add Courier and Search */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">POD Management</h1>
            <p className="mt-2 text-muted-foreground">Manage courier PODs and assignments</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSearchModal(true)}
              variant="outline"
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Search POD
            </Button>
            <Button onClick={() => setShowAddCourierModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Courier
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-700"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Couriers Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Couriers</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {couriers.map((courier) => {
              const colorScheme = getCourierCardColor(courier.id)
              return (
                <Card
                  key={courier.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br ${colorScheme.bg} border-2 ${colorScheme.border}`}
                  onClick={() => {
                    setSelectedCourier(courier)
                    fetchCourierAvailablePods(courier.id)
                    setShowCourierPodsModal(true)
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Package className={`h-5 w-5 ${colorScheme.icon}`} />
                      <CardTitle className="text-lg">{courier.name}</CardTitle>
                    </div>
                    <CardDescription>
                      <span className={colorScheme.text}>
                        {courier.availablePods} PODs available
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold">{courier.totalPods}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned:</span>
                        <span className="font-semibold text-orange-500">
                          {courier.assignedPods}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className={`font-semibold ${colorScheme.text}`}>
                          {courier.availablePods}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* POD Management Section */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">POD Management</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Assigned PODs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned PODs</CardTitle>
                <CardDescription>View all assigned POD ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] space-y-3 overflow-y-auto">
                  {podRanges.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      No PODs assigned yet
                    </p>
                  ) : (
                    podRanges.map((range) => (
                      <div
                        key={range.id}
                        className="rounded-lg border bg-muted/50 p-3 text-sm"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-semibold">{range.courier_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {range.total_count} PODs
                          </span>
                        </div>
                        <div className="mb-2 font-mono text-xs">
                          {range.from_pod} - {range.to_pod}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {range.comments}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add POD Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Add or assign PODs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setShowAddPodModal(true)}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Plus className="h-4 w-4" />
                  Add POD Range
                </Button>
                <Button
                  onClick={() => setShowAssignPodModal(true)}
                  className="w-full gap-2"
                  variant="secondary"
                >
                  <Package className="h-4 w-4" />
                  Assign POD
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Courier Modal */}
        <Dialog open={showAddCourierModal} onOpenChange={setShowAddCourierModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Courier</DialogTitle>
              <DialogDescription>
                Create a new courier with POD number configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courier-name">Courier Name *</Label>
                <Input
                  id="courier-name"
                  placeholder="e.g., Elegant Courier"
                  value={newCourierName}
                  onChange={(e) => setNewCourierName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pod-length">POD Number Length *</Label>
                <Input
                  id="pod-length"
                  type="number"
                  placeholder="e.g., 10"
                  value={newCourierPodLength}
                  onChange={(e) => setNewCourierPodLength(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAddCourier}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Adding..." : "Add Courier"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Courier PODs Modal */}
        <Dialog open={showCourierPodsModal} onOpenChange={setShowCourierPodsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCourier?.name} - Available PODs</DialogTitle>
              <DialogDescription>
                {selectedCourier?.availablePods} PODs available
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap gap-2 p-4">
                {loadingCourierPods ? (
                  <div className="flex w-full items-center justify-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <span className="ml-3 text-sm text-muted-foreground">
                      Loading PODs...
                    </span>
                  </div>
                ) : courierAvailablePods.length === 0 ? (
                  <div className="w-full py-8 text-center text-sm text-muted-foreground">
                    No available PODs for this courier
                  </div>
                ) : (
                  courierAvailablePods.map((pod) => (
                    <span
                      key={pod}
                      className="rounded-full border-2 border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/20"
                    >
                      {pod}
                    </span>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add POD Range Modal */}
        <Dialog open={showAddPodModal} onOpenChange={setShowAddPodModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add POD Range</DialogTitle>
              <DialogDescription>
                Add a range of POD numbers to inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Courier *</Label>
                <Select value={addPodCourier} onValueChange={setAddPodCourier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((courier) => (
                      <SelectItem key={courier.id} value={courier.id.toString()}>
                        {courier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="from-pod">From POD *</Label>
                  <Input
                    id="from-pod"
                    placeholder="V3501113020"
                    value={addPodFrom}
                    onChange={(e) => setAddPodFrom(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-pod">To POD *</Label>
                  <Input
                    id="to-pod"
                    placeholder="V3501113039"
                    value={addPodTo}
                    onChange={(e) => setAddPodTo(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-comments">Comments *</Label>
                <Textarea
                  id="add-comments"
                  placeholder="Add notes about this POD range..."
                  value={addPodComments}
                  onChange={(e) => setAddPodComments(e.target.value)}
                />
              </div>
              <Button onClick={handleAddPod} disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add POD Range"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign POD Modal */}
        <Dialog open={showAssignPodModal} onOpenChange={setShowAssignPodModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign POD</DialogTitle>
              <DialogDescription>
                Assign POD numbers to courier personnel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Courier *</Label>
                <Select
                  value={assignPodCourier}
                  onValueChange={(value) => {
                    setAssignPodCourier(value)
                    fetchAvailablePodsForCourier(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((courier) => (
                      <SelectItem key={courier.id} value={courier.id.toString()}>
                        {courier.name} ({courier.availablePods} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {assignPodCourier && availablePodsForAssign.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm">
                  <p className="font-semibold text-blue-900">
                    Available: {availablePodsForAssign[0].pod_number} -{" "}
                    {availablePodsForAssign[availablePodsForAssign.length - 1].pod_number}{" "}
                    ({availablePodsForAssign.length} PODs)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Assignment Mode</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={assignMode === "range" ? "default" : "outline"}
                    onClick={() => setAssignMode("range")}
                    className="flex-1"
                  >
                    Range
                  </Button>
                  <Button
                    type="button"
                    variant={assignMode === "custom" ? "default" : "outline"}
                    onClick={() => setAssignMode("custom")}
                    className="flex-1"
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {assignMode === "range" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>From POD *</Label>
                    <Input
                      placeholder="Start POD"
                      value={assignFromPod}
                      onChange={(e) => setAssignFromPod(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To POD *</Label>
                    <Input
                      placeholder="End POD"
                      value={assignToPod}
                      onChange={(e) => setAssignToPod(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              )}

              {assignMode === "custom" && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCustomPodSelectModal(true)}
                    className="w-full"
                  >
                    Select PODs ({selectedCustomPods.length} selected)
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Comments *</Label>
                <Textarea
                  placeholder="Reason for assignment..."
                  value={assignComments}
                  onChange={(e) => setAssignComments(e.target.value)}
                />
              </div>

              <Button
                onClick={handleAssignPod}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Assigning..." : "Assign POD"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Custom POD Selection Modal */}
        <Dialog
          open={showCustomPodSelectModal}
          onOpenChange={setShowCustomPodSelectModal}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select PODs</DialogTitle>
              <DialogDescription>
                Click on POD numbers to select/deselect ({selectedCustomPods.length}{" "}
                selected)
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap gap-2 p-4">
                {availablePodsForAssign.map((pod) => (
                  <button
                    key={pod.pod_number}
                    onClick={() => toggleCustomPodSelection(pod.pod_number)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedCustomPods.includes(pod.pod_number)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-muted hover:border-primary/50"
                    }`}
                  >
                    {pod.pod_number}
                    {selectedCustomPods.includes(pod.pod_number) && (
                      <Check className="ml-2 inline h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCustomPodSelectModal(false)}
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search POD Modal */}
        <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search POD</DialogTitle>
              <DialogDescription>Find POD assignment details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-pod">POD Number</Label>
                <Input
                  id="search-pod"
                  placeholder="e.g., V3501113025"
                  value={searchPodNumber}
                  onChange={(e) => setSearchPodNumber(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Courier</Label>
                <Select value={searchCourier} onValueChange={setSearchCourier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((courier) => (
                      <SelectItem key={courier.id} value={courier.id.toString()}>
                        {courier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearchPod}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>

              {searchResult && (
                <div className="rounded-lg border p-4">
                  {searchResult.assigned ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Assigned</span>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Range:</strong> {searchResult.from_pod} -{" "}
                          {searchResult.to_pod}
                        </p>
                        <p>
                          <strong>Comments:</strong> {searchResult.comments}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Date:</strong> {searchResult.assigned_at}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Not Assigned</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}