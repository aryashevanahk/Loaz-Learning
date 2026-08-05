/**
 * SemesterList Component
 * Menampilkan daftar semester dalam grid
 */

'use client';

import { useState } from 'react';
import { Semester } from '../types/semester.types';
import { SemesterItem } from './SemesterItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Layers } from 'lucide-react';

interface SemesterListProps {
  semesters: Semester[];
  activeSemester: Semester | null;
  loading: boolean;
  onAdd: () => void;
  onEdit: (semester: Semester) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function SemesterList({
  semesters,
  activeSemester,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSetActive,
}: SemesterListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredSemesters = semesters.filter((semester) => {
    const matchesSearch = semester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      semester.academicYear.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterActive === 'all' ||
      (filterActive === 'active' && semester.isActive) ||
      (filterActive === 'inactive' && !semester.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading semesters...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER DENGAN KONTROL ===== */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Semesters
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({semesters.length})
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage your academic semesters
          </p>
        </div>
        <Button 
          onClick={onAdd} 
          className="gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Semester
        </Button>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search semesters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('all')}
            className={filterActive === 'all' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : ''}
          >
            All
          </Button>
          <Button
            variant={filterActive === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('active')}
            className={filterActive === 'active' ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : ''}
          >
            Active
          </Button>
          <Button
            variant={filterActive === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('inactive')}
            className={filterActive === 'inactive' ? 'bg-gray-500 text-white shadow-lg shadow-gray-500/25' : ''}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* ===== GRID SEMESTER ===== */}
      {filteredSemesters.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
            <Layers className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">No semesters found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {searchQuery ? 'Try adjusting your search or filter' : 'Click "Add Semester" to create one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSemesters.map((semester) => (
            <SemesterItem
              key={semester.id}
              semester={semester}
              isActive={activeSemester?.id === semester.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetActive={onSetActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}