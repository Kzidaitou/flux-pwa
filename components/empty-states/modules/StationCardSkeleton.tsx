export const StationCardSkeleton = () => (
  <div className="bg-surface/40 border border-gray-800/50 rounded-2xl p-4 h-44 animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-3">
        <div className="h-5 w-32 bg-gray-700/50 rounded"></div>
        <div className="h-3 w-48 bg-gray-800/50 rounded"></div>
        <div className="h-3 w-24 bg-gray-800/50 rounded"></div>
      </div>
      <div className="h-6 w-14 bg-gray-700/50 rounded-lg"></div>
    </div>
    <div className="flex justify-between items-center mt-6">
      <div className="flex gap-4">
        <div className="h-8 w-10 bg-gray-800/50 rounded"></div>
        <div className="h-8 w-10 bg-gray-800/50 rounded"></div>
      </div>
      <div className="h-10 w-24 bg-gray-700/50 rounded-xl"></div>
    </div>
  </div>
)