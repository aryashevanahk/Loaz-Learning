'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function TimetablePage() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="lg:hidden" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your class schedule</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-500 dark:text-gray-400">Timetable page coming soon...</p>
      </div>
    </div>
  );
}