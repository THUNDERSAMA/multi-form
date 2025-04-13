import { useBarcode } from "next-barcode"
import Image from "next/image"
interface PODTemplateProps {
  courier: {
    ids: string
    customerName: string
    pickupAddress: string
    pincode: string
    deliveryAddress: string
    packageType: string
    status: string
    date: string
    time: string
    price: string
  }
}

export function PODTemplate({ courier }: PODTemplateProps) {
    console.log(courier)
  const { inputRef } = useBarcode({
    value: courier.ids,
    options: {
      background: "#ffffff",
      width: 2,
      height: 50,
      displayValue: true,
      font: "monospace",
      fontSize: 20,
      margin: 5,
    },
  })

  return (
    <div className="bg-white p-4 border rounded-lg w-full max-w-4xl mx-auto">
      <div className="pod-template border border-blue-700 p-0">
        {/* Header */}
        <div className="flex border-b border-blue-700">
          <div className="w-1/3 p-2 border-r border-blue-700">
            <h2 className="text-2xl font-bold text-blue-700">DELIVERY NOTE (POD)</h2>
            <Image
              src="/logo-black.png"
                alt="Logo"
                width={100}
                height={50}
                className="h-12 w-auto"
            />
          </div>
          <div className="w-1/3 p-2 border-r border-blue-700">
            <div className="text-xs text-blue-700 font-semibold mb-1">COURIER PARTNER</div>
            <div className="flex justify-center items-center h-12">
              <svg ref={inputRef} />
            </div>
          </div>
          <div className="w-1/3 p-2">
            <div className="text-xs text-blue-700 font-semibold mb-1">CONSIGNMENT NOTE NUMBER</div>
            <div className="text-center font-bold text-gray-950">{courier.ids}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Column - Sender/Receiver */}
          <div className="w-1/2 border-r border-blue-700">
            {/* FROM Section */}
            <div className="border-b border-blue-700">
              <div className="flex p-2">
                <div className="text-blue-700 font-bold">FROM</div>
                <div className="text-blue-700 text-xs ml-1">(Sender)</div>
                <div className="ml-auto text-blue-700 text-xs">PLEASE USE BLOCK CAPITALS</div>
              </div>

              <div className="px-2 pb-2">
                <div className="mb-2">
                  <div className="text-xs text-blue-700">Name</div>
                  <div className="border-b border-blue-700 py-1 text-gray-950">{courier.customerName}</div>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-blue-700">Address</div>
                  <div className="border-b border-blue-700 py-1 text-gray-950">{courier.pickupAddress}</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/2 pr-2">
                    <div className="text-xs text-blue-700">Pincode</div>
                    <div className="flex text-gray-950">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={`from-post1-${i}`}
                            className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                          >
                            {courier.pincode.slice(-7, -3)[i] || ""}
                          </div>
                        ))}
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={`from-post2-${i}`}
                            className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                          >
                            {courier.pincode.slice(-3)[i] || ""}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-blue-700">Telephone</div>
                  <div className="flex text-gray-950">
                    {Array(12)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`from-tel-${i}`}
                          className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                        >
                          {"1234567890".charAt(i) || ""}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TO Section */}
            <div className="border-b border-blue-700">
              <div className="flex p-2">
                <div className="text-blue-700 font-bold">TO</div>
                <div className="text-blue-700 text-xs ml-1">(Receiver)</div>
                <div className="ml-auto text-blue-700 text-xs">PLEASE USE BLOCK CAPITALS</div>
              </div>

              <div className="px-2 pb-2">
                <div className="mb-2">
                  <div className="text-xs text-blue-700">Name</div>
                  <div className="border-b border-blue-700 py-1 text-gray-950">Receiver Name</div>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-blue-700">Address</div>
                  <div className="border-b border-blue-700 py-1 text-gray-950">{courier.deliveryAddress}</div>
                </div>

                <div className="flex mb-2">
                  <div className="w-1/2 pr-2">
                    <div className="text-xs text-blue-700">Pincode</div>
                    <div className="flex text-gray-950">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={`to-post1-${i}`}
                            className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                          >
                            {courier.pincode.slice(-7, -3)[i] || ""}
                          </div>
                        ))}
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={`to-post2-${i}`}
                            className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                          >
                            {courier.pincode.slice(-3)[i] || ""}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-blue-700">Telephone</div>
                  <div className="flex text-gray-950">
                    {Array(12)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={`to-tel-${i}`}
                          className="w-8 h-8 border border-blue-700 mr-1 flex items-center justify-center"
                        >
                          {"0987654321".charAt(i) || ""}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sender's Name and Signature */}
            <div className="flex flex-col h-full ">
              <div className="px-2 py-1">
                <div className="text-xs text-blue-700 font-semibold">SENDER'S NAME (PLEASE PRINT)</div>
                <div className="border-b border-blue-700 h-8 mb-2 text-gray-950">{courier.customerName}</div>

                <div className="text-xs text-blue-700 font-semibold">SENDER'S SIGNATURE</div>
                <div className="border-b border-blue-700 h-8 mb-2"></div>
              </div>
              <div className="flex justify-between flex-col h-80 ">
              <div className="text-xs p-2 border-t border-blue-700 text-gray-950">
              <div className="flex justify-center items-center ">
              <svg ref={inputRef} className=""/>
            </div>
              
              </div>
              <div className="text-xs text-gray-700 font-semibold p-2 border-t border-blue-700">
              ALL BUSINESS UNDERTAKEN IS SUBJECT TO OUR CONDITIONS OF TRADING - COPIES OF WHICH ARE AVAILABLE UPON
              REQUEST
              </div>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Options */}
          <div className="w-1/2">
            {/* Delivery Options */}
            <div className="flex border-b border-blue-700">
              <div className="w-1/2 border-r border-blue-700">
                <div className="p-2 text-blue-700 font-bold text-center ">NEXTDAY DELIVERY OPTIONS</div>

                <div className="border-t border-blue-700 p-2 text-gray-950">NEXT WORKING DAY DELIVERY</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">NEXT WORKING DAY - BEFORE NOON</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">NEXT WORKING DAY - BEFORE 10.30</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">NEXT WORKING DAY - BEFORE 9.00</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">SATURDAY DELIVERY - BEFORE NOON</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">SATURDAY DELIVERY - BEFORE 10.30</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">SATURDAY DELIVERY - BEFORE 9.00</div>
              </div>

              <div className="w-1/2">
                <div className="p-2 text-blue-700 font-bold text-center">SAMEDAY DELIVERY OPTIONS</div>

                <div className="border-t border-blue-700 p-2 text-gray-950">DEDICATED VEHICLE</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">NETWORK SERVICES</div>
                <div className="border-t border-blue-700 p-2 text-gray-950">OTHER SERVICES (please specify)</div>

                <div className="border-t border-blue-700 p-2 h-24"></div>

                <div className="border-t border-blue-700 p-2">
                  <div className="text-blue-700 font-semibold">
                    MODE
                  </div>
                  <div className="m-2 p-2 flex  flex-col">
                    <div className="flex  items-center mb-4">
    <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-950">Surface</label>
</div>
<div className="flex items-center">
    <input checked id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
    <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-950">Express</label>
</div></div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="border-b border-blue-700 p-2">
              <div className="text-blue-700 font-bold">SPECIAL INSTRUCTIONS</div>
              <div className="h-20 text-gray-950">{courier.packageType}</div>
            </div>

            {/* Bottom Section */}
            <div className="flex">
              <div className="w-1/3">
                <div className="p-2 border-r border-blue-700">
                  <div className="text-blue-700 font-semibold text-center">CUSTOMER REFERENCE</div>
                  <div className="h-16 flex items-center justify-center text-gray-950">{courier.ids}</div>
                </div>

                <div className="flex border-t border-blue-700">
                  <div className="w-1/2 p-2 border-r border-blue-700">
                    <div className="text-blue-700 font-semibold text-center">WEIGHT(KG)</div>
                    <div className="h-16 flex items-center justify-center">2.5</div>
                  </div>

                  <div className="w-1/2 p-2 border-r border-blue-700">
                    <div className="text-blue-700 font-semibold text-center">NO. OF ITEMS</div>
                    <div className="h-16 flex items-center justify-center">1</div>
                  </div>
                </div>

                <div className="p-2 border-t border-r border-blue-700">
                  <div className="text-blue-700 font-semibold text-center">DESCRIPTION</div>
                  <div className="h-16 flex items-center justify-center text-gray-950">{courier.packageType}</div>
                </div>
              </div>

              <div className="w-2/3 p-2">
              <div className="text-blue-700 font-semibold mb-4">RECEIVED IN GOOD CONDITION</div>
              <div className="text-blue-700 font-semibold mb-4">
                  STAMP ........................................................
                </div>
                <div className="text-blue-700 font-semibold mb-4">
                  SIGNED ................................................................
                </div>
                
                
                <div className="text-blue-700 font-semibold mb-4">
                  DATE ................................................................
                </div>
                <div className="text-blue-700 font-semibold">
                  TIME ................................................................
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PODTemplate
