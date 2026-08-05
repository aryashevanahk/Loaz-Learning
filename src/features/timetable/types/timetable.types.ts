export interface Schedule {
  id: string;
  courseId: string;
  title: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";
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

export type DayOfWeek =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export const DAY_COLORS: Record<DayOfWeek, string> = {
  Senin: "#4F46E5",
  Selasa: "#7C3AED",
  Rabu: "#EC4899",
  Kamis: "#EF4444",
  Jumat: "#F59E0B",
  Sabtu: "#10B981",
  Minggu: "#3B82F6",
};
