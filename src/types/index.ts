export interface Course {
  id: string;
  pertemuan: string;
  title: string;
  description: string;
  category: 'Tugas' | 'Materi' | 'UTS' | 'UAS';
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  courseId: string;
  title: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  description?: string;
}

export interface TimetableEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  location?: string;
  description?: string;
  courseId?: string;
}