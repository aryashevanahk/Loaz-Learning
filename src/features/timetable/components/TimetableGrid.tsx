/**
 * TimetableGrid Component
 * Menampilkan jadwal dalam format grid
 */

'use client';

import { TimetableEvent, DAYS_OF_WEEK, TIME_SLOTS } from '../types/timetable.types';
import { Course } from '@/features/courses/types/course.types';
import { cn } from '@/lib/utils';
import { Clock, MapPin, BookOpen, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  onDeleteEvent,
  onUpdateEvent,
}: TimetableGridProps) {
  // Helper untuk mendapatkan course info
  const getCourseInfo = (courseId?: string) => {
    if (!courseId) return null;
    return courses.find(c => c.id === courseId) || null;
  };

  const getEventForSlot = (day: string, time: string) => {
    return events.find(e => e.day === day && e.startTime <= time && e.endTime > time);
  };

  // Filter days based on view mode
  const displayDays = viewMode === 'week' ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);

  // Filter time slots
  const displayTimeSlots = TIME_SLOTS.filter((_, index) => index % 2 === 0);

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
          <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">No events scheduled</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Click &quot;Add Event&quot; to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-200">
        {/* Header Hari */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">Time</div>
          {displayDays.map((day) => (
            <div 
              key={day} 
              className={cn(
                'p-2 text-xs font-medium text-center rounded-t-lg',
                'text-gray-700 dark:text-gray-300',
                new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day &&
                'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              )}
            >
              {day.slice(0, 3)}
              <span className="block text-[10px] font-normal text-gray-400 dark:text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day.slice(0, 3) ? 'Today' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Grid Jadwal */}
        <div className="space-y-1">
          {displayTimeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1">
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                {time}
              </div>
              {displayDays.map((day) => {
                const event = getEventForSlot(day, time);
                const course = event ? getCourseInfo(event.courseId) : null;
                
                return (
                  <div
                    key={`${day}-${time}`}
                    className={cn(
                      'min-h-12 rounded-md p-1.5 transition-all duration-200 relative group',
                      event 
                        ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md' 
                        : 'bg-gray-50/50 dark:bg-gray-800/10'
                    )}
                    style={event ? { backgroundColor: event.color || '#4F46E5' } : {}}
                    onClick={() => event && onEventClick?.(event)}
                  >
                    {event && (
                      <>
                        <div className="flex flex-col h-full gap-0.5 pr-6">
                          <div className="text-[11px] text-white font-medium truncate leading-tight">
                            {event.title}
                          </div>
                          {course && (
                            <div className="text-[9px] text-white/80 truncate flex items-center gap-0.5">
                              <BookOpen className="h-2.5 w-2.5" />
                              {course.code}
                            </div>
                          )}
                          {event.location && (
                            <div className="text-[8px] text-white/70 truncate flex items-center gap-0.5">
                              <MapPin className="h-2 w-2" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {/* Action Menu - muncul di hover */}
                        {(onDeleteEvent || onUpdateEvent) && (
                          <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-5 w-5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                                <MoreVertical className="h-3 w-3" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onEventClick) {
                                      onEventClick(event);
                                    }
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                {onDeleteEvent && (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteEvent(event.id);
                                    }}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}