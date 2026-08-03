import { useState, useEffect, useCallback } from 'react';
import { Schedule, TimetableEvent } from '../types/timetable.types';
import { TimetableService, DAY_COLORS } from '../services/timetableService';

export interface ScheduleFormData {
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
  description: string;
}

export function useTimetable() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = TimetableService.getSchedules();
      setSchedules(data);
      const weekEvents = TimetableService.getEventsForWeek(currentDate);
      setEvents(weekEvents);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  const addSchedule = useCallback(async (scheduleData: Omit<Schedule, 'id'>) => {
    try {
      const newSchedule = TimetableService.addSchedule(scheduleData);
      setSchedules(prev => [...prev, newSchedule]);
      const weekEvents = TimetableService.getEventsForWeek(currentDate);
      setEvents(weekEvents);
      return newSchedule;
    } catch (error) {
      console.error('Error adding schedule:', error);
      throw error;
    }
  }, [currentDate]);

  const updateSchedule = useCallback(async (id: string, updates: Partial<Schedule>) => {
    try {
      const updated = TimetableService.updateSchedule(id, updates);
      if (updated) {
        setSchedules(prev => prev.map(s => s.id === id ? updated : s));
        const weekEvents = TimetableService.getEventsForWeek(currentDate);
        setEvents(weekEvents);
      }
      return updated;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  }, [currentDate]);

  const deleteSchedule = useCallback(async (id: string) => {
    try {
      const deleted = TimetableService.deleteSchedule(id);
      if (deleted) {
        setSchedules(prev => prev.filter(s => s.id !== id));
        const weekEvents = TimetableService.getEventsForWeek(currentDate);
        setEvents(weekEvents);
      }
      return deleted;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  }, [currentDate]);

  const changeWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  }, [currentDate]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchSchedules();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    schedules,
    events,
    loading,
    currentDate,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    changeWeek,
    goToToday,
    refreshTimetable: fetchSchedules,
  };
}

export { DAY_COLORS };