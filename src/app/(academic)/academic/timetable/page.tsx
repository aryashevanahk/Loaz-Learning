/**
 * Timetable Page
 * Halaman untuk mengelola jadwal kuliah
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTimetable } from '@/features/timetable/hooks/useTimetable';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { useSemesters } from '@/features/semesters/hooks/useSemesters';
import { TimetableGrid } from '@/features/timetable/components/TimetableGrid';
import { TimetableControls } from '@/features/timetable/components/TimetableControls';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScheduleForm } from '@/features/timetable/components/ScheduleForm';
import { CreateTimetableEventDTO, UpdateTimetableEventDTO, TimetableEvent } from '@/features/timetable/types/timetable.types';
import { Sparkles, Calendar, Clock, BookOpen, Layers } from 'lucide-react';
import { timetableService } from '@/features/timetable/services/timetableService';
import { semesterService } from '@/features/semesters/services/semesterService';
import { cn } from '@/lib/utils';

export default function TimetablePage() {
  const {
    events,
    loading: timetableLoading,
    currentDate,
    semesterId,
    setSemesterId,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    changeWeek,
    goToToday,
    refreshEvents,
  } = useTimetable();

  const { courses, loading: coursesLoading, refreshCourses, initializeDefaultData: initializeCourses } = useCourses();
  const { semesters, loading: semestersLoading, refreshSemesters } = useSemesters();

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Gabungkan loading state
  const loading = timetableLoading || coursesLoading || semestersLoading;

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      // Inisialisasi semua data default
      semesterService.initializeDefaultData();
      initializeCourses();
      await timetableService.initializeDefaultData();
      
      // Refresh semua data
      refreshEvents();
      refreshCourses();
      refreshSemesters();
    };
    initData();
  }, [refreshEvents, refreshCourses, refreshSemesters, initializeCourses]);

  // Statistics
  const totalEvents = events.length;
  const today = new Date();
  const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const todayEvents = events.filter(e => e.day === todayDayName);

  const thisWeekEvents = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    return events.filter(e => {
      const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(e.day);
      if (dayIndex === -1) return false;
      const eventDate = new Date(start);
      eventDate.setDate(start.getDate() + dayIndex);
      return eventDate >= start && eventDate <= end;
    });
  }, [events, currentDate]);

  // ========== HANDLERS ==========
  const handleAddEvent = async (data: CreateTimetableEventDTO) => {
    setIsSaving(true);
    try {
      await addSchedule({
        ...data,
        semesterId: data.semesterId || semesterId,
      });
      setIsAddEventOpen(false);
      refreshEvents();
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditEvent = async (id: string, data: UpdateTimetableEventDTO) => {
    setIsSaving(true);
    try {
      await updateSchedule(id, data);
      setEditingEvent(null);
      setIsAddEventOpen(false);
      refreshEvents();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteSchedule(id);
      refreshEvents();
    }
  };

  const handleEventClick = (event: TimetableEvent) => {
    setEditingEvent(event);
    setIsAddEventOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddEventOpen(false);
    setEditingEvent(null);
    setIsSaving(false);
  };

  const handleOpenAddDialog = () => {
    setEditingEvent(null);
    setIsAddEventOpen(true);
  };

  const handleViewModeChange = (mode: 'week' | 'month') => {
    setViewMode(mode);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Loading timetable...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    Timetable
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Manage your class schedule
                  </p>
                </div>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  Timetable
                </h1>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{totalEvents} events</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{todayEvents.length} today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {totalEvents}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Today&apos;s Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {todayEvents.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {thisWeekEvents.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-4 border border-blue-400/20 shadow-lg shadow-blue-500/25 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">
                  Semester
                </p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">
                  {semesters.find(s => s.id === semesterId)?.name || 'All Semesters'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== VIEW TOGGLE ===== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => handleViewModeChange('week')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'week'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              )}
            >
              Week
            </button>
            <button
              onClick={() => handleViewModeChange('month')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'month'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              )}
            >
              Month
            </button>
          </div>

          <Button
            onClick={handleOpenAddDialog}
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25"
          >
            <Calendar className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* ===== TIMETABLE VIEW ===== */}
        <div className="bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <TimetableControls
              currentDate={currentDate}
              semesterId={semesterId}
              onSemesterChange={setSemesterId}
              onWeekChange={changeWeek}
              onGoToToday={goToToday}
            />
          </div>

          <div className="p-4">
            <TimetableGrid
              events={events}
              courses={courses}
              viewMode={viewMode}
              onEventClick={handleEventClick}
              onDeleteEvent={handleDeleteEvent}
              onUpdateEvent={handleEditEvent}
            />
          </div>
        </div>

        {/* ===== DIALOG ===== */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
            </DialogHeader>
            <ScheduleForm
              initialData={editingEvent || undefined}
              mode={editingEvent ? 'edit' : 'add'}
              onSubmit={async (data) => {
                if (editingEvent) {
                  await handleEditEvent(editingEvent.id, data);
                } else {
                  await handleAddEvent(data);
                }
              }}
              onCancel={handleCloseDialog}
              courses={courses}
              semesterId={semesterId}
              isLoading={isSaving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}