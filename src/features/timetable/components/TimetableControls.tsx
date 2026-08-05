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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableControlsProps {
  currentDate: Date;
  semesterId?: string;
  onSemesterChange: (id: string | undefined) => void;
  onWeekChange: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  className?: string;
}

export function TimetableControls({
  currentDate,
  semesterId,
  onSemesterChange,
  onWeekChange,
  onGoToToday,
  className,
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

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full', className)}>
      {/* Navigasi Minggu */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onWeekChange('prev')}
          className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant={isToday() ? 'default' : 'outline'}
          size="sm"
          onClick={onGoToToday}
          className={cn(
            'gap-1.5 rounded-lg transition-all',
            isToday() && 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          Today
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onWeekChange('next')}
          className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 min-w-50">
          {getWeekRange()}
        </span>
      </div>

      {/* Filter Semester */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
        <Select
          value={semesterId || 'all'}
          onValueChange={(value: string | null) => onSemesterChange(value === 'all' || !value ? undefined : value)}
          disabled={semestersLoading}
        >
          <SelectTrigger className="w-full sm:w-50 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all">
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