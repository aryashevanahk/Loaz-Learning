/**
 * TimetableView Component
 * Menampilkan jadwal dalam format grid
 */

'use client';

import { useState } from 'react';
import { TimetableEvent } from '../types/timetable.types';
import { Course } from '@/features/courses/types/course.types';
import { TimetableGrid } from './TimetableGrid';
import { TimetableControls } from './TimetableControls';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TimetableViewProps {
  events: TimetableEvent[];
  currentDate: Date;
  semesterId?: string;
  courses?: Course[];
  onSemesterChange: (id: string | undefined) => void;
  onAddSchedule: () => void;
  onDeleteSchedule: (id: string) => void;
  onUpdateSchedule: (id: string, data: Partial<TimetableEvent>) => void;
  onChangeWeek: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  viewMode?: 'week' | 'month';
}

export function TimetableView({
  events,
  currentDate,
  semesterId,
  courses = [],
  onSemesterChange,
  onAddSchedule,
  onDeleteSchedule,
  onUpdateSchedule,
  onChangeWeek,
  onGoToToday,
  viewMode = 'week',
}: TimetableViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <TimetableControls
          currentDate={currentDate}
          semesterId={semesterId}
          onSemesterChange={onSemesterChange}
          onWeekChange={onChangeWeek}
          onGoToToday={onGoToToday}
        />
        <Button onClick={onAddSchedule} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <TimetableGrid
        events={events}
        courses={courses}
        viewMode={viewMode}
        onEventClick={setSelectedEvent}
        onDeleteEvent={onDeleteSchedule}
        onUpdateEvent={onUpdateSchedule}
      />
    </div>
  );
}