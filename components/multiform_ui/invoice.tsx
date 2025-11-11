import { useState, useRef } from "react";
import { Button } from "../ui/button";

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

interface InvoiceProps {
  formData: FormData;
  shortCode: string;
}

export default function Invoice({ formData, shortCode }: InvoiceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  //date in dd-mm-yyyy format
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  const generateInvoiceHTML = () => {
    const courier = formData.multipleCouriers?.[0] || formData;
    console.log(formData);
    
    return `
      <html>
        <head>
          <title>Invoice</title>
          <meta charset="UTF-8">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              @page {
                size: 90mm 182mm;
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                overflow: hidden;
                height: 100%;
                width: 100%;
              }
            }
          </style>
        </head>
        <body class="rounded-xl bg-white shadow-md border border-gray-200 px-3 py-4" style="margin:0;">
          <div class="text-center mb-2">
            <h1 class="text-blue-600 text-xl font-bold">courierWallah</h1>
            <h2 class="text-sm font-semibold uppercase">${formData.courierPartner}</h2>
            <p class="text-sm font-semibold">${shortCode}</p>
            <p class="text-sm font-semibold">₹${formData.courierPrice}</p>
          </div>
          <div class="mb-1 text-gray-700 font-semibold font-sans italic font-sm">
           ${formattedDate}
          </div>
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
                <p class="text-sm text-gray-500 mb-1 font-semibold">Sender</p>
                <span class="text-sm font-medium">${formData.fromAddress.name}</span>
              </div>
            </div>
          </div>
          
          <hr class="border-t border-dashed my-2 border-blue-600" />
          
          <div class="mt-2 pt-2 pl-2 pr-2 text-left text-sm bg-gray-100 border-t rounded-lg">
            <p class="text-sm text-gray-500 mb-1 font-semibold">Recipient Destination</p>
            <div class="flex items-start gap-2">
              <div class="text-xs leading-tight">
                <div class="text-sm font-medium">${formData.toAddress.address.split(' ').reduce((acc, word, i) => i === 0 ? `<strong>${word}</strong>` : `${acc} ${word}`, '')}</div>
                <div class="mt-1">
                  <p class="text-sm text-gray-500 mb-1 font-semibold">Phone:</p>
                  <span class="text-sm font-medium">${formData.toAddress.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mb-2 bg-gray-100 pl-2 pr-2 flex">
            <div class="ml-auto w-1/2">
              <p class="text-sm text-gray-500 mb-1 font-semibold">Weight:</p>
              <span class="text-sm font-medium">${formData.courierDetails.weight} kg</span>
              <p class="text-sm text-gray-500 mb-1 font-semibold">Dimensions:</p>
              <span class="text-sm font-medium">${formData.courierDetails.length} × ${formData.courierDetails.width} × ${formData.courierDetails.height} cm</span>
            </div>
            <div class="ml-auto w-1/2">
              <p class="text-sm text-gray-500 mb-1 font-semibold">Method:</p>
              <span class="text-sm font-medium">${formData.shippingMethod}</span>
              <p class="text-sm text-gray-500 mb-1 font-semibold">Quantity:</p>
              <span class="text-sm font-medium">${formData.quantity}</span>
            </div>
          </div>
          
          <hr class="border-t border-dashed my-2 border-blue-600" />
          
          <div class="mb-2 flex bg-gray-100 pl-2 pr-2">
            <div class="ml-auto w-1/2">
              <p class="text-sm text-gray-500 mb-1 font-semibold">Invoice no:</p>
              <span class="text-sm font-medium">${formData.clientInvoice}</span>
              <p class="text-sm text-gray-500 mb-1 font-semibold">Invoice amount:</p>
              <span class="text-sm font-medium">₹${courier.totalAmount || formData.totalAmount}</span>
            </div>
            <div class="ml-auto w-1/2">
              <p class="text-sm text-gray-500 mb-1 font-semibold">Risk surcharge:</p>
              <span class="text-sm font-medium">${formData.riskSurcharge}</span>
              <p class="text-sm text-gray-500 mb-1 font-semibold">Risk factor:</p>
              <span class="text-sm font-medium">${formData.riskfactor}</span>
            </div>
          </div>
          
          <div class="my-3 text-center">
            <img src="https://barcode.tec-it.com/barcode.ashx?data=${formData.trackingId}&code=Code128&translate-esc=true" class="h-10 mx-auto" />
          </div>
          
          <div class="h-5 border-b border-dashed border-blue-600"></div>
          
          <p style="margin:0;padding:0;" class="text-center text-[10px] text-gray-950 font-bold leading-none">WITHOUT INSURANCE NO RISK</p>
          <p style="margin:0; padding:0;" class="font-mono font-medium text-xs">
            Important: No insurance = Consignor Risk. Max claim ₹100. Consignor declares shipment legal & accepts terms.
          </p>
          <p class="font-mono text-xs text-gray-500">
            (1) Elegant Courier not liable for delays beyond control.<br>
            (2) Claims within 15 days.<br>
            (3) Kolkata Jurisdiction. Records kept 30 days.<br>
            (4) Consignor responsible for false declarations.<br>
          </p>
          
          <p style="margin:2;padding:0;" class="text-center text-[10px] text-sky-600 leading-none">Thank you for choosing Elegant Courier</p>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const invoiceWindow = window.open("", "_blank", "width=600,height=800");
    if (invoiceWindow) {
      const invoiceHTML = generateInvoiceHTML();
      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();
      
      setTimeout(() => {
        invoiceWindow.print();
      }, 300);
    }
  };

  const loadHtml2Canvas = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).html2canvas) {
        resolve((window as any).html2canvas);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => resolve((window as any).html2canvas);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleShare = async () => {
    setIsGenerating(true);

    try {
      if (!invoiceRef.current) return;

      // Load html2canvas library
      const html2canvas = await loadHtml2Canvas();
      
      // Generate canvas from the invoice
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        const file = new File([blob], `invoice-${shortCode}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Invoice ${shortCode}`,
              text: `Invoice #${formData.clientInvoice}`
            });
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.error('Share failed:', error);
              downloadImage(canvas);
            }
          }
        } else {
          // Fallback: download the image
          downloadImage(canvas);
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate invoice image. Please try again.');
      setIsGenerating(false);
    }
  };

  const downloadImage = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `invoice-${shortCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      {/* Hidden Invoice for Screenshot */}
      <div ref={invoiceRef} className="rounded-xl bg-white shadow-md border border-gray-200 px-3 py-4" style={{ width: '340px', position: 'absolute', left: '-9999px' }}>
        <div className="text-center mb-2">
          <h1 className="text-blue-600 text-xl font-bold">courierWallah</h1>
          <h2 className="text-sm font-semibold uppercase text-gray-950">{formData.courierPartner}</h2>
          <p className="text-sm font-semibold text-gray-950">{shortCode}</p>
          <p className="text-sm font-semibold text-gray-950">₹{formData.courierPrice}</p>
        </div>
         <div className="mb-1 text-gray-500 font-semibold font-sans italic font-sm">
           {formattedDate}
          </div>
        <div className="mt-3 border-t border-dashed border-blue-600 pt-2 text-left text-sm">
         
          <div className="flex">
            <div className="ml-auto w-1/2">
              <p className="text-sm text-gray-500 mb-1 font-semibold">Client</p>
              <div className="flex items-center gap-2">
                <img src="https://api.dicebear.com/9.x/thumbs/svg?seed=Aneka" alt="Avatar" className="rounded-full w-6 h-6"/>
                <span className="text-sm font-medium text-gray-950">{(formData.multipleCouriers?.[0] || formData).toAddress?.name || "Client Name"}</span>
              </div>
            </div>
            <div className="ml-auto w-1/2">
              <p className="text-sm text-gray-500 mb-1 font-semibold">Sender</p>
              <span className="text-sm font-medium text-gray-950">${formData.fromAddress.name}</span>
            </div>
          </div>
        </div>
        
        <hr className="border-t border-dashed my-2 border-blue-600" />
        
        <div className="mt-2 pt-2 pl-2 pr-2 text-left text-sm bg-gray-100 border-t rounded-lg">
          <p className="text-sm text-gray-500 mb-1 font-semibold">Recipient Destination</p>
          <div className="flex items-start gap-2">
            <div className="text-xs leading-tight">
              <div className="text-sm font-medium text-gray-950" dangerouslySetInnerHTML={{ __html: formData.toAddress.address.split(' ').reduce((acc, word, i) => i === 0 ? `<strong>${word}</strong>` : `${acc} ${word}`, '') }} />
              <div className="mt-1">
                <p className="text-sm text-gray-500 mb-1 font-semibold">Phone:</p>
                <span className="text-sm font-medium text-gray-950">{formData.toAddress.phone}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-2 bg-gray-100 pl-2 pr-2 flex">
          <div className="ml-auto w-1/2">
            <p className="text-sm text-gray-500 mb-1 font-semibold">Weight:</p>
            <span className="text-sm font-medium text-gray-950">{formData.courierDetails.weight} kg</span>
            <p className="text-sm text-gray-500 mb-1 font-semibold">Dimensions:</p>
            <span className="text-sm font-medium text-gray-950">{formData.courierDetails.length} × {formData.courierDetails.width} × {formData.courierDetails.height} cm</span>
          </div>
          <div className="ml-auto w-1/2">
            <p className="text-sm text-gray-500 mb-1 font-semibold">Method:</p>
            <span className="text-sm font-medium text-gray-950">{formData.shippingMethod}</span>
            <p className="text-sm text-gray-500 mb-1 font-semibold">Quantity:</p>
            <span className="text-sm font-medium text-gray-950">{formData.quantity}</span>
          </div>
        </div>
        
        <hr className="border-t border-dashed my-2 border-blue-600" />
        
        <div className="mb-2 flex bg-gray-100 pl-2 pr-2">
          <div className="ml-auto w-1/2">
            <p className="text-sm text-gray-500 mb-1 font-semibold">Invoice no:</p>
            <span className="text-sm font-medium text-gray-950">{formData.clientInvoice}</span>
            <p className="text-sm text-gray-500 mb-1 font-semibold">Invoice amount:</p>
            <span className="text-sm font-medium text-gray-950" >₹{(formData.multipleCouriers?.[0] || formData).totalAmount || formData.totalAmount}</span>
          </div>
          <div className="ml-auto w-1/2">
            <p className="text-sm text-gray-500 mb-1 font-semibold">Risk surcharge:</p>
            <span className="text-sm font-medium text-gray-950">{formData.riskSurcharge}</span>
            <p className="text-sm text-gray-500 mb-1 font-semibold">Risk factor:</p>
            <span className="text-sm font-medium text-gray-950">{formData.riskfactor}</span>
          </div>
        </div>
        
        <div className="my-3 text-center">
          <img src={`https://barcode.tec-it.com/barcode.ashx?data=${formData.trackingId}&code=Code128&translate-esc=true`} className="h-10 mx-auto" alt="Barcode" crossOrigin="anonymous" />
        </div>
        
        <div className="h-5 border-b border-dashed border-blue-600"></div>
        
        <p style={{ margin: 0, padding: 0 }} className="text-center text-[10px] text-gray-950 font-bold leading-none">WITHOUT INSURANCE NO RISK</p>
        <p style={{ margin: 0, padding: 0 }} className="font-mono font-medium text-xs text-gray-950">
          Important: No insurance = Consignor Risk. Max claim ₹100. Consignor declares shipment legal & accepts terms.
        </p>
        <p className="font-mono text-xs text-gray-500">
          (1) Elegant Courier not liable for delays beyond control.<br />
          (2) Claims within 15 days.<br />
          (3) Kolkata Jurisdiction. Records kept 30 days.<br />
          (4) Consignor responsible for false declarations.<br />
        </p>
        
        <p style={{ margin: 2, padding: 0 }} className="text-center text-[10px] text-sky-600 leading-none">Thank you for choosing Elegant Courier</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <Button
       
        className="flex items-center gap-2"
          onClick={handlePrint}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </Button>

        <Button
        variant={"secondary"}
        className="flex items-center gap-2"
          onClick={handleShare}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share as Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

