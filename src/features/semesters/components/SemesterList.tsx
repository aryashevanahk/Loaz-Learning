/**
 * SemesterList Component
 * Menampilkan daftar semester dalam grid
 */

import { Semester } from '../types/semester.types';
import { SemesterItem } from './SemesterItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

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
      {/* Header dengan kontrol */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Semesters
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({semesters.length})
          </span>
        </h2>
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Semester
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search semesters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('all')}
          >
            All
          </Button>
          <Button
            variant={filterActive === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('active')}
          >
            Active
          </Button>
          <Button
            variant={filterActive === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Grid Semester */}
      {filteredSemesters.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No semesters found</p>
          <p className="text-sm">Click &quot;Add Semester&quot; to create one.</p>
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