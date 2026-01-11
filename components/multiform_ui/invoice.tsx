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
  
  // Date in dd-mm-yyyy format
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  
  const generateInvoiceHTML = () => {
    const courier = formData.multipleCouriers?.[0] || formData;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${shortCode}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @media print {
              @page {
                size: A6;
                margin: 5mm;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible;
                height: auto;
                width: 100%;
              }
              .invoice-container {
                page-break-inside: avoid;
              }
            }
            
            body {
              font-family: Arial, sans-serif;
              background: white;
              padding: 10px;
              font-size: 9px;
            }
            
            .invoice-container {
              max-width: 105mm;
              margin: 0 auto;
              border: 2px solid #000;
              padding: 10px;
              background: white;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 2px solid #000;
            }
            
            .recipient-info {
              flex: 1;
            }
            
            .recipient-info h3 {
              font-size: 9px;
              margin-bottom: 3px;
              font-weight: bold;
            }
            
            .recipient-info p {
              font-size: 8px;
              line-height: 1.3;
              margin: 1px 0;
            }
            
            .logo-section {
              text-align: right;
              flex-shrink: 0;
              margin-left: 10px;
            }
            
            .logo-text {
              font-size: 14px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 2px;
            }
            
            .logo-section .tagline {
              font-size: 7px;
              font-style: italic;
              color: #666;
            }
            
            .order-section {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 6px 0;
              border-bottom: 1px solid #000;
            }
            
            .order-left, .order-right {
              flex: 1;
            }
            
            .order-right {
              text-align: right;
            }
            
            .order-label {
              font-size: 8px;
              font-weight: bold;
              margin-bottom: 2px;
            }
            
            .order-value {
              font-size: 8px;
            }
            
            .barcode-section {
              text-align: right;
              margin: 5px 0;
            }
            
            .barcode-section img {
              max-width: 120px;
              height: 35px;
              display: block;
              margin-left: auto;
            }
            
            .courier-section {
              margin: 8px 0;
              padding: 6px 0;
              border-bottom: 1px solid #000;
            }
            
            .courier-label {
              font-size: 8px;
              font-weight: bold;
              margin-bottom: 3px;
            }
            
            .courier-barcode {
              text-align: center;
              margin: 5px 0;
            }
            
            .courier-barcode img {
              max-width: 150px;
              height: 45px;
              display: block;
              margin: 0 auto;
            }
            
            .courier-id {
              text-align: center;
              font-size: 8px;
              margin-top: 3px;
            }
            
            .product-section {
              margin: 8px 0;
            }
            
            .product-section h3 {
              font-size: 9px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 8px;
            }
            
            table th {
              background: #f0f0f0;
              border: 1px solid #000;
              padding: 4px;
              text-align: left;
              font-weight: bold;
            }
            
            table td {
              border: 1px solid #000;
              padding: 4px;
              vertical-align: top;
            }
            
            .info-section {
              margin: 10px 0;
            }
            
            .info-section h3 {
              font-size: 9px;
              font-weight: bold;
              margin-bottom: 3px;
            }
            
            .info-section p {
              font-size: 8px;
              line-height: 1.3;
              margin: 1px 0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-top: 8px;
            }
            
            .text-strong {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header Section -->
            <div class="header">
              <div class="recipient-info">
                <h3>To:</h3>
                <p class="text-strong">${courier.toAddress?.name || "Client Name"}</p>
                <p>${formData.toAddress.address}</p>
                <p>Phone: ${formData.toAddress.phone}</p>
              </div>
              <div class="logo-section">
                <img src="/logo-black.png" alt="courierWallah Logo" className="h-8 mx-auto mb-0.5" />
                
              </div>
            </div>
            
            <!-- Order Section -->
            <div class="order-section">
              <div class="order-left">
                <div style="margin-bottom: 5px;">
                  <div class="order-label">Order No:</div>
                  <div class="order-value">${formData.clientInvoice}</div>
                </div>
                <div>
                  <div class="order-label">Order Date:</div>
                  <div class="order-value">${formattedDate}</div>
                </div>
              </div>
              <div class="order-right">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">${shortCode}</div>
                <div class="barcode-section">
                </div>
              </div>
            </div>
            
            <!-- Courier Section -->
            <div class="courier-section">
              <div class="courier-label">Courier Name: ${formData.courierPartner}</div>
              <div class="courier-barcode">
                <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(formData.trackingId)}&scale=2&includetext" alt="Tracking Barcode" onerror="this.style.display='none'" />
                <div class="courier-id">${formData.trackingId}</div>
              </div>
            </div>
            
            <!-- Product Details Section -->
            <div class="product-section">
              <h3>Product Details:</h3>
              <table>
                <thead>
                  <tr>
                    <th style="width: 15%;">SKU</th>
                    <th style="width: 70%;">Item Name</th>
                    <th style="width: 15%;">Qty.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>N/A</td>
                    <td>Package - ${formData.courierDetails.weight}kg (${formData.courierDetails.length}×${formData.courierDetails.width}×${formData.courierDetails.height}cm)</td>
                    <td>${formData.quantity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Information Sections -->
            <div class="info-grid">
              <div class="info-section">
                <h3>Consignor Information:</h3>
                <p class="text-strong">${formData.courierPartner}</p>
                <p>${formData.fromAddress.name}</p>
                <p>Shipping: ${formData.shippingMethod}</p>
                <p>Payment: ${formData.payementType}</p>
              </div>
              
              <div class="info-section">
                <h3>Pickup and Return Address:</h3>
                <p class="text-strong">${formData.courierPartner}</p>
                <p>${formData.fromAddress.name}</p>
              </div>
            </div>
            
            <!-- Financial Details -->
            <div class="info-section" style="margin-top: 10px;">
              <table>
                <tbody>
                  <tr>
                    <td class="text-strong">Invoice Amount:</td>
                    <td>₹${courier.totalAmount || formData.totalAmount}</td>
                  </tr>
                  <tr>
                    <td class="text-strong">Courier Price:</td>
                    <td>${formData.payementType=="Billed"?"Billed":formData.courierPrice}</td>
                  </tr>
                  <tr>
                    <td class="text-strong">Risk Surcharge:</td>
                    <td>${formData.riskSurcharge}</td>
                  </tr>
                  <tr>
                    <td class="text-strong">Risk Factor:</td>
                    <td>${formData.riskfactor}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const invoiceWindow = window.open("", "_blank", "width=450,height=650");
    if (invoiceWindow) {
      const invoiceHTML = generateInvoiceHTML();
      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();
      
      setTimeout(() => {
        invoiceWindow.print();
      }, 500);
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
      
      // Temporarily make the element visible for capture
      const element = invoiceRef.current;
      const originalTop = element.style.top;
      const originalVisibility = element.style.visibility;
      
      element.style.top = '0';
      element.style.visibility = 'visible';
      
      // Wait a bit to ensure all images (barcodes) are loaded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate canvas from the invoice
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000
      });
      
      // Restore original position
      element.style.top = originalTop;
      element.style.visibility = originalVisibility;

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

  const courier = formData.multipleCouriers?.[0] || formData;

  return (
    <div className="w-full">
      {/* Hidden Invoice for Screenshot */}
      <div 
        ref={invoiceRef} 
        className="bg-white border-2 border-black"
        style={{ 
          width: '396px', 
          position: 'fixed',
          top: '-9999px',
          left: '0',
          padding: '12px',
          fontSize: '10px',
          visibility: 'hidden',
          pointerEvents: 'none',
          color: 'black'
        }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-black">
          <div className="flex-1">
            <h3 className="text-[9px] font-bold mb-1">To:</h3>
            <p className="text-[8px] mb-0.5 leading-tight"><strong>{courier.toAddress?.name || "Client Name"}</strong></p>
            <p className="text-[8px] leading-tight mb-0.5">{formData.toAddress.address}</p>
            <p className="text-[8px]">Phone: {formData.toAddress.phone}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <img 
              src="/logo-black.png" 
              alt="courierWallah Logo" 
              className="h-8 mx-auto mb-0.5" 
            />
            
          </div>
        </div>
        
        {/* Order Section */}
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
        
        {/* Courier Section */}
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
        
        {/* Product Details */}
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
                  Package - {formData.courierDetails.weight}kg 
                  ({formData.courierDetails.length}×{formData.courierDetails.width}×{formData.courierDetails.height}cm)
                </td>
                <td className="border border-black p-1">{formData.quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Information Grid */}
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
        
        {/* Financial Details */}
        <div>
          <table className="w-full text-[8px]">
            <tbody>
              <tr className="border border-black">
                <td className="border border-black p-1"><strong>Invoice Amount:</strong></td>
                <td className="border border-black p-1">₹{courier.totalAmount || formData.totalAmount}</td>
              </tr>
              <tr className="border border-black">
                <td className="border border-black p-1"><strong>Courier Price:</strong></td>
                <td className="border border-black p-1">{formData.payementType=="Billed"?"Billed":formData.courierPrice}</td>
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
          variant="secondary"
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