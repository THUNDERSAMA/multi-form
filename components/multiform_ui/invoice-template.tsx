interface FormData {
  courierPartner: string;
  courierPrice: string;
  toAddress: {
    name?: string;
    address: string;
    phone: string;
  };
  fromAddress: {
    name: string;
  };
  payementType: string;
  courierDetails: {
    weight: string;
    length: string;
    width: string;
    height: string;
  };
  shippingMethod: string;
  quantity: string;
  clientInvoice: string;
  totalAmount: string;
  riskSurcharge: string;
  riskfactor: string;
  trackingId: string;
  multipleCouriers?: any[];
}

interface InvoiceTemplateProps {
  formData: FormData;
  shortCode: string;
}

export default function InvoiceTemplate({ formData, shortCode }: InvoiceTemplateProps) {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  const courier = formData.multipleCouriers?.[0] || formData;

  return (
    <div className="bg-white border-2 border-black" style={{ width: "396px", padding: "12px", fontSize: "10px", color: "black" }}>
      <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-black">
        <div className="flex-1">
          <h3 className="text-[9px] font-bold mb-1">To:</h3>
          <p className="text-[8px] mb-0.5 leading-tight"><strong>{courier.toAddress?.name || "Client Name"}</strong></p>
          <p className="text-[8px] leading-tight mb-0.5">{formData.toAddress.address}</p>
          <p className="text-[8px]">Phone: {formData.toAddress.phone}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <img src="/logo-black.png" alt="courierWallah Logo" className="h-8 mx-auto mb-0.5" />
        </div>
      </div>

      <div className="flex justify-between mb-2 pb-2 border-b border-black">
        <div>
          <div className="mb-1">
            <div className="text-[8px] font-bold">Order No:</div>
            <div className="text-[8px]">{formData.clientInvoice}</div>
          </div>
          <div>
            <div className="text-[8px] font-bold">Order Date:</div>
            <div className="text-[8px]">{formattedDate}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold mb-1">{shortCode}</div>
          <div className="text-[7px] mt-0.5">{formData.clientInvoice}</div>
        </div>
      </div>

      <div className="mb-2 pb-2 border-b border-black">
        <div className="text-[8px] font-bold mb-1">Courier Name: {formData.courierPartner}</div>
        <div className="text-center">
          <img
            src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(formData.trackingId)}&scale=2&includetext`}
            alt="Tracking Barcode"
            className="h-11 mx-auto"
            crossOrigin="anonymous"
          />
          <div className="text-[8px] mt-0.5">{formData.trackingId}</div>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-[9px] font-bold mb-1">Product Details:</h3>
        <table className="w-full text-[8px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left">SKU</th>
              <th className="border border-black p-1 text-left">Item Name</th>
              <th className="border border-black p-1 text-left">Qty.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1">N/A</td>
              <td className="border border-black p-1">
                Package - {formData.courierDetails.weight}kg ({formData.courierDetails.length}×{formData.courierDetails.width}×{formData.courierDetails.height}cm)
              </td>
              <td className="border border-black p-1">{formData.quantity}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <h3 className="text-[9px] font-bold mb-0.5">Consignor Information:</h3>
          <p className="text-[8px] leading-tight"><strong>{formData.courierPartner}</strong></p>
          <p className="text-[8px] leading-tight">{formData.fromAddress.name}</p>
          <p className="text-[8px] leading-tight">Shipping: {formData.shippingMethod}</p>
          <p className="text-[8px] leading-tight">Payment: {formData.payementType}</p>
        </div>

        <div>
          <h3 className="text-[9px] font-bold mb-0.5">Pickup and Return Address:</h3>
          <p className="text-[8px] leading-tight"><strong>{formData.courierPartner}</strong></p>
          <p className="text-[8px] leading-tight">{formData.fromAddress.name}</p>
        </div>
      </div>

      <div>
        <table className="w-full text-[8px]">
          <tbody>
            <tr className="border border-black">
              <td className="border border-black p-1"><strong>Invoice Amount:</strong></td>
              <td className="border border-black p-1">₹{courier.totalAmount || formData.totalAmount}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1"><strong>Courier Price:</strong></td>
              <td className="border border-black p-1">{formData.payementType === "Billed" ? "Billed" : formData.courierPrice}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1"><strong>Risk Surcharge:</strong></td>
              <td className="border border-black p-1">{formData.riskSurcharge}</td>
            </tr>
            <tr className="border border-black">
              <td className="border border-black p-1"><strong>Risk Factor:</strong></td>
              <td className="border border-black p-1">{formData.riskfactor}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
