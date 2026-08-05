/**
 * Timetable Types
 * Mendefinisikan tipe data untuk fitur Timetable
 */

export interface TimetableEvent {
  id: string;
  title: string;
  courseId?: string;
  semesterId?: string; // Tambahan: relasi ke Semester
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '08:00'
  endTime: string; // '10:00'
  location?: string;
  instructor?: string;
  color?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTimetableEventDTO = Omit<TimetableEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTimetableEventDTO = Partial<CreateTimetableEventDTO>;

export interface TimetableFilter {
  semesterId?: string;
  courseId?: string;
  day?: string;
  search?: string;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00',
] as const;

export type TimeSlot = typeof TIME_SLOTS[number];