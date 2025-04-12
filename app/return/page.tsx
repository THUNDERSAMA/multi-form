import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ReturnPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8  text-gray-900 dark:text-gray-50">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Shipping, Return and Delivery Policy
        </h1>
  
        <p className="text-sm text-gray-500 mb-6 text-center">Last Updated: 12/4/2025</p>
  
        <p className="mb-4">
          Thank you for choosing <strong>CourierWallah</strong> for your shipping and delivery needs. This Shipping and Delivery Policy outlines the terms and conditions related to the shipment of your packages and the delivery process. Please read this policy carefully before using our services.
        </p>
  
        <PolicySection title="1. Shipment Process">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Booking a Shipment:</strong> Book via our website or customer support. Provide accurate sender, recipient, and package details.
            </li>
            <li>
              <strong>Pickup and Packaging:</strong> Our courier partner or Elegant Courier Service will arrange pickup. Proper and secure packaging is the sender’s responsibility.
            </li>
            <li>
              <strong>Shipping Partners:</strong> We work with trusted partners like DTDC, XpressBees, Dhelivery, and Elegant Courier Service based on region and availability.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="2. Delivery Process">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Estimated Delivery Time:</strong> Based on standard schedules but may vary due to uncontrollable factors like weather or customs.
            </li>
            <li>
              <strong>Delivery Attempt:</strong> If the recipient is unavailable, we may attempt redelivery or leave a notice with further instructions.
            </li>
            <li>
              <strong>Proof of Delivery:</strong> POD is available online showing delivery date, time, and recipient's name via our website or support.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="3. Delivery Coverage">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Service Coverage:</strong> We aim to deliver across many locations. If your location is not covered, we will inform you during booking.
            </li>
            <li>
              <strong>International Shipments:</strong> Customs regulations, duties, and taxes may apply. The recipient is responsible for all related fees and legal compliance.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="4. Undeliverable Packages">
          <p>
            Packages that cannot be delivered due to incorrect address, recipient unavailability, or other reasons will be returned to the sender. Additional charges may apply for re-delivery or return.
          </p>
        </PolicySection>
  
        <PolicySection title="5. Contact Us">
          <p>
            If you have any questions or need help, please contact our support team at{' '}
            <a href="mailto:contact@courierwallah.in" className="text-blue-600 underline">
              contact@courierwallah.in
            </a>. We’re here to help.
          </p>
        </PolicySection>
  
        <PolicySection title="6. Changes to the Shipping and Delivery Policy">
          <p>
            We may update this policy at any time without notice. Any updates will be posted on our website with the latest update date shown at the top.
          </p>
        </PolicySection>
  
        <p className="mt-6">
          By using CourierWallah’s shipping and delivery services, you acknowledge that you’ve read, understood, and agreed to this policy. If you do not agree, please refrain from using our website and services.
        </p>
      </div>
    );
  }
  type PolicySectionProps = {
    title: string;
    children: React.ReactNode;
  };
  function PolicySection({ title, children }: PolicySectionProps) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {children}
      </div>
    );
  }