export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-4 shadow-xs animate-pulse flex flex-col justify-between">
      <div className="w-full aspect-square rounded-xl bg-gray-100 mb-3" />

      <div className="flex-1 flex flex-col">
        <div className="h-2.5 w-1/3 bg-gray-200 rounded mb-1" />

        <div className="h-3.5 w-4/5 bg-gray-200 rounded mb-2" />

        <div className="h-3 w-1/4 bg-gray-100 rounded mb-2" />

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
