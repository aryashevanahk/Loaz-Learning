"use client";

import { TimetableEvent } from "../types/timetable.types";
import { TimetableGrid } from "./TimetableGrid";
import { TimetableControls } from "./TimetableControls";
import { ScheduleForm } from "./ScheduleForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { Schedule } from "@/types";

interface TimetableViewProps {
  events: TimetableEvent[];
  currentDate: Date;
  onAddSchedule: (data: Omit<Schedule, "id">) => void;
  onDeleteSchedule: (id: string) => void;
  onUpdateSchedule: (id: string, data: Partial<Schedule>) => void;
  onChangeWeek: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
}

interface ScheduleFormData {
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  description: string;
}

export function TimetableView({
  events,
  currentDate,
  onAddSchedule,
  onDeleteSchedule,
  onUpdateSchedule,
  onChangeWeek,
  onGoToToday,
}: TimetableViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);

  const handleEditEvent = (event: TimetableEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      onDeleteSchedule(eventId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (data: ScheduleFormData) => {
    const scheduleData = {
      title: data.title,
      day: data.day as
        | "Senin"
        | "Selasa"
        | "Rabu"
        | "Kamis"
        | "Jumat"
        | "Sabtu"
        | "Minggu",
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      color: data.color,
      description: data.description,
      courseId: "",
    };

    if (editingEvent) {
      await onUpdateSchedule(editingEvent.id, scheduleData);
    } else {
      await onAddSchedule(scheduleData);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">
          📅 Jadwal Perkuliahan
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Tambah Jadwal</Button>
      </div>

      <TimetableControls
        currentDate={currentDate}
        onPrevWeek={() => onChangeWeek("prev")}
        onNextWeek={() => onChangeWeek("next")}
        onToday={onGoToToday}
      />

      <div className="mt-4">
        <TimetableGrid
          events={events}
          currentDate={currentDate}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? "Edit Jadwal" : "Tambah Jadwal Baru"}
      >
        <ScheduleForm
          initialData={
            editingEvent
              ? {
                  title: editingEvent.title,
                  day: new Date(editingEvent.start).toLocaleDateString(
                    "id-ID",
                    { weekday: "long" },
                  ),
                  startTime: editingEvent.start.toTimeString().slice(0, 5),
                  endTime: editingEvent.end.toTimeString().slice(0, 5),
                  location: editingEvent.location || "",
                  color: editingEvent.color || "#4F46E5",
                  description: editingEvent.description || "",
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
