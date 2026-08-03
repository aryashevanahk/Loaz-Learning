import { Schedule, TimetableEvent } from '@/types';

export type { Schedule, TimetableEvent };

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const DAY_COLORS: Record<DayOfWeek, string> = {
  Senin: '#4F46E5',
  Selasa: '#7C3AED',
  Rabu: '#EC4899',
  Kamis: '#EF4444',
  Jumat: '#F59E0B',
  Sabtu: '#10B981',
  Minggu: '#3B82F6',
};