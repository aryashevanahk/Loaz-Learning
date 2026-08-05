/**
 * CourseList Component
 * Menampilkan daftar Course dalam grid
 */

'use client';

import { useState } from 'react';
import { Course } from '../types/course.types';
import { useSemesters } from '@/features/semesters/hooks/useSemesters';
import { CourseItem } from './CourseItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

export function CourseList({
  courses,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: CourseListProps) {
  const { semesters } = useSemesters();
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string | undefined>(undefined);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSemester = !semesterFilter || course.semesterId === semesterFilter;
    
    return matchesSearch && matchesSemester;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading courses...</div>
      </div>
    );
  }

  const handleSemesterFilterChange = (value: string | null) => {
    setSemesterFilter(value === 'all' || value === null ? undefined : value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Courses
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({courses.length})
          </span>
        </h2>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={semesterFilter || 'all'}
            onValueChange={handleSemesterFilterChange}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Filter by semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No courses found</p>
          <p className="text-sm">Click &quot;Add Course&quot; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              onEdit={() => onEdit(course)}
              onDelete={() => onDelete(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}