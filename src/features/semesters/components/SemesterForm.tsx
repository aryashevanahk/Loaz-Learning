/**
 * SemesterForm Component
 * Form untuk menambah atau mengedit semester
 */

import { useState } from 'react';
import { Semester, CreateSemesterDTO, SEMESTER_NAMES, SemesterName } from '../types/semester.types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { X, Save } from 'lucide-react';

// Constants lokal
const ACADEMIC_YEAR_OPTIONS = [
  '2022/2023',
  '2023/2024',
  '2024/2025',
  '2025/2026',
  '2026/2027',
] as const;

interface SemesterFormProps {
  semester?: Semester | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateSemesterDTO) => Promise<void>;
  isLoading?: boolean;
}

// Helper function untuk inisialisasi form data
const getInitialFormData = (semester?: Semester | null): CreateSemesterDTO => {
  if (semester) {
    return {
      name: semester.name,
      semesterNumber: semester.semesterNumber,
      academicYear: semester.academicYear,
      startDate: semester.startDate,
      endDate: semester.endDate,
      isActive: semester.isActive,
    };
  }
  
  return {
    name: SEMESTER_NAMES[0],
    semesterNumber: 1,
    academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    startDate: new Date(),
    endDate: new Date(),
    isActive: false,
  };
};

export function SemesterForm({
  semester,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: SemesterFormProps) {
  // Gunakan state dengan initializer function
  const [formData, setFormData] = useState<CreateSemesterDTO>(() => 
    getInitialFormData(semester)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form ketika semester berubah - dengan useEffect yang hanya reset errors
  // dan gunakan key prop untuk reset formData
  const formKey = semester?.id || 'new';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Semester name is required';
    }

    if (!formData.semesterNumber || formData.semesterNumber < 1 || formData.semesterNumber > 8) {
      newErrors.semesterNumber = 'Semester number must be between 1 and 8';
    }

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    await onSave(formData);
  };

  const handleNameChange = (value: string | null) => {
    if (!value) return;
    const index = SEMESTER_NAMES.indexOf(value as SemesterName);
    setFormData({
      ...formData,
      name: value as SemesterName,
      semesterNumber: index + 1,
    });
  };

  const handleAcademicYearChange = (value: string | null) => {
    if (!value) return;
    setFormData({ ...formData, academicYear: value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      startDate: new Date(e.target.value),
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      endDate: new Date(e.target.value),
    });
  };

  const handleActiveChange = (checked: boolean | string) => {
    setFormData({ ...formData, isActive: checked === true || checked === 'true' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {semester ? 'Edit Semester' : 'Add New Semester'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit} key={formKey}>
          <CardContent className="space-y-4">
            {/* Semester Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Semester Name</Label>
              <Select
                value={formData.name}
                onValueChange={handleNameChange}
              >
                <SelectTrigger id="name">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Academic Year */}
            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select
                value={formData.academicYear}
                onValueChange={handleAcademicYearChange}
              >
                <SelectTrigger id="academicYear">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEAR_OPTIONS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicYear && (
                <p className="text-sm text-red-500">{errors.academicYear}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate.toISOString().split('T')[0]}
                onChange={handleStartDateChange}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate.toISOString().split('T')[0]}
                onChange={handleEndDateChange}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleActiveChange}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Set as active semester
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : semester ? 'Update' : 'Create'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}