'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Course, CourseInput } from '../types/course.types';

interface CourseFormProps {
  initialData?: Course;
  onSubmit: (data: CourseInput) => void;
  onCancel: () => void;
}

export function CourseForm({ initialData, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseInput>({
    pertemuan: initialData?.pertemuan || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Materi',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Pertemuan"
        value={formData.pertemuan}
        onChange={(e) => setFormData({ ...formData, pertemuan: e.target.value })}
        required
        placeholder="Contoh: Pertemuan 6"
      />
      <Input
        label="Judul"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        placeholder="Masukkan judul course"
      />
      <Input
        label="Deskripsi"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        placeholder="Masukkan deskripsi course"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Materi">Materi</option>
          <option value="Tugas">Tugas</option>
          <option value="UTS">UTS</option>
          <option value="UAS">UAS</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          {initialData ? 'Update' : 'Tambah'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}