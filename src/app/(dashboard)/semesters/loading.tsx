/**
 * Loading state untuk halaman semesters
 */

export default function SemestersLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading semesters...</p>
      </div>
    </div>
  );
}