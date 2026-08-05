/**
 * CourseItem Component
 * Menampilkan satu item course dalam bentuk card
 */

import { Course } from '../types/course.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, User, Calendar } from 'lucide-react';

interface CourseItemProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

export function CourseItem({ course, onEdit, onDelete }: CourseItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {course.code}
              </h3>
              <Badge variant="outline" className="text-xs">
                {course.credits} Credits
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {course.name}
            </p>
          </div>
          <div
            className="w-4 h-4 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: course.color || '#4F46E5' }}
          />
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {course.instructor && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <User className="h-3.5 w-3.5" />
            <span>{course.instructor}</span>
          </div>
        )}
        {course.schedule && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{course.schedule}</span>
          </div>
        )}
        {course.room && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.room}</span>
          </div>
        )}
        {course.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {course.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(course)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(course.id)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}