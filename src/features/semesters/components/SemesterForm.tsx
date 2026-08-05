/**
 * SemesterForm Component
 * Form untuk menambah atau mengedit semester
 */

'use client';

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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { X, Save, Calendar, GraduationCap, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  mode?: 'add' | 'edit';
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
  
  const currentYear = new Date().getFullYear();
  return {
    name: SEMESTER_NAMES[0],
    semesterNumber: 1,
    academicYear: `${currentYear}/${currentYear + 1}`,
    startDate: new Date(currentYear, 7, 1), // 1 Agustus
    endDate: new Date(currentYear + 1, 0, 31), // 31 Januari
    isActive: false,
  };
};

export function SemesterForm({
  semester,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  mode = 'add',
}: SemesterFormProps) {
  // Gunakan key untuk reset form sepenuhnya
  const formKey = `${mode}-${semester?.id || 'new'}-${isOpen ? 'open' : 'closed'}`;
  
  // State diinisialisasi dengan nilai yang benar berdasarkan mode
  const [formData, setFormData] = useState<CreateSemesterDTO>(() => {
    if (mode === 'edit' && semester) {
      return getInitialFormData(semester);
    }
    return getInitialFormData(null);
  });
  
  // Errors di-reset setiap kali formKey berubah (mode atau semester berubah)
  // Tidak perlu useEffect, kita gunakan key untuk reset form
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const isEditing = mode === 'edit';
  const title = isEditing ? 'Edit Semester' : 'Add New Semester';
  const subtitle = isEditing 
    ? `Updating ${semester?.name || 'semester'} information` 
    : 'Create a new academic semester';
  const icon = isEditing ? <GraduationCap className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />;
  const iconBg = isEditing 
    ? 'bg-linear-to-br from-blue-500 to-blue-600' 
    : 'bg-linear-to-br from-green-500 to-emerald-600';
  const buttonText = isEditing ? 'Update Semester' : 'Create Semester';
  const buttonIcon = isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />;
  const shadowColor = isEditing ? 'shadow-blue-500/25' : 'shadow-green-500/25';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <Card 
        key={formKey}
        className="w-full max-w-md mx-4 shadow-2xl border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* ===== HEADER ===== */}
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shadow-lg",
              iconBg,
              shadowColor
            )}>
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </CardHeader>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            {/* Semester Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Semester Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.name}
                onValueChange={handleNameChange}
              >
                <SelectTrigger 
                  id="name" 
                  className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
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
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Academic Year */}
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Academic Year <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.academicYear}
                onValueChange={handleAcademicYearChange}
              >
                <SelectTrigger 
                  id="academicYear"
                  className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
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
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {errors.academicYear}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate.toISOString().split('T')[0]}
                    onChange={handleStartDateChange}
                    className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                {errors.startDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate.toISOString().split('T')[0]}
                    onChange={handleEndDateChange}
                    className="pl-9 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                {errors.endDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleActiveChange}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label 
                htmlFor="isActive" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Set as active semester
              </Label>
              {formData.isActive && (
                <span className="ml-auto text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              )}
            </div>

            {/* Semester Info Summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Semester {formData.semesterNumber}
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.academicYear}
                </span>
              </div>
              {formData.isActive && (
                <Badge variant="default" className="bg-green-500 text-white text-[10px]">
                  Active
                </Badge>
              )}
            </div>
          </CardContent>

          {/* ===== FOOTER ===== */}
          <CardFooter className="flex justify-end gap-2 pt-0 pb-4 border-t border-gray-100 dark:border-gray-800 mt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
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
              {buttonIcon}
              {isLoading ? 'Saving...' : buttonText}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}