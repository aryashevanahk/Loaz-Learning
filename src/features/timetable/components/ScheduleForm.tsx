/**
 * ScheduleForm Component
 * Form untuk menambah atau mengedit jadwal
 */

'use client';

import { useState } from 'react';
import { CreateTimetableEventDTO, DAYS_OF_WEEK } from '../types/timetable.types';
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

interface ScheduleFormProps {
  initialData?: Partial<CreateTimetableEventDTO>;
  onSubmit: (data: CreateTimetableEventDTO) => Promise<void>;
  onCancel: () => void;
  courses?: Course[];
  semesterId?: string;
  isLoading?: boolean;
}

export function ScheduleForm({
  initialData,
  onSubmit,
  onCancel,
  courses = [],
  semesterId: defaultSemesterId,
  isLoading = false,
}: ScheduleFormProps) {
  const { semesters } = useSemesters();
  const [formData, setFormData] = useState<CreateTimetableEventDTO>({
    title: initialData?.title || '',
    day: initialData?.day || 'Monday',
    startTime: initialData?.startTime || '08:00',
    endTime: initialData?.endTime || '09:00',
    location: initialData?.location || '',
    instructor: initialData?.instructor || '',
    color: initialData?.color || '#4F46E5',
    notes: initialData?.notes || '',
    courseId: initialData?.courseId || undefined,
    semesterId: initialData?.semesterId || defaultSemesterId || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Handler untuk Select yang menerima string | null
  const handleDayChange = (value: string | null) => {
    if (value) setFormData({ ...formData, day: value });
  };

  const handleCourseChange = (value: string | null) => {
    setFormData({ ...formData, courseId: value === 'none' || !value ? undefined : value });
  };

  const handleSemesterChange = (value: string | null) => {
    setFormData({ ...formData, semesterId: value === 'none' || !value ? undefined : value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Introduction to CS"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>

      {/* Day */}
      <div className="space-y-2">
        <Label htmlFor="day">Day</Label>
        <Select
          value={formData.day}
          onValueChange={handleDayChange}
        >
          <SelectTrigger id="day">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.day && <p className="text-sm text-red-500">{errors.day}</p>}
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
          {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
          {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
        </div>
      </div>

      {/* Course */}
      <div className="space-y-2">
        <Label htmlFor="courseId">Course (Optional)</Label>
        <Select
          value={formData.courseId || 'none'}
          onValueChange={handleCourseChange}
        >
          <SelectTrigger id="courseId">
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
        <Label htmlFor="semesterId">Semester</Label>
        <Select
          value={formData.semesterId || 'none'}
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger id="semesterId">
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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Room 101"
        />
      </div>

      {/* Instructor */}
      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          value={formData.instructor || ''}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          placeholder="e.g., Dr. Smith"
        />
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex items-center gap-3">
          <Input
            id="color"
            type="color"
            value={formData.color || '#4F46E5'}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-16 h-10 p-1"
          />
          <span className="text-sm text-gray-500">{formData.color || '#4F46E5'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData?.title ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}