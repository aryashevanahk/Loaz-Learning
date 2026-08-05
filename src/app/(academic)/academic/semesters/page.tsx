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
import { Sparkles, Layers } from 'lucide-react';

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
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  // Initialize default data jika belum ada
  useEffect(() => {
    semesterService.initializeDefaultData();
    refreshSemesters();
  }, [refreshSemesters]);

  const handleAdd = useCallback(() => {
    setEditingSemester(null);
    setFormMode('add');
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((semester: Semester) => {
    setEditingSemester(semester);
    setFormMode('edit');
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
      if (formMode === 'edit' && editingSemester) {
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
  }, [editingSemester, formMode, createSemester, updateSemester, refreshSemesters]);

  const handleClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingSemester(null);
    setFormMode('add');
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Loading semesters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    Semester Management
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Manage your academic semesters
                  </p>
                </div>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  Semesters
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="px-6 py-6">
        <SemesterList
          semesters={semesters}
          activeSemester={activeSemester}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSetActive={setActiveSemester}
        />

        {/* ===== FORM MODAL ===== */}
        <SemesterForm
          semester={editingSemester}
          isOpen={isFormOpen}
          onClose={handleClose}
          onSave={handleSave}
          isLoading={isSaving}
          mode={formMode}
        />
      </div>
    </div>
  );
}