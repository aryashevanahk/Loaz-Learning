/**
 * TimetableGrid Component
 * Menampilkan jadwal dalam format grid
 */

'use client';

import { TimetableEvent } from '../types/timetable.types';
import { Course } from '@/features/courses/types/course.types';
import { cn } from '@/lib/utils';

interface TimetableGridProps {
  events: TimetableEvent[];
  courses?: Course[];
  viewMode?: 'week' | 'month';
  onEventClick?: (event: TimetableEvent) => void;
  onDeleteEvent?: (id: string) => void;
  onUpdateEvent?: (id: string, data: Partial<TimetableEvent>) => void;
}

export function TimetableGrid({
  events,
  courses = [],
  viewMode = 'week',
  onEventClick,
}: TimetableGridProps) {
  // Dapatkan jam dari events
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper untuk mendapatkan course info
  const getCourseInfo = (courseId?: string) => {
    if (!courseId) return null;
    return courses.find(c => c.id === courseId) || null;
  };

  const getEventForSlot = (day: string, time: string) => {
    return events.find(e => e.day === day && e.startTime <= time && e.endTime > time);
  };

  // Filter days based on view mode
  const displayDays = viewMode === 'week' ? days : days.slice(0, 5);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-200">
        {/* Header Hari */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">Time</div>
          {displayDays.map((day) => (
            <div key={day} className="p-2 text-xs font-medium text-center text-gray-700 dark:text-gray-300">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Grid Jadwal */}
        <div className="space-y-1">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1">
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                {time}
              </div>
              {displayDays.map((day) => {
                const event = getEventForSlot(day, time);
                const course = event ? getCourseInfo(event.courseId) : null;
                const displayTitle = event?.title || '';
                const displaySub = course ? course.code : (event?.location || '');

                return (
                  <div
                    key={`${day}-${time}`}
                    className={cn(
                      'min-h-12 rounded-md p-1 transition-all',
                      event 
                        ? 'cursor-pointer hover:opacity-80 hover:scale-[1.02]' 
                        : 'bg-gray-50 dark:bg-gray-800/20'
                    )}
                    style={event ? { backgroundColor: event.color || '#4F46E5' } : {}}
                    onClick={() => event && onEventClick?.(event)}
                  >
                    {event && (
                      <div className="flex flex-col h-full">
                        <div className="text-[10px] text-white font-medium truncate">
                          {displayTitle}
                        </div>
                        {displaySub && (
                          <div className="text-[8px] text-white/80 truncate">
                            {displaySub}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No events scheduled</p>
            <p className="text-sm">Click &quot;Add Event&quot; to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}