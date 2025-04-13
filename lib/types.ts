export interface Recipient {
    name: string
    phone: string
    email?: string
  }
  
  export interface Location {
    address: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  
  export interface ParcelItem {
    name: string
    quantity: number
    weight?: number
  }
  
  export interface Parcel {
    id: string
    trackingId: string
    status: "Pending" | "In Transit" | "Delivered" | "Failed"
    recipient: Recipient
    sender?: Recipient
    origin?: Location
    destination: Location
    items: ParcelItem[]
    scheduledDelivery?: Date
    deliveredAt?: Date
  }
  