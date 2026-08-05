/**
 * CourseForm Component
 * Form untuk menambah atau mengedit Course
 */

'use client';

import { useState } from 'react';
import { Course, CreateCourseDTO } from '../types/course.types';
import { useSemesters } from '@/features/semesters/hooks/useSemesters';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { X, Save } from 'lucide-react';

interface CourseFormProps {
  course?: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateCourseDTO) => Promise<void>;
  isLoading?: boolean;
}

const getInitialFormData = (course?: Course | null): CreateCourseDTO => {
  if (course) {
    return {
      code: course.code,
      name: course.name,
      description: course.description || '',
      credits: course.credits,
      semesterId: course.semesterId,
      instructor: course.instructor || '',
      schedule: course.schedule || '',
      room: course.room || '',
      color: course.color || '#4F46E5',
    };
  }
  
  return {
    code: '',
    name: '',
    description: '',
    credits: 3,
    semesterId: undefined,
    instructor: '',
    schedule: '',
    room: '',
    color: '#4F46E5',
  };
};

export function CourseForm({
  course,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: CourseFormProps) {
  const { semesters } = useSemesters();
  const [formData, setFormData] = useState<CreateCourseDTO>(() => 
    getInitialFormData(course)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reset form ketika course berubah - menggunakan key di Card
  // Hapus useEffect yang tidak digunakan

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Course code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Course name is required';
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = 'Credits must be between 1 and 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  const handleSemesterChange = (value: string | null) => {
    setFormData({ 
      ...formData, 
      semesterId: value === 'none' || value === null ? undefined : value 
    });
  };

  // Key untuk reset form ketika course berubah
  const formKey = course?.id || 'new';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card key={formKey} className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Course Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., CS101"
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>

            {/* Course Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Introduction to Computer Science"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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

            {/* Credits */}
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min={1}
                max={6}
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
              />
              {errors.credits && <p className="text-sm text-red-500">{errors.credits}</p>}
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

            {/* Schedule */}
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={formData.schedule || ''}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="e.g., Mon/Wed 08:00-10:00"
              />
            </div>

            {/* Room */}
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room || ''}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., Room 101"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : course ? 'Update' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}