export interface Course {
  id: string;
  pertemuan: string;
  title: string;
  description: string;
  category: "Tugas" | "Materi" | "UTS" | "UAS";
  createdAt: Date;
  updatedAt: Date;
}

export type CourseInput = Omit<Course, "id" | "createdAt" | "updatedAt">;
export type CourseFilter = {
  search?: string;
  category?: Course["category"];
};
