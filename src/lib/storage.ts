import { Course, CreateCourseDTO } from "@/features/courses/types/course.types";

const STORAGE_KEY = "courses_data";

export class StorageService {
  static getCourses(): Course[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  static addCourse(course: CreateCourseDTO): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    courses.push(newCourse);
    this.saveCourses(courses);
    return newCourse;
  }

  static updateCourse(id: string, updates: CreateCourseDTO): Course | null {
    const courses = this.getCourses();
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) return null;

    courses[index] = {
      ...courses[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveCourses(courses);
    return courses[index];
  }

  static deleteCourse(id: string): boolean {
    const courses = this.getCourses();
    const filtered = courses.filter((c) => c.id !== id);
    if (filtered.length === courses.length) return false;
    this.saveCourses(filtered);
    return true;
  }

  static generateDefaultCourses(): Course[] {
    return [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        code: "CS101",
        name: "Introduction to Computer Science",
        description: "Basic concepts of programming and problem solving.",
        credits: 3,
        semesterId: "1",
        instructor: "Dr. Smith",
        schedule: "Mon/Wed 08:00-10:00",
        room: "Room 101",
        color: "#4F46E5",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : (Date.now() + 1).toString(),
        code: "CS201",
        name: "Data Structures",
        description:
          "Introduction to data structures and efficient algorithms.",
        credits: 4,
        semesterId: "1",
        instructor: "Prof. Johnson",
        schedule: "Mon/Wed 10:00-12:00",
        room: "Room 102",
        color: "#7C3AED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
