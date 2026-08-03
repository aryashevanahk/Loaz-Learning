export const COURSE_CATEGORIES = {
  TUGAS: 'Tugas',
  MATERI: 'Materi',
  UTS: 'UTS',
  UAS: 'UAS',
} as const;

export const COURSE_CATEGORY_COLORS = {
  TUGAS: 'bg-yellow-100 text-yellow-800',
  MATERI: 'bg-blue-100 text-blue-800',
  UTS: 'bg-red-100 text-red-800',
  UAS: 'bg-purple-100 text-purple-800',
} as const;

export type CourseCategory = typeof COURSE_CATEGORIES[keyof typeof COURSE_CATEGORIES];