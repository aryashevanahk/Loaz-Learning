'use client';

import { useEffect } from 'react';
import { useTimetable } from '@/features/timetable/hooks/useTimetable';
import { TimetableView } from '@/features/timetable/components/TimetableView';
import { TimetableService } from '@/features/timetable/services/timetableService';

export default function DashboardPage() {
  const { 
    events, 
    loading, 
    currentDate, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule,
    changeWeek,
    goToToday 
  } = useTimetable();

  useEffect(() => {
    const initData = async () => {
      await TimetableService.initializeDefaultData();
    };
    initData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">📅 Dashboard</h1>
      </div>

      <TimetableView
        events={events}
        currentDate={currentDate}
        onAddSchedule={addSchedule}
        onDeleteSchedule={deleteSchedule}
        onUpdateSchedule={updateSchedule}
        onChangeWeek={changeWeek}
        onGoToToday={goToToday}
      />
    </div>
  );
}