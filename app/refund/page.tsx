import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
export default function RefundCancellationPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8  text-gray-900 dark:text-gray-50">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Refund and Cancellation Policy
        </h1>
  
        <p className="text-sm text-gray-500 mb-6 text-center">Last Updated: 7/8/2023</p>
  
        <p className="mb-4">
          Thank you for choosing <strong>CourierWallah</strong> for your courier service needs. This Refund and Cancellation Policy outlines the terms and conditions related to the cancellation of orders and the process for requesting refunds. Please read this policy carefully before using our services.
        </p>
  
        <PolicySection title="1. Order Cancellation">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Cancellation by the User:</strong> You may cancel under the following conditions:
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>
                  <strong>Before Pickup:</strong> Cancel via your account or by contacting support. Refunds and any cancellation fees depend on the courier partner’s policy.
                </li>
                <li>
                  <strong>After Pickup:</strong> If the courier is already picked up, cancellation may not be possible. Refunds, if any, will follow the refund policy.
                </li>
              </ul>
            </li>
            <li>
              <strong>Cancellation by CourierWallah:</strong> We reserve the right to cancel orders due to unforeseen issues. You will be notified, and a full refund will be issued to your original payment method.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="2. Refund Policy">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Refund Eligibility:</strong> You may receive a refund under the following:
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>
                  <strong>Cancellation Before Pickup:</strong> If eligible as per the courier partner’s rules, refund will be issued to the original payment method.
                </li>
                <li>
                  <strong>Non-Delivery:</strong> If delivery fails due to reasons within our control, you're eligible for a refund pending investigation.
                </li>
              </ul>
            </li>
            <li>
              <strong>Refund Processing:</strong>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li>
                  <strong>Credit Card Payments:</strong> Refund will be credited to the original card used.
                </li>
                <li>
                  <strong>Other Payment Methods:</strong> Refunds will be processed via the original method or as discussed with support.
                </li>
              </ul>
            </li>
            <li>
              <strong>Refund Timeline:</strong> Refunds typically take up to 5 business days after confirmation, depending on your financial provider.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="3. Contact Us">
          <p>
            To cancel an order or request a refund, please contact us at{' '}
            <a href="mailto:contact@courierwallah.in" className="text-blue-600 underline">
              contact@courierwallah.in
            </a>. Our team will assist you throughout the process.
          </p>
        </PolicySection>
  
        <PolicySection title="4. Changes to the Refund and Cancellation Policy">
          <p>
            We may update this policy at any time without prior notice. The latest version will always be available on our website, with the updated date noted above.
          </p>
        </PolicySection>
  
        <p className="mt-6">
          By using CourierWallah’s services, you acknowledge that you have read, understood, and agreed to this Refund and Cancellation Policy. If you do not agree, please refrain from using our services.
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
  