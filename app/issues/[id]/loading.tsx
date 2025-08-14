export default function IssueLoading() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Issue Header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="text-center">
              <div className="bg-gray-200 h-12 w-48 rounded-full mx-auto mb-6 animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-96 rounded mx-auto mb-4 animate-pulse"></div>
              <div className="bg-gray-200 h-6 w-full max-w-3xl rounded mx-auto mb-6 animate-pulse"></div>
              <div className="flex items-center justify-center space-x-6 space-x-reverse">
                <div className="bg-gray-200 h-5 w-32 rounded animate-pulse"></div>
                <div className="bg-gray-200 h-5 w-24 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Section Header Skeleton */}
          <div className="mb-8">
            <div className="bg-gray-200 h-8 w-48 rounded mb-2 animate-pulse"></div>
            <div className="bg-gray-200 h-5 w-80 rounded animate-pulse"></div>
          </div>

          {/* Research Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Cover Skeleton */}
                <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>

                {/* Content Skeleton */}
                <div className="p-6">
                  <div className="bg-gray-200 h-6 w-full rounded mb-3 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full rounded mb-2 animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-4 animate-pulse"></div>

                  {/* Author Skeleton */}
                  <div className="flex items-center space-x-3 space-x-reverse mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-4 w-32 rounded mb-1 animate-pulse"></div>
                      <div className="bg-gray-200 h-3 w-24 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Buttons Skeleton */}
                  <div className="flex space-x-3 space-x-reverse">
                    <div className="flex-1 bg-gray-200 h-10 rounded-lg animate-pulse"></div>
                    <div className="flex-1 bg-gray-200 h-10 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button Skeleton */}
          <div className="mt-12 text-center">
            <div className="bg-gray-200 h-12 w-40 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
