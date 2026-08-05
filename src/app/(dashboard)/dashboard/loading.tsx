export default function DashboardLoading() {
  return (
    <div className="flex flex-col justify-center items-center h-96 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
        Loading dashboard...
      </p>
    </div>
  );
}