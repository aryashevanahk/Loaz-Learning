"use client";

import { Course } from "../types/course.types";
import { Button } from "@/components/ui/button";

interface CourseItemProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

export function CourseItem({ course, onEdit, onDelete }: CourseItemProps) {
  const categoryColors: Record<string, string> = {
    Tugas: "bg-yellow-100 text-yellow-800",
    Materi: "bg-blue-100 text-blue-800",
    UTS: "bg-red-100 text-red-800",
    UAS: "bg-purple-100 text-purple-800",
  };

  const colorClass =
    categoryColors[course.category] || "bg-gray-100 text-gray-800";

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {course.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{course.pertemuan}</p>
          <p className="text-gray-700">{course.description}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            ✏️ Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            🗑️ Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
