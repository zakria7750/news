export default function ResearchLoading() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 space-x-reverse mb-8">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>

          {/* Cover Image Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="h-64 md:h-80 bg-gray-200 animate-pulse relative">
              <div className="absolute top-6 right-6 w-20 h-8 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="absolute top-6 left-6 w-24 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Title and Abstract Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          {/* Author Information Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Publication Information Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-3">
                <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
