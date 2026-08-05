/**
 * ScheduleForm Component
 * Form untuk menambah atau mengedit jadwal
 * Konsisten dengan SemesterForm
 */

'use client';

import { useState } from 'react';
import { CreateTimetableEventDTO, DAYS_OF_WEEK, COLOR_PRESETS } from '../types/timetable.types';
import { Course } from '@/features/courses/types/course.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSemesters } from '@/features/semesters/hooks/useSemesters';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleFormProps {
  initialData?: Partial<CreateTimetableEventDTO> & { id?: string };
  onSubmit: (data: CreateTimetableEventDTO) => Promise<void>;
  onCancel: () => void;
  courses?: Course[];
  semesterId?: string;
  isLoading?: boolean;
  mode?: 'add' | 'edit';
}

const getInitialData = (data?: Partial<CreateTimetableEventDTO> & { id?: string }, defaultSemesterId?: string): CreateTimetableEventDTO => ({
  title: data?.title || '',
  day: data?.day || 'Monday',
  startTime: data?.startTime || '08:00',
  endTime: data?.endTime || '09:00',
  location: data?.location || '',
  instructor: data?.instructor || '',
  color: data?.color || COLOR_PRESETS[0],
  notes: data?.notes || '',
  courseId: data?.courseId || undefined,
  semesterId: data?.semesterId || defaultSemesterId || undefined,
});

export function ScheduleForm({
  initialData,
  onSubmit,
  onCancel,
  courses = [],
  semesterId: defaultSemesterId,
  isLoading = false,
  mode = 'add',
}: ScheduleFormProps) {
  const { semesters } = useSemesters();
  
  // Gunakan key untuk reset form, bukan useEffect dengan setState
  const formKey = `${mode}-${initialData?.id || 'new'}-${initialData?.title || ''}`;
  
  // State diinisialisasi dengan nilai yang benar berdasarkan mode
  const [formData, setFormData] = useState<CreateTimetableEventDTO>(() => {
    if (mode === 'edit' && initialData) {
      return getInitialData(initialData, defaultSemesterId);
    }
    return getInitialData(undefined, defaultSemesterId);
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset errors ketika mode atau initialData berubah
  // Tidak perlu useEffect untuk setFormData karena kita menggunakan key

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.day) {
      newErrors.day = 'Day is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleDayChange = (value: string | null) => {
    if (value) setFormData({ ...formData, day: value });
  };

  const handleCourseChange = (value: string | null) => {
    setFormData({ ...formData, courseId: value === 'none' || !value ? undefined : value });
  };

  const handleSemesterChange = (value: string | null) => {
    setFormData({ ...formData, semesterId: value === 'none' || !value ? undefined : value });
  };

  const isEditing = mode === 'edit';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" key={formKey}>
      {/* Header Info */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          isEditing ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
        )}>
          <Calendar className={cn(
            'h-4 w-4',
            isEditing ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
          )} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isEditing ? 'Update existing schedule' : 'Add to your timetable'}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Event Title <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Introduction to CS"
            className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {errors.title && <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {errors.title}
        </p>}
      </div>

      {/* Day */}
      <div className="space-y-2">
        <Label htmlFor="day" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Day <span className="text-red-500">*</span>
        </Label>
        <Select value={formData.day} onValueChange={handleDayChange}>
          <SelectTrigger id="day" className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.day && <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {errors.day}
        </p>}
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Start <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            />
          </div>
          {errors.startTime && <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {errors.startTime}
          </p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            End <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            />
          </div>
          {errors.endTime && <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
            {errors.endTime}
          </p>}
        </div>
      </div>

      {/* Course */}
      <div className="space-y-2">
        <Label htmlFor="courseId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Course
        </Label>
        <Select value={formData.courseId || 'none'} onValueChange={handleCourseChange}>
          <SelectTrigger id="courseId" className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Course</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester */}
      <div className="space-y-2">
        <Label htmlFor="semesterId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Semester
        </Label>
        <Select value={formData.semesterId || 'none'} onValueChange={handleSemesterChange}>
          <SelectTrigger id="semesterId" className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Semester</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name} ({semester.academicYear})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Room 101"
            className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Instructor */}
      <div className="space-y-2">
        <Label htmlFor="instructor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Instructor
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="instructor"
            value={formData.instructor || ''}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g., Dr. Smith"
            className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                formData.color === color 
                  ? 'border-blue-500 ring-2 ring-blue-500/50' 
                  : 'border-transparent hover:border-gray-300'
              )}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
          <div className="relative">
            <Input
              type="color"
              value={formData.color || COLOR_PRESETS[0]}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-10 h-8 p-0 border-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </Label>
        <Input
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className={cn(
            "text-white shadow-lg transition-all gap-2",
            isEditing 
              ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25" 
              : "bg-green-500 hover:bg-green-600 shadow-green-500/25"
          )}
        >
          <Calendar className="h-4 w-4" />
          {isLoading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}