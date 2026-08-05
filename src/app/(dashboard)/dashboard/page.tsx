"use client";

import { useEffect, useState, useMemo } from "react";
import { useTimetable } from "@/features/timetable/hooks/useTimetable";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { TimetableView } from "@/features/timetable/components/TimetableView";
import { timetableService } from "@/features/timetable/services/timetableService";
import { CreateTimetableEventDTO } from "@/features/timetable/types/timetable.types";
import { UpdateTimetableEventDTO } from "@/features/timetable/types/timetable.types";
import {
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Bell,
  User,
  Sparkles,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduleForm } from "@/features/timetable/components/ScheduleForm";

export default function DashboardPage() {
  const {
    events,
    loading,
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

  const { courses } = useCourses();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  useEffect(() => {
    const initData = async () => {
      await timetableService.initializeDefaultData();
      refreshEvents();
    };
    initData();
  }, [refreshEvents]);

  // ========== STATISTIK ==========
  const totalEvents = events.length;

  // Today's events
  const todayDayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const todayEvents = events.filter((e) => e.day === todayDayName);

  // This week events (berdasarkan currentDate)
  const thisWeekEvents = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Senin
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Minggu

    return events.filter((e) => {
      const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(e.day);
      if (dayIndex === -1) return false;
      const eventDate = new Date(start);
      eventDate.setDate(start.getDate() + dayIndex);
      return eventDate >= start && eventDate <= end;
    });
  }, [events, currentDate]);

  // ========== SEARCH FILTER ==========
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase().trim();
    return events.filter((e) =>
      e.title.toLowerCase().includes(query) ||
      e.location?.toLowerCase().includes(query) ||
      e.instructor?.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  // ========== HANDLERS ==========
  const handleAddEvent = async (data: CreateTimetableEventDTO) => {
    await addSchedule({
      ...data,
      semesterId: data.semesterId || semesterId,
    });
    setIsAddEventOpen(false);
    refreshEvents();
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteSchedule(id);
      refreshEvents();
    }
  };

  const handleUpdateEvent = async (id: string, data: UpdateTimetableEventDTO) => {
    await updateSchedule(id, data);
    refreshEvents();
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
          Loading your schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800/50 border-0 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  3
                </span>
              </button>
              <button className="hidden sm:flex p-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              
              {/* ===== DIALOG - TANPA asChild dan TANPA Button ===== */}
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Event</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                  </DialogHeader>
                  <ScheduleForm
                    onSubmit={handleAddEvent}
                    onCancel={() => setIsAddEventOpen(false)}
                    courses={courses}
                    semesterId={semesterId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="px-6 py-6">
        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {totalEvents}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Today&apos;s Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {todayEvents.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {thisWeekEvents.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="group bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-4 border border-blue-400/20 shadow-lg shadow-blue-500/25 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">
                  Quick Action
                </p>
                <p className="text-xs font-semibold text-white mt-0.5">
                  Add new event
                </p>
              </div>
              <button
                onClick={() => setIsAddEventOpen(true)}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all group-hover:scale-110"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== VIEW TOGGLE ===== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800/50 rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "week"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "month"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              Month
            </button>
          </div>

          <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Suggestions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ===== TIMETABLE VIEW ===== */}
        <div className="bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          <TimetableView
            events={filteredEvents}
            currentDate={currentDate}
            semesterId={semesterId}
            courses={courses}
            onSemesterChange={setSemesterId}
            onAddSchedule={() => setIsAddEventOpen(true)}
            onDeleteSchedule={handleDeleteEvent}
            onUpdateSchedule={handleUpdateEvent}
            onChangeWeek={changeWeek}
            onGoToToday={goToToday}
            viewMode={viewMode}
          />
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-6 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-3">
            <span>© 2026 Loaz Learning</span>
            <span>•</span>
            <span>All times in your local timezone</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
            <span>v2.0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}