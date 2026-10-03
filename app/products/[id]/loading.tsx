export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-pulse">
        <div className="h-4 bg-gray-200 rounded-md w-48 mb-8" />

        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-100 rounded-2xl" />
              <div className="flex gap-3">
                <div className="w-18 h-18 bg-gray-100 rounded-xl" />
                <div className="w-18 h-18 bg-gray-100 rounded-xl" />
                <div className="w-18 h-18 bg-gray-100 rounded-xl" />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-6 w-24 bg-gray-100 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
              </div>

              <div className="h-10 bg-gray-200 rounded-lg w-40 pb-4 border-b border-gray-100" />

              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="h-4 bg-gray-100 rounded w-4/6" />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="h-12 w-32 bg-gray-100 rounded-xl" />
                <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
                <div className="h-12 w-12 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
