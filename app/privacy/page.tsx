export default function PrivacyPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8  text-gray-900 dark:text-gray-50">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Privacy Policy
        </h1>
  
        <p className="text-sm text-gray-500 mb-6 text-center">Last Updated: 7/8/2023</p>
  
        <p className="mb-4">
          At <strong>CourierWallah</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you access our website or use our services. By using CourierWallah, you consent to the practices described in this Privacy Policy.
        </p>
  
        <PolicySection title="1. Information We Collect">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal Information:</strong> We collect your name, email, phone number, and address when you register or use our services.
            </li>
            <li>
              <strong>Payment Information:</strong> Payment data like credit card numbers are processed securely through encrypted gateways.
            </li>
            <li>
              <strong>Device and Usage Information:</strong> We collect browser, device, and interaction data to enhance performance and user experience.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="2. How We Use Your Information">
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Order Fulfillment:</strong> To process and deliver orders via third-party couriers.</li>
            <li><strong>Customer Support:</strong> To contact and assist users with order-related queries.</li>
            <li><strong>Payment Processing:</strong> Used strictly for processing payments, not stored beyond the transaction.</li>
            <li><strong>Improving Services:</strong> Analyze behavior and feedback to improve user experience.</li>
            <li><strong>Marketing Offers:</strong> With your consent, we may send updates or newsletters (you can unsubscribe anytime).</li>
          </ul>
        </PolicySection>
  
        <PolicySection title="3. Data Sharing and Disclosure">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Courier Partners:</strong> Your delivery information may be shared with DTDC, XpressBees, Dhelivery, or Elegant Courier Service.
            </li>
            <li>
              <strong>Legal Compliance:</strong> Disclosure may occur if required by law or for protection purposes.
            </li>
            <li>
              <strong>Business Transfers:</strong> Your data may be transferred during mergers or acquisitions.
            </li>
          </ul>
        </PolicySection>
  
        <PolicySection title="4. Data Security">
          <p>
            We use standard security practices to protect your personal information. However, no online system is 100% secure.
          </p>
        </PolicySection>
  
        <PolicySection title="5. Cookies and Tracking Technologies">
          <p>
            We use cookies to improve functionality. You can adjust your browser settings to control cookies, but some features may not work properly.
          </p>
        </PolicySection>
  
        <PolicySection title="6. Children's Privacy">
          <p>
            We do not knowingly collect data from users under 18. If you believe your child has submitted personal information, please contact us for removal.
          </p>
        </PolicySection>
  
        <PolicySection title="7. Changes to the Privacy Policy">
          <p>
            We may update this policy periodically. The latest version will be posted here with the effective date.
          </p>
        </PolicySection>
  
        <PolicySection title="8. Contact Us">
          <p>
            For questions or concerns about this policy, contact us at{" "}
            <a href="mailto:contact@courierwallah.in" className="text-blue-600 underline">
              contact@courierwallah.in
            </a>.
          </p>
        </PolicySection>
  
        <p className="mt-6">
          By using CourierWallah, you signify your acceptance of this Privacy Policy. If you do not agree with this policy, please refrain from using our website and services.
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