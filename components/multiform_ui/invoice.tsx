import { useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";
import type { FormData } from "../multi-step-form"; // adjust the path as needed
interface FinishStepProps {
    formData: FormData
    shortCode: any
  }
export default function handlePrintInvoice({ formData, shortCode }: FinishStepProps) {
    const handlePrintInvoice = (formData: FormData) => {
        const invoiceWindow = window.open("", "_blank", "width=600,height=800");
        if (!invoiceWindow) return
      
        const courier = formData.multipleCouriers?.[0] || formData // fallback for single courier
      
       
       
        
          const invoiceHTML = `
            <html>
              <head>
                <title>Invoice</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
             <style>
  @media print {
    @page {
      
      size: 90mm 182mm; /* A8 size */
      margin: 0;
    }
    html,body {
      margin: 0 !important;
       overflow: hidden;
       height: 100%;
      width: 100%;
    }
      body > *:last-child {
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
    * {
    box-sizing: border-box;
      margin-bottom: 0 !important;
      padding-bottom: 0 !important;
    }
  }
</style>
              </head>
<body class="rounded-xl bg-white shadow-md border border-gray-200 px-3 py-4" style="margin:0;">
                <!-- Invoice Card -->
                
                <!-- Header -->
                <div class="text-center mb-2">
                  <h1 class="text-blue-600 text-xl font-bold">courierWallah</h1>
                  <h2 class="text-sm font-semibold uppercase">${formData.courierPartner}</h2>
                  <p class="text-sm font-semibold">${shortCode}</p>
                  <p class="text-sm font-semibold">₹${formData.courierPrice}</p>
                </div>
                
        <div class
                  <!-- Client Info -->
                  <div class="mt-3 border-t border-dashed border-blue-600 pt-2 text-left text-sm">
                  <div class="flex">
                  <div class="ml-auto w-1/2">
                    <p class="text-sm text-gray-500 mb-1 font-semibold">Client</p>
                    <div class="flex items-center gap-2">
                      <img src="https://api.dicebear.com/9.x/thumbs/svg?seed=Aneka" alt="Avatar" class="rounded-full w-6 h-6"/>
                      <span class="text-sm font-medium">${courier.toAddress?.name || "Client Name"}</span>
                    </div>
                    </div>
                    <div class="ml-auto w-1/2">
                      <p class="text-sm text-gray-500 mb-1 font-semibold">Payment</p>
                      <span class="text-sm font-medium">${formData.payementType==="cod"?formData.courierPrice===""?"cod":formData.courierPrice:formData.payementType}</span>
                    </div>
                    </div>
                  </div>
                <hr class="border-t border-dashed my-2 border-blue-600" />
       <div class="mt-2 pt-2 pl-2 pr-2 text-left text-sm bg-gray-100 border-t rounded-lg ">
   <p class="text-sm text-gray-500 mb-1 font-semibold">Recipient Destination</p>

  <div class="flex items-start gap-2">
   
    <div class="text-xs leading-tight">
      <div class="text-sm font-medium">${formData.toAddress.address.split(' ').reduce((acc, word, i) => i === 0 ? `<strong>${word}</strong>` : `${acc} ${word}`, '')} </div>

      <div class="mt-1">
         <p class="text-sm text-gray-500 mb-1 font-semibold">Phone:</p>${" "}
        <span class="text-sm font-medium">${formData.toAddress.phone}</span>
      </div>

     
    </div>
  </div>
</div>
 
 <div class="mb-2 bg-gray-100 pl-2 pr-2 flex">
 <div class="ml-auto w-1/2">
         <p class="text-sm text-gray-500 mb-1 font-semibold">Weight:</p>${" "}
        <span class="text-sm font-medium">${formData.courierDetails.weight} kg</span> ${" "}
         <p class="text-sm text-gray-500 mb-1 font-semibold">Dimensions:</p>${" "}
        <span class="text-sm font-medium">${formData.courierDetails.length} × ${formData.courierDetails.width} × ${formData.courierDetails.height} cm</span> ${" "}
        </div>
        <div class="ml-auto w-1/2"> 
        <p class="text-sm text-gray-500 mb-1 font-semibold">Method:</p>${" "}
        <span class="text-sm font-medium">${formData.shippingMethod}</span>
        <p class="text-sm text-gray-500 mb-1 font-semibold">Quantity:</p>
        <span class="text-sm font-medium">${formData.quantity}</span>
        </div>
      </div>

     <hr class="border-t border-dashed my-2 border-blue-600" />
       
                  <div class="mb-2 flex bg-gray-100 pl-2 pr-2">
                  <div class="ml-auto w-1/2">
         <p class="text-sm text-gray-500 mb-1 font-semibold">Invoice no:</p>${" "}
        <span class="text-sm font-medium">${formData.clientInvoice} </span> ${" "}
         <p class="text-sm text-gray-500 mb-1 font-semibold">Invoice amount:</p>${" "}
        <span class="text-sm font-medium">₹${courier.totalAmount || formData.totalAmount}</span> ${" "}
        </div> 
        <div class="ml-auto w-1/2">
        <p class="text-sm text-gray-500 mb-1 font-semibold">Risk surcharge:</p>${" "}
        <span class="text-sm font-medium">${" "}${formData.riskSurcharge}</span>
        <p class="text-sm text-gray-500 mb-1 font-semibold">Risk factor:</p>${" "}
        <span class="text-sm font-medium">${formData.riskfactor}</span>
        </div>
      </div>
                  <!-- Barcode -->
                  <div class="my-3 text-center">
                    <img src="https://barcode.tec-it.com/barcode.ashx?data=${formData.trackingId}&code=Code128&translate-esc=true" class="h-10 mx-auto" />
                  </div>
        
                  <!-- QR Code
                  <div class="text-center mb-2">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=${formData.trackingId}&size=80x80" class="mx-auto" />
                  </div> -->
        
                
                    <div class="h-5 border-b border-dashed border-blue-600"></div>
                  
                <p style="margin:0;padding:0;" class="text-center text-[10px] text-gray-950 font-bold leading-none">WITHOUT INSURANCE NO RISK</p>
                <p style="margin:0; padding:0; " class="font-mono font-medium text-xs">
    Important: No insurance = Consignor Risk. Max claim ₹100. Consignor declares shipment legal & accepts terms.
</p>
<p class="font-mono  text-xs text-gray-500  ">
    
        (1)Elegant Courier not liable for delays beyond control.<br>
        (2)Claims within 15 days.<br>
        (3)Kolkata Jurisdiction. Records kept 30 days.<br>
        (4)Consignor responsible for false declarations.<br>
   </p>
                
               <p style="margin:2;padding:0;" class="text-center text-[10px] text-sky-600 leading-none">Thank you for choosing Elegant Courier</p>

        
                <script>
                  setTimeout(() => window.print(), 300)
                </script>

              </body>
            </html>
          `;
        
          invoiceWindow.document.write(invoiceHTML);
          invoiceWindow.document.close();
        };
        return (
            <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handlePrintInvoice( formData )}
          >
            Print Invoice
          </button>
                );
}