import type { Parcel } from "./types"

export const mockParcels: Parcel[] = [
  {
    id: "1",
    trackingId: "FTR-12345-XYZ",
    status: "In Transit",
    recipient: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
    },
    sender: {
      name: "Tech Gadgets Inc.",
      phone: "+1 (555) 987-6543",
    },
    origin: {
      address: "123 Shipping Lane, Warehouse District, CA 90210",
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
    destination: {
      address: "456 Residential Ave, Apt 7B, New York, NY 10001",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    items: [
      {
        name: "Smartphone XS Pro",
        quantity: 1,
        weight: 0.5,
      },
      {
        name: "Protective Case",
        quantity: 1,
        weight: 0.2,
      },
    ],
    scheduledDelivery: new Date("2025-04-15T14:00:00"),
  },
  {
    id: "2",
    trackingId: "FTR-67890-ABC",
    status: "Delivered",
    recipient: {
      name: "Jane Smith",
      phone: "+1 (555) 234-5678",
      email: "jane.smith@example.com",
    },
    destination: {
      address: "789 Business Blvd, Suite 12C, Chicago, IL 60601",
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298,
      },
    },
    items: [
      {
        name: "Business Documents",
        quantity: 1,
        weight: 0.3,
      },
    ],
    scheduledDelivery: new Date("2025-04-10T10:00:00"),
    deliveredAt: new Date("2025-04-10T09:45:00"),
  },
  {
    id: "3",
    trackingId: "FTR-24680-DEF",
    status: "Pending",
    recipient: {
      name: "Robert Johnson",
      phone: "+1 (555) 345-6789",
    },
    destination: {
      address: "101 Suburban Street, Miami, FL 33101",
    },
    items: [
      {
        name: "Home Fitness Equipment",
        quantity: 1,
        weight: 15.0,
      },
    ],
    scheduledDelivery: new Date("2025-04-18T12:00:00"),
  },
  {
    id: "4",
    trackingId: "FTR-13579-GHI",
    status: "In Transit",
    recipient: {
      name: "Emily Davis",
      phone: "+1 (555) 456-7890",
      email: "emily.davis@example.com",
    },
    destination: {
      address: "222 Tech Park Drive, San Francisco, CA 94105",
    },
    items: [
      {
        name: "Laptop Pro X",
        quantity: 1,
        weight: 2.5,
      },
      {
        name: "Wireless Mouse",
        quantity: 1,
        weight: 0.1,
      },
      {
        name: "USB-C Hub",
        quantity: 1,
        weight: 0.2,
      },
    ],
    scheduledDelivery: new Date("2025-04-16T15:30:00"),
  },
  {
    id: "5",
    trackingId: "FTR-97531-JKL",
    status: "Delivered",
    recipient: {
      name: "Michael Wilson",
      phone: "+1 (555) 567-8901",
    },
    destination: {
      address: "333 Downtown Avenue, Seattle, WA 98101",
    },
    items: [
      {
        name: "Coffee Subscription Box",
        quantity: 1,
        weight: 1.0,
      },
    ],
    scheduledDelivery: new Date("2025-04-12T09:00:00"),
    deliveredAt: new Date("2025-04-12T08:55:00"),
  },
]
