
export const HistoryItemSkeleton = () => (
  <div className="bg-gray-100/50 dark:bg-surface/50 border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex items-center justify-between h-20 animate-pulse">
    <div className="space-y-2">
      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
    </div>
    <div className="space-y-2 flex flex-col items-end">
      <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 w-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
)