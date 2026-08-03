'use client';

import { useState } from 'react';
import { Course, CourseInput } from '../types/course.types';
import { CourseItem } from './CourseItem';
import { CourseForm } from './CourseForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface CourseListProps {
  courses: Course[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: CourseInput) => void;
}

export function CourseList({ courses, onDelete, onUpdate }: CourseListProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.category === filter;
  });

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
  };

  const handleUpdate = async (data: CourseInput) => {
    if (editingCourse) {
      await onUpdate(editingCourse.id, data);
      setEditingCourse(null);
    }
  };

  // Hitung jumlah per kategori
  const counts = {
    all: courses.length,
    Tugas: courses.filter(c => c.category === 'Tugas').length,
    Materi: courses.filter(c => c.category === 'Materi').length,
    UTS: courses.filter(c => c.category === 'UTS').length,
    UAS: courses.filter(c => c.category === 'UAS').length,
  };

  return (
    <div>
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Semua ({counts.all})
        </Button>
        <Button 
          variant={filter === 'Tugas' ? 'primary' : 'secondary'}
          onClick={() => setFilter('Tugas')}
          size="sm"
        >
          Tugas ({counts.Tugas})
        </Button>
        <Button 
          variant={filter === 'Materi' ? 'primary' : 'secondary'}
          onClick={() => setFilter('Materi')}
          size="sm"
        >
          Materi ({counts.Materi})
        </Button>
        <Button 
          variant={filter === 'UTS' ? 'primary' : 'secondary'}
          onClick={() => setFilter('UTS')}
          size="sm"
        >
          UTS ({counts.UTS})
        </Button>
        <Button 
          variant={filter === 'UAS' ? 'primary' : 'secondary'}
          onClick={() => setFilter('UAS')}
          size="sm"
        >
          UAS ({counts.UAS})
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Tidak ada data</p>
        ) : (
          filteredCourses.map(course => (
            <CourseItem
              key={course.id}
              course={course}
              onEdit={() => handleEdit(course)}
              onDelete={() => onDelete(course.id)}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title="Edit Course"
      >
        {editingCourse && (
          <CourseForm
            initialData={editingCourse}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCourse(null)}
          />
        )}
      </Modal>
    </div>
  );
}