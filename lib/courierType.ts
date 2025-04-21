// Address details for sender and receiver
export type Address = {
    name: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  
  // Details of each courier item
  export type CourierDetail = {
    weight: string
    length: string
    waybill: string
    quantity: string
    width: string
    height: string
    description: string
    trackingId: string
    toAddress: Address
    totalAmount: string
    shippingMethod: "surface" | "express"
    paymentMethod: "cod" | "prepaid"
  }
  
  // Full form data structure used while creating a courier
  export type FormData = {
    pincode: string
    courierPartner: string
    courierPrice: string
    courierType: "parcel" | "document"
    riskSurcharge: string
    riskfactor: "owner-risk" | "courier-risk"
    clientInvoice: string
    toAddress: Address
    fromAddress: Address
    courierDetails: CourierDetail
    constantFields: string[]
    multipleCouriers: CourierDetail[]
    payementType: string
    courierImage: string
    trackingId: string
    waybill: string
    quantity: string
    totalAmount: string
    shippingMethod: "surface" | "express"
    paymentMethod: "cod" | "prepaid"
  }
  
  // Final structure of a courier entry fetched from the database/API
  export type Courier = {
    id: number
    data: FormData
    status: number
    date_time: string
  }
  