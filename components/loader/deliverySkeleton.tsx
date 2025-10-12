export default function DeliveryCardSkeleton() {
  return (
    <div className="max-w-sm bg-gray-600 rounded-lg shadow-lg p-5 animate-pulse">
      {/* Header section with title and status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-700 rounded-full w-20 ml-2"></div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-gray-700 rounded-full mr-2"></div>
        <div className="h-3 bg-gray-700 rounded w-32"></div>
      </div>

      {/* From section */}
      <div className="mb-4">
        <div className="h-3 bg-gray-700 rounded w-12 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>

      {/* Package and Partner info */}
      <div className="flex gap-8 mb-5">
        <div>
          <div className="h-3 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div>
          <div className="h-3 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-28"></div>
        </div>
      </div>

      {/* Bottom section with price and buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="h-8 bg-green-700 rounded w-16"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}