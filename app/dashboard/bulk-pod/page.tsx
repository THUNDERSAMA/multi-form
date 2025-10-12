// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { format } from "date-fns"
// import { CalendarIcon, Search, Download, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Toaster } from "@/components/ui/toaster"
// import { useToast } from "@/components/ui/use-toast"
// import { cn } from "@/lib/utils"
// import PODTemplate from "./pod-template"
// import html2canvas from "html2canvas"
// import JSZip from "jszip"
// import { saveAs } from "file-saver"

// // Mock data for couriers
// const mockCouriers = [
//   {
//     id: "CR12345678",
//     customerName: "John Doe",
//     pickupAddress: "123 Main St, New York, NY 10001",
//     deliveryAddress: "456 Park Ave, New York, NY 10022",
//     packageType: "Document",
//     status: "confirmed",
//     date: "2025-04-12",
//     time: "14:30",
//     price: "$25.99",
//   },
//   {
//     id: "CR23456789",
//     customerName: "Jane Smith",
//     pickupAddress: "789 Broadway, New York, NY 10003",
//     deliveryAddress: "101 5th Ave, New York, NY 10011",
//     packageType: "Small Package",
//     status: "confirmed",
//     date: "2025-04-12",
//     time: "15:45",
//     price: "$32.50",
//   },
//   {
//     id: "CR34567890",
//     customerName: "Robert Johnson",
//     pickupAddress: "222 West St, New York, NY 10014",
//     deliveryAddress: "333 East St, New York, NY 10016",
//     packageType: "Medium Package",
//     status: "confirmed",
//     date: "2025-04-13",
//     time: "09:15",
//     price: "$45.75",
//   },
//   {
//     id: "CR45678901",
//     customerName: "Emily Davis",
//     pickupAddress: "444 North Ave, New York, NY 10018",
//     deliveryAddress: "555 South Blvd, New York, NY 10019",
//     packageType: "Large Package",
//     status: "confirmed",
//     date: "2025-04-13",
//     time: "11:30",
//     price: "$58.25",
//   },
//   {
//     id: "CR56789012",
//     customerName: "John Doe",
//     pickupAddress: "123 Main St, New York, NY 10001",
//     deliveryAddress: "789 East Ave, New York, NY 10022",
//     packageType: "Document",
//     status: "confirmed",
//     date: "2025-04-14",
//     time: "10:30",
//     price: "$22.99",
//   },
//   {
//     id: "CR67890123",
//     customerName: "John Doe",
//     pickupAddress: "123 Main St, New York, NY 10001",
//     deliveryAddress: "321 West St, New York, NY 10023",
//     packageType: "Small Package",
//     status: "confirmed",
//     date: "2025-04-15",
//     time: "13:15",
//     price: "$29.50",
//   },
// ]

// // Get unique client names for auto-suggestions
// const uniqueClientNames = Array.from(new Set(mockCouriers.map((courier) => courier.customerName)))

// export default function BulkPODPage() {
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)
//   const [password, setPassword] = useState("")
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [passwordError, setPasswordError] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [suggestions, setSuggestions] = useState<string[]>([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [date, setDate] = useState<Date | undefined>(undefined)
//   const [searchResults, setSearchResults] = useState<typeof mockCouriers>([])
//   const [selectedCouriers, setSelectedCouriers] = useState<string[]>([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [previewOpen, setPreviewOpen] = useState(false)
//   const [previewCourier, setPreviewCourier] = useState<(typeof mockCouriers)[0] | null>(null)
//   const podRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
//   const { toast } = useToast()
//   const router = useRouter()

//   // Correct password for this demo
//   const CORRECT_PASSWORD = "admin123"

//   useEffect(() => {
//     // Reset authentication state when component mounts
//     setIsAuthenticated(false)
//     setIsPasswordModalOpen(true)
//   }, [])

//   useEffect(() => {
//     // Filter suggestions based on input
//     if (searchTerm) {
//       const filtered = uniqueClientNames.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
//       setSuggestions(filtered)
//       setShowSuggestions(filtered.length > 0)
//     } else {
//       setSuggestions([])
//       setShowSuggestions(false)
//     }
//   }, [searchTerm])

//   const handlePasswordSubmit = () => {
//     if (password === CORRECT_PASSWORD) {
//       setIsAuthenticated(true)
//       setIsPasswordModalOpen(false)
//       setPasswordError(false)
//     } else {
//       setPasswordError(true)
//     }
//   }

//   const handleSearch = () => {
//     setIsSearching(true)
//     setSelectedCouriers([])

//     // Simulate API call with timeout
//     setTimeout(() => {
//       let results = [...mockCouriers]

//       // Filter by customer name if provided
//       if (searchTerm) {
//         results = results.filter((courier) => courier.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
//       }

//       // Filter by date if selected
//       if (date) {
//         const dateStr = format(date, "yyyy-MM-dd")
//         results = results.filter((courier) => courier.date === dateStr)
//       }

//       // Only show confirmed couriers
//       results = results.filter((courier) => courier.status === "confirmed")

//       setSearchResults(results)
//       setIsSearching(false)

//       if (results.length === 0) {
//         toast({
//           title: "No results found",
//           description: "Try adjusting your search criteria",
//         })
//       }
//     }, 1000)
//   }

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedCouriers(searchResults.map((courier) => courier.id))
//     } else {
//       setSelectedCouriers([])
//     }
//   }

//   const handleSelectCourier = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedCouriers((prev) => [...prev, id])
//     } else {
//       setSelectedCouriers((prev) => prev.filter((courierId) => courierId !== id))
//     }
//   }

//   const handlePreview = (courier: (typeof mockCouriers)[0]) => {
//     setPreviewCourier(courier)
//     setPreviewOpen(true)
//   }

//   const generateBulkPOD = async () => {
//     if (selectedCouriers.length === 0) {
//       toast({
//         title: "No couriers selected",
//         description: "Please select at least one courier to generate PODs",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)

//     try {
//       // Create a new zip file
//       const zip = new JSZip()

//       // Process each selected courier
//       for (const courierId of selectedCouriers) {
//         const courier = searchResults.find((c) => c.id === courierId)
//         if (courier && podRefs.current[courierId]) {
//           // Generate POD for this courier
//           const canvas = await html2canvas(podRefs.current[courierId]!, {
//             scale: 2,
//             logging: false,
//             useCORS: true,
//             allowTaint: true,
//           })

//           // Convert canvas to blob
//           const blob = await new Promise<Blob>((resolve) => {
//             canvas.toBlob((blob) => {
//               resolve(blob!)
//             }, "image/png")
//           })

//           // Add to zip file
//           zip.file(`POD-${courier.id}.png`, blob)
//         }
//       }

//       // Generate and download the zip file
//       const content = await zip.generateAsync({ type: "blob" })
//       saveAs(content, `PODs-${format(new Date(), "yyyy-MM-dd")}.zip`)

//       toast({
//         title: "PODs generated successfully",
//         description: `Generated ${selectedCouriers.length} POD documents`,
//       })
//     } catch (error) {
//       console.error("Error generating PODs:", error)
//       toast({
//         title: "Error generating PODs",
//         description: "An error occurred while generating the PODs",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   if (!isAuthenticated) {
//     return (
//       <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Authentication Required</DialogTitle>
//             <DialogDescription>Please enter the admin password to access bulk POD generation.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={passwordError ? "border-red-500" : ""}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handlePasswordSubmit()
//                   }
//                 }}
//               />
//               {passwordError && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
//             </div>
//           </div>
//           <CardFooter className="flex justify-between">
//             <Button variant="outline" onClick={() => router.push("/dashboard")}>
//               Cancel
//             </Button>
//             <Button onClick={handlePasswordSubmit}>Submit</Button>
//           </CardFooter>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-3xl font-bold mb-6">Bulk POD Generation</h1>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Search Couriers</CardTitle>
//           <CardDescription>Search for confirmed couriers by client name and/or booking date</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="space-y-2 relative">
//               <Label htmlFor="clientName">Client Name</Label>
//               <Input
//                 id="clientName"
//                 placeholder="Enter client name"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value)
//                 }}
//                 onFocus={() => {
//                   if (suggestions.length > 0) {
//                     setShowSuggestions(true)
//                   }
//                 }}
//                 onBlur={() => {
//                   // Delay hiding suggestions to allow for clicks
//                   setTimeout(() => setShowSuggestions(false), 200)
//                 }}
//               />
//               {showSuggestions && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//                   {suggestions.map((suggestion, index) => (
//                     <div
//                       key={index}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => {
//                         setSearchTerm(suggestion)
//                         setShowSuggestions(false)
//                       }}
//                     >
//                       {suggestion}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Booking Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {date ? format(date, "PPP") : "Select date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div className="flex items-end">
//               <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
//                 {isSearching ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Searching...
//                   </>
//                 ) : (
//                   <>
//                     <Search className="mr-2 h-4 w-4" />
//                     Search
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {searchResults.length > 0 && (
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//               <CardTitle>Search Results</CardTitle>
//               <CardDescription>Found {searchResults.length} couriers matching your criteria</CardDescription>
//             </div>
//             <Button
//               onClick={generateBulkPOD}
//               disabled={selectedCouriers.length === 0 || isGenerating}
//               className="ml-auto"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Download className="mr-2 h-4 w-4" />
//                   Generate {selectedCouriers.length} PODs
//                 </>
//               )}
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-12">
//                       <Checkbox
//                         checked={selectedCouriers.length === searchResults.length && searchResults.length > 0}
//                         onCheckedChange={handleSelectAll}
//                       />
//                     </TableHead>
//                     <TableHead>ID</TableHead>
//                     <TableHead>Client</TableHead>
//                     <TableHead>Package</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Delivery Address</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {searchResults.map((courier) => (
//                     <TableRow key={courier.id}>
//                       <TableCell>
//                         <Checkbox
//                           checked={selectedCouriers.includes(courier.id)}
//                           onCheckedChange={(checked) => handleSelectCourier(courier.id, checked as boolean)}
//                         />
//                       </TableCell>
//                       <TableCell className="font-medium">{courier.id}</TableCell>
//                       <TableCell>{courier.customerName}</TableCell>
//                       <TableCell>{courier.packageType}</TableCell>
//                       <TableCell>
//                         {courier.date} {courier.time}
//                       </TableCell>
//                       <TableCell className="max-w-xs truncate">{courier.deliveryAddress}</TableCell>
//                       <TableCell className="text-right">
//                         <Button variant="outline" size="sm" onClick={() => handlePreview(courier)}>
//                           Preview
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Hidden POD templates for generation */}
//       <div className="hidden">
//         {searchResults
//           .filter((courier) => selectedCouriers.includes(courier.id))
//           .map((courier) => (
//             <div key={courier.id} ref={(el) => { podRefs.current[courier.id] = el; }}>
//               <PODTemplate courier={courier} />
//             </div>
//           ))}
//       </div>

//       {/* Preview Dialog */}
//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle>POD Preview</DialogTitle>
//             <DialogDescription>Preview for courier #{previewCourier?.id}</DialogDescription>
//           </DialogHeader>
//           <div className="py-4 overflow-auto max-h-[70vh]">
//             {previewCourier && <PODTemplate courier={previewCourier} />}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Toaster />
//     </div>
//   )
// }
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { format } from "date-fns";
// import { CalendarIcon, Search, Download, Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
// import PODTemplate from "./pod-template";
// import html2canvas from "html2canvas";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import type { Courier } from "@/lib/courierType";

// export default function BulkPODPage() {
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
//   const [password, setPassword] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [passwordError, setPasswordError] = useState(false);
//   const [couriers, setCouriers] = useState<Courier[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [date, setDate] = useState<Date | undefined>(undefined);
//   const [searchResults, setSearchResults] = useState<Courier[]>([]);
//   const [selectedCouriers, setSelectedCouriers] = useState<string[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewCourier, setPreviewCourier] = useState<Courier | null>(null);
//   const podRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const { toast } = useToast();
//   const router = useRouter();

//   const CORRECT_PASSWORD = "admin123";

//   useEffect(() => {
//     setIsAuthenticated(false);
//     setIsPasswordModalOpen(true);
//   }, []);

//   useEffect(() => {
//     async function fetchCouriers() {
//       try {
//         const response = await fetch("/api/getData");
//         const data = await response.json();
//         setCouriers(data.data);
//       } catch (error) {
//         console.error("Error fetching couriers:", error);
//       }
//     }
//     fetchCouriers();
//   }, []);

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = couriers
//         .map((c) => {
//           const parsed = typeof c.data === "string" ? JSON.parse(c.data) : c.data;
//           return parsed.fromAddress.name;
//         })
//         .filter((name, index, self) => name.toLowerCase().includes(searchTerm.toLowerCase()) && self.indexOf(name) === index);
//       setSuggestions(filtered);
//       setShowSuggestions(filtered.length > 0);
//     } else {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   }, [searchTerm, couriers]);

//   const handlePasswordSubmit = () => {
//     if (password === CORRECT_PASSWORD) {
//       setIsAuthenticated(true);
//       setIsPasswordModalOpen(false);
//       setPasswordError(false);
//     } else {
//       setPasswordError(true);
//     }
//   };

//   const handleSearch = () => {
//     setIsSearching(true);
//     setSelectedCouriers([]);
//     setTimeout(() => {
//       let results = couriers.filter((courier) => {
//         const parsed = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data;
//         const matchesName = searchTerm ? parsed.fromAddress.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
//         const matchesDate = date ? format(new Date(courier.date_time), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") : true;
//         return matchesName && matchesDate && courier.status === 1;
//       });

//       setSearchResults(results);
//       setIsSearching(false);

//       if (results.length === 0) {
//         toast({ title: "No results found", description: "Try adjusting your search criteria" });
//       }
//     }, 500);
//   };

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       setSelectedCouriers(searchResults.map((courier) => courier.id.toString()));
//     } else {
//       setSelectedCouriers([]);
//     }
//   };

//   const handleSelectCourier = (id: string, checked: boolean) => {
//     if (checked) {
//       setSelectedCouriers((prev) => [...prev, id]);
//     } else {
//       setSelectedCouriers((prev) => prev.filter((courierId) => courierId !== id));
//     }
//   };

//   const handlePreview = (courier: Courier) => {
//     setPreviewCourier(courier);
//     setPreviewOpen(true);
//   };

//   const generateBulkPOD = async () => {
//     if (selectedCouriers.length === 0) {
//       toast({ title: "No couriers selected", description: "Please select at least one courier to generate PODs", variant: "destructive" });
//       return;
//     }
//     setIsGenerating(true);
//     try {
//       const zip = new JSZip();
//       for (const courierId of selectedCouriers) {
//         const courier = searchResults.find((c) => c.id.toString() === courierId);
//         if (courier && podRefs.current[courierId]) {
//           const parsed = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data;
//           const clientFolder = zip.folder(parsed.fromAddress.name || "UnknownClient");
//           const canvas = await html2canvas(podRefs.current[courierId]!, { scale: 2, logging: false, useCORS: true, allowTaint: true });
//           const blob = await new Promise<Blob>((resolve) => {
//             canvas.toBlob((blob) => resolve(blob!), "image/png");
//           });
//           clientFolder?.file(`POD-${courier.id}.png`, blob);
//         }
//       }
//       const content = await zip.generateAsync({ type: "blob" });
//       saveAs(content, `PODs-${format(new Date(), "yyyy-MM-dd")}.zip`);
//       toast({ title: "PODs generated successfully", description: `Generated ${selectedCouriers.length} POD documents` });
//     } catch (error) {
//       console.error("Error generating PODs:", error);
//       toast({ title: "Error generating PODs", description: "An error occurred while generating the PODs", variant: "destructive" });
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Authentication Required</DialogTitle>
//             <DialogDescription>Please enter the admin password to access bulk POD generation.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={passwordError ? "border-red-500" : ""}
//               onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
//             />
//             {passwordError && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
//           </div>
//           <CardFooter className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
//             <Button onClick={handlePasswordSubmit}>Submit</Button>
//           </CardFooter>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-3xl font-bold mb-6">Bulk POD Generation</h1>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Search Couriers</CardTitle>
//           <CardDescription>Search confirmed couriers by client name and/or booking date.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="relative">
//               <Label>Client Name</Label>
//               <Input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Enter client name"
//                 onFocus={() => showSuggestions}
//                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//               />
//               {showSuggestions && (
//                 <div className="absolute z-10 bg-white shadow-md rounded-md max-h-48 overflow-auto">
//                   {suggestions.map((s, i) => (
//                     <div
//                       key={i}
//                       onClick={() => {
//                         setSearchTerm(s);
//                         setShowSuggestions(false);
//                       }}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {s}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div>
//               <Label>Booking Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full justify-start">
//                     <CalendarIcon className="h-4 w-4 mr-2" />
//                     {date ? format(date, "PPP") : "Select Date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent>
//                   <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <Button onClick={handleSearch} className="self-end w-full">
//               {isSearching ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" />} Search
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {searchResults.length > 0 && (
//         <Card>
//           <CardHeader className="flex justify-between items-center">
//             <CardTitle>Search Results</CardTitle>
//             <Button onClick={generateBulkPOD} disabled={isGenerating || selectedCouriers.length === 0}>
//               {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Download PODs ({selectedCouriers.length})
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead><Checkbox checked={selectedCouriers.length === searchResults.length} onCheckedChange={handleSelectAll} /></TableHead>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Client</TableHead>
//                   <TableHead>Pickup Address</TableHead>
//                   <TableHead>Delivery Address</TableHead>
//                   <TableHead>Date Time</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {searchResults.map((courier) => {
//                   const parsed = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data;
//                   return (
//                     <TableRow key={courier.id}>
//                       <TableCell><Checkbox checked={selectedCouriers.includes(courier.id)} onCheckedChange={(c) => handleSelectCourier(courier.id, c as boolean)} /></TableCell>
//                       <TableCell>{courier.id}</TableCell>
//                       <TableCell>{parsed.fromAddress.name}</TableCell>
//                       <TableCell>{parsed.fromAddress.address}</TableCell>
//                       <TableCell>{parsed.toAddress.address}</TableCell>
//                       <TableCell>{courier.date_time}</TableCell>
//                       <TableCell>
//                         <Button variant="outline" size="sm" onClick={() => handlePreview(courier)}>Preview</Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}

//       <div className="hidden">
//         {searchResults.map((courier) => (
//           <div key={courier.id} ref={(el) => { podRefs.current[courier.id] = el; }}>
//             <PODTemplate
//               courier={{
//                 id: String(courier.id),
//                 customerName: typeof courier.data === "string" ? JSON.parse(courier.data).fromAddress.name : courier.data.fromAddress.name,
//                 pickupAddress: typeof courier.data === "string" ? JSON.parse(courier.data).fromAddress.address : courier.data.fromAddress.address,
//                 deliveryAddress: typeof courier.data === "string" ? JSON.parse(courier.data).toAddress.address : courier.data.toAddress.address,
//                 paumentType: typeof courier.data === "string" ? JSON.parse(courier.data).packageType : courier.data.packageType,
//                 status: courier.status === 1 ? "confirmed" : "pending",
//                 date: format(new Date(courier.date_time), "yyyy-MM-dd"),
//                 time: format(new Date(courier.date_time), "HH:mm"),
//                 price: courier.price || "$0.00",
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-5xl">
//           <DialogHeader>
//             <DialogTitle>Preview POD</DialogTitle>
//           </DialogHeader>
//           {previewCourier && (
//             <div className="py-4 overflow-auto max-h-[70vh]">
//               <PODTemplate courier={previewCourier} />
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Toaster />
//     </div>
//   );
// }
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Search, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import PODTemplate from "../couriers/pod-template"
import html2canvas from "html2canvas"
import JSZip from "jszip"
// Fix the import for file-saver
import FileSaver from "file-saver"
import type { Courier } from "@/lib/courierType"

export default function BulkPODPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [allCouriers, setAllCouriers] = useState<Courier[]>([])
  const [searchResults, setSearchResults] = useState<Courier[]>([])
  const [selectedCouriers, setSelectedCouriers] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCourier, setPreviewCourier] = useState<Courier | null>(null)
  const podRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { toast } = useToast()
  const router = useRouter()

  // Correct password for this demo
  const CORRECT_PASSWORD = "123"

  useEffect(() => {
    // Reset authentication state when component mounts
    setIsAuthenticated(false)
    setIsPasswordModalOpen(true)
  }, [])

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
        toast({
          title: "Error",
          description: "Failed to load courier data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchCouriers()
    }
  }, [isAuthenticated, toast])

  useEffect(() => {
    // Filter suggestions based on input
    if (searchTerm) {
      const filtered = suggestions.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm, suggestions])

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      setIsPasswordModalOpen(false)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleSearch = () => {
    setIsSearching(true)
    setSelectedCouriers([])

    // Filter couriers based on search criteria
    let results = [...allCouriers]

    // Filter by customer name if provided
    if (searchTerm) {
      results = results.filter((courier) => {
        const parsedData = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data
      console.log("Parsed Data:", parsedData);
        return parsedData.fromAddress.name.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Filter by date if selected
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      results = results.filter((courier) => {
        // Extract date part from date_time field
        const courierDate = courier.date_time.split(" ")[0]
        return courierDate === dateStr
      })
    }

    setSearchResults(results)
    setIsSearching(false)

    if (results.length === 0) {
      toast({
        title: "No results found",
        description: "Try adjusting your search criteria",
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCouriers(searchResults.map((courier) => courier.id.toString()))
    } else {
      setSelectedCouriers([])
    }
  }

  const handleSelectCourier = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCouriers((prev) => [...prev, id])
    } else {
      setSelectedCouriers((prev) => prev.filter((courierId) => courierId !== id))
    }
  }

  const handlePreview = (courier: Courier) => {
    setPreviewCourier(courier)
    setPreviewOpen(true)
  }

  const generateBulkPOD = async () => {
    if (selectedCouriers.length === 0) {
      toast({
        title: "No couriers selected",
        description: "Please select at least one courier to generate PODs",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Create a new zip file
      const zip = new JSZip()

      // Process each selected courier
      for (const courierId of selectedCouriers) {
        const courier = searchResults.find((c) => c.id.toString() === courierId)
        if (courier && podRefs.current[courierId]) {
          // Add a small delay to ensure the element is fully rendered
          await new Promise((resolve) => setTimeout(resolve, 100))
          const canvas = await html2canvas(podRefs.current[courierId]!, {
            scale: 2,
            logging: true, // Enable logging for debugging
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: 800, // Set explicit width
            height: podRefs.current[courierId]!.offsetHeight,
            onclone: (document, element) => {
              // Make sure the element is visible in the cloned document
              element.style.visibility = "visible"
              element.style.opacity = "1"
            },
          })

          // Convert canvas to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!)
            }, "image/png")
          })

          // Add to zip file
          zip.file(`POD-${courier.id}.png`, blob)
        }
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" })
      // Use FileSaver.saveAs instead of saveAs
      FileSaver.saveAs(content, `PODs-${format(new Date(), "yyyy-MM-dd")}.zip`)

      toast({
        title: "PODs generated successfully",
        description: `Generated ${selectedCouriers.length} POD documents`,
      })
    } catch (error) {
      console.error("Error generating PODs:", error)
      toast({
        title: "Error generating PODs",
        description: "An error occurred while generating the PODs",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>Please enter the admin password to access bulk POD generation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? "border-red-500" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordSubmit()
                  }
                }}
              />
              {passwordError && <p className="text-sm text-red-500">Incorrect password. Please try again.</p>}
            </div>
          </div>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </CardFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading courier data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Bulk POD Generation</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Couriers</CardTitle>
          <CardDescription>Search for confirmed couriers by client name and/or booking date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2 relative">
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
                <div className="absolute z-10 w-full mt-1  border rounded-md shadow-lg max-h-60 overflow-auto">
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
              <Label>Booking Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Found {searchResults.length} couriers matching your criteria</CardDescription>
            </div>
            <Button
              onClick={generateBulkPOD}
              disabled={selectedCouriers.length === 0 || isGenerating}
              className="ml-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate {selectedCouriers.length} PODs
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCouriers.length === searchResults.length && searchResults.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((courier) => {
                    const parsedData = typeof courier.data === "string" ? JSON.parse(courier.data) : courier.data
                    return (
                      <TableRow key={courier.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCouriers.includes(courier.id.toString())}
                            onCheckedChange={(checked) => handleSelectCourier(courier.id.toString(), checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{parsedData.trackingId || courier.id}</TableCell>
                        <TableCell>{parsedData.fromAddress.name}</TableCell>
                        <TableCell className="capitalize">{parsedData.courierType}</TableCell>
                        <TableCell>{courier.date_time}</TableCell>
                        <TableCell className="max-w-xs truncate">{parsedData.toAddress.address}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handlePreview(courier)}>
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Off-screen POD templates for generation */}
        <div className="fixed left-[-9999px] top-[-9999px] opacity-100 pointer-events-none" aria-hidden="true">
        {searchResults
          .filter((courier) => selectedCouriers.includes(courier.id.toString()))
          .map((courier) => (
            <div
              key={courier.id}
              ref={(el) => {
                podRefs.current[courier.id] = el;
              }}
              className="bg-white w-[800px] h-auto"
            >
              <PODTemplate
                courier={courier} // Ensure the correct type is passed
              />
            </div>
          ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>POD Preview</DialogTitle>
            <DialogDescription>
              Preview for courier #
              {previewCourier &&
                (typeof previewCourier.data === "string"
                  ? JSON.parse(previewCourier.data).trackingId
                  : previewCourier.data.trackingId)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-auto max-h-[70vh]">
            {previewCourier && <PODTemplate courier={previewCourier} />}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
