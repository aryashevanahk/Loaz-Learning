/**
 * TimetableControls Component
 * Kontrol untuk navigasi dan filter timetable
 */

'use client';

import { useSemesters } from '@/features/semesters/hooks/useSemesters';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface TimetableControlsProps {
  currentDate: Date;
  semesterId?: string;
  onSemesterChange: (id: string | undefined) => void;
  onWeekChange: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

export function TimetableControls({
  currentDate,
  semesterId,
  onSemesterChange,
  onWeekChange,
  onGoToToday,
}: TimetableControlsProps) {
  const { semesters, loading: semestersLoading } = useSemesters();

  // Format tanggal untuk tampilan
  const getWeekRange = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Navigasi Minggu */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onWeekChange('prev')}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToToday}
          className="gap-1"
        >
          <CalendarIcon className="h-4 w-4" />
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onWeekChange('next')}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
          {getWeekRange()}
        </span>
      </div>

      {/* Filter Semester */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={semesterId || 'all'}
          onValueChange={(value: string | null) => onSemesterChange(value === 'all' || !value ? undefined : value)}
          disabled={semestersLoading}
        >
          <SelectTrigger className="w-full sm:w-50">
            <SelectValue placeholder="All Semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name} ({semester.academicYear})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}