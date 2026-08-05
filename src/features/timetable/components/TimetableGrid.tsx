/**
 * TimetableGrid Component
 * Menampilkan jadwal dalam format grid
 */

'use client';

import { TimetableEvent } from '../types/timetable.types';
import { cn } from '@/lib/utils';

interface TimetableGridProps {
  events: TimetableEvent[];
  onEventClick?: (event: TimetableEvent) => void;
  onDeleteEvent?: (id: string) => void;
  onUpdateEvent?: (id: string, data: Partial<TimetableEvent>) => void;
}

export function TimetableGrid({
  events,
  onEventClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDeleteEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpdateEvent,
}: TimetableGridProps) {
  // Dapatkan jam dari events
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getEventForSlot = (day: string, time: string) => {
    return events.find(e => e.day === day && e.startTime <= time && e.endTime > time);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-200">
        {/* Header Hari */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">Time</div>
          {days.map((day) => (
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
              {days.map((day) => {
                const event = getEventForSlot(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className={cn(
                      'min-h-10 rounded-md p-1 transition-all',
                      event 
                        ? 'cursor-pointer hover:opacity-80' 
                        : 'bg-gray-50 dark:bg-gray-800/20'
                    )}
                    style={event ? { backgroundColor: event.color || '#4F46E5' } : {}}
                    onClick={() => event && onEventClick?.(event)}
                  >
                    {event && (
                      <div className="text-[10px] text-white font-medium truncate">
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No events scheduled for this week
          </div>
        )}
      </div>
    </div>
  );
}