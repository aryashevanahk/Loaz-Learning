/**
 * Semesters Page
 * Halaman untuk mengelola semester
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSemesters } from '@/features/semesters/hooks/useSemesters';
import { SemesterList } from '@/features/semesters/components/SemesterList';
import { SemesterForm } from '@/features/semesters/components/SemesterForm';
import { Semester, CreateSemesterDTO } from '@/features/semesters/types/semester.types';
import { semesterService } from '@/features/semesters/services/semesterService';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function SemestersPage() {
  const {
    semesters,
    loading,
    activeSemester,
    createSemester,
    updateSemester,
    deleteSemester,
    setActiveSemester,
    refreshSemesters,
  } = useSemesters();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize default data jika belum ada
  useEffect(() => {
    semesterService.initializeDefaultData();
    refreshSemesters();
  }, [refreshSemesters]);

  const handleAdd = useCallback(() => {
    setEditingSemester(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((semester: Semester) => {
    setEditingSemester(semester);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      await deleteSemester(id);
    }
  }, [deleteSemester]);

  const handleSave = useCallback(async (data: CreateSemesterDTO) => {
    setIsSaving(true);
    try {
      if (editingSemester) {
        await updateSemester(editingSemester.id, data);
      } else {
        await createSemester(data);
      }
      setIsFormOpen(false);
      setEditingSemester(null);
      refreshSemesters();
    } finally {
      setIsSaving(false);
    }
  }, [editingSemester, createSemester, updateSemester, refreshSemesters]);

  const handleClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingSemester(null);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="lg:hidden" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Semester Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your academic semesters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <SemesterList
          semesters={semesters}
          activeSemester={activeSemester}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetActive={setActiveSemester}
        />

        {/* Form Modal */}
        <SemesterForm
          semester={editingSemester}
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}