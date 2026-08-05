/**
 * SemesterItem Component
 * Menampilkan satu item semester dalam bentuk card
 */

'use client';

import { Semester } from '../types/semester.types';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Edit, Trash2, CheckCircle, Calendar, BookOpen } from 'lucide-react';

interface SemesterItemProps {
  semester: Semester;
  isActive?: boolean;
  onEdit: (semester: Semester) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function SemesterItem({
  semester,
  isActive = false,
  onEdit,
  onDelete,
  onSetActive,
}: SemesterItemProps) {
  const getStatusColor = () => {
    if (semester.isActive) return 'bg-green-500';
    const now = new Date();
    if (now < semester.startDate) return 'bg-yellow-500';
    if (now > semester.endDate) return 'bg-gray-400';
    return 'bg-blue-500';
  };

  const getStatusText = () => {
    if (semester.isActive) return 'Active';
    const now = new Date();
    if (now < semester.startDate) return 'Upcoming';
    if (now > semester.endDate) return 'Completed';
    return 'In Progress';
  };

  const getStatusBadgeVariant = () => {
    if (semester.isActive) return 'default';
    const now = new Date();
    if (now < semester.startDate) return 'secondary';
    if (now > semester.endDate) return 'outline';
    return 'secondary';
  };

  return (
    <Card className={cn(
      'group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
      'bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50',
      isActive && 'ring-2 ring-blue-500/50 dark:ring-blue-400/50 shadow-lg shadow-blue-500/10'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {semester.name}
              </h3>
              <Badge variant={getStatusBadgeVariant()} className="shrink-0">
                {getStatusText()}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {semester.academicYear}
            </p>
          </div>
          <div className={cn(
            'h-3 w-3 rounded-full shrink-0 mt-1.5',
            getStatusColor()
          )} />
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="truncate">
            {formatDate(semester.startDate)} — {formatDate(semester.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <BookOpen className="h-4 w-4 text-gray-400 shrink-0" />
          <span>Semester {semester.semesterNumber}</span>
          {semester.isActive && (
            <Badge variant="outline" className="ml-auto text-[10px] text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
              Active
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 pt-0">
        {!semester.isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetActive(semester.id)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 gap-1"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Set Active
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(semester)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 gap-1"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(semester.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}