'use client';

import { TimetableEvent, DAYS_OF_WEEK } from '../types/timetable.types';

interface TimetableGridProps {
  events: TimetableEvent[];
  currentDate: Date;
  onEditEvent: (event: TimetableEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export function TimetableGrid({ events, onEditEvent, onDeleteEvent }: TimetableGridProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 7);

  const getEventsForDayAndHour = (day: string, hour: number) => {
    return events.filter(event => {
      const eventDay = new Date(event.start).toLocaleDateString('id-ID', { weekday: 'long' });
      const eventHour = event.start.getHours();
      return eventDay === day && eventHour === hour;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-200">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-tl-lg font-semibold text-sm text-gray-500 dark:text-gray-400">
            Waktu
          </div>
          {DAYS_OF_WEEK.map(day => (
            <div 
              key={day} 
              className="p-2 text-center font-semibold bg-gray-100 dark:bg-gray-700 dark:text-white text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 text-right pr-4 flex items-center justify-end">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            {DAYS_OF_WEEK.map(day => {
              const dayEvents = getEventsForDayAndHour(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="min-h-15 p-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded relative"
                >
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity relative group mb-1 last:mb-0"
                      style={{ backgroundColor: event.color || '#4F46E5' }}
                      onClick={() => onEditEvent(event)}
                      title={event.description || event.title}
                    >
                      <div className="font-semibold text-white truncate text-[10px]">{event.title}</div>
                      <div className="text-white opacity-75 text-[8px]">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      {event.location && (
                        <div className="text-white opacity-50 text-[8px] truncate">📍 {event.location}</div>
                      )}
                      <button
                        className="absolute -top-1 -right-1 text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Hapus jadwal ini?')) {
                            onDeleteEvent(event.id);
                          }
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}