/**
 * useTimetable Hook
 * Custom hook untuk mengelola state dan operasi Timetable
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimetableEvent, CreateTimetableEventDTO, UpdateTimetableEventDTO, TimetableFilter } from '../types/timetable.types';
import { timetableService } from '../services/timetableService';

interface UseTimetableReturn {
  events: TimetableEvent[];
  loading: boolean;
  error: string | null;
  currentDate: Date;
  semesterId?: string;
  setSemesterId: (id: string | undefined) => void;
  addSchedule: (data: CreateTimetableEventDTO) => Promise<TimetableEvent>;
  updateSchedule: (id: string, data: UpdateTimetableEventDTO) => Promise<TimetableEvent | null>;
  deleteSchedule: (id: string) => Promise<boolean>;
  changeWeek: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  filterEvents: (filter: TimetableFilter) => TimetableEvent[];
  refreshEvents: () => void;
}

export function useTimetable(): UseTimetableReturn {
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [semesterId, setSemesterId] = useState<string | undefined>(undefined);
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Define loadEvents BEFORE useEffect
  const loadEvents = useCallback(() => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      
      let data = timetableService.getAll();
      
      if (semesterId) {
        data = data.filter(event => event.semesterId === semesterId);
      }
      
      if (isMounted.current) {
        setEvents(data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      }
      console.error('Error loading events:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [semesterId]);

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadEvents();
    }
  }, [loadEvents]);

  const refreshEvents = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  const addSchedule = useCallback(async (data: CreateTimetableEventDTO): Promise<TimetableEvent> => {
    try {
      setLoading(true);
      setError(null);
      
      const eventData = {
        ...data,
        semesterId: data.semesterId || semesterId,
      };
      
      const newEvent = timetableService.create(eventData);
      
      if (isMounted.current) {
        setEvents(prev => [...prev, newEvent]);
      }
      
      return newEvent;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to create event');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [semesterId]);

  const updateSchedule = useCallback(async (id: string, data: UpdateTimetableEventDTO): Promise<TimetableEvent | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = timetableService.update(id, data);
      
      if (updated && isMounted.current) {
        setEvents(prev => prev.map(e => e.id === id ? updated : e));
      }
      
      return updated;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to update event');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const deleteSchedule = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const deleted = timetableService.delete(id);
      
      if (deleted && isMounted.current) {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
      
      return deleted;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const changeWeek = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const filterEvents = useCallback((filter: TimetableFilter): TimetableEvent[] => {
    let filtered = events;
    
    if (filter.semesterId) {
      filtered = filtered.filter(e => e.semesterId === filter.semesterId);
    }
    
    if (filter.courseId) {
      filtered = filtered.filter(e => e.courseId === filter.courseId);
    }
    
    if (filter.day) {
      filtered = filtered.filter(e => e.day === filter.day);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        e.location?.toLowerCase().includes(searchLower) ||
        e.instructor?.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [events]);

  return {
    events,
    loading,
    error,
    currentDate,
    semesterId,
    setSemesterId,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    changeWeek,
    goToToday,
    filterEvents,
    refreshEvents,
  };
}