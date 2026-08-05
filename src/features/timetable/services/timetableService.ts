/**
 * Timetable Service
 * Mengelola operasi CRUD untuk data Jadwal di localStorage
 */

import { TimetableEvent, CreateTimetableEventDTO, UpdateTimetableEventDTO } from '../types/timetable.types';

const STORAGE_KEY = 'loaz_timetable_events';

// Type untuk data dari localStorage
interface RawTimetableEvent {
  id: string;
  title: string;
  courseId?: string;
  semesterId?: string;
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  instructor?: string;
  color?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class TimetableService {
  private storageKey = STORAGE_KEY;

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get all events from localStorage
   */
  getAll(): TimetableEvent[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const events: RawTimetableEvent[] = JSON.parse(data);
      return events.map((e) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  /**
   * Get event by ID
   */
  getById(id: string): TimetableEvent | null {
    const events = this.getAll();
    return events.find(e => e.id === id) || null;
  }

  /**
   * Get events by course ID
   */
  getByCourseId(courseId: string): TimetableEvent[] {
    const events = this.getAll();
    return events.filter(e => e.courseId === courseId);
  }

  /**
   * Create new event
   */
  create(data: CreateTimetableEventDTO): TimetableEvent {
    const events = this.getAll();
    const now = new Date();
    
    const newEvent: TimetableEvent = {
      id: this.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    events.push(newEvent);
    this.save(events);
    
    return newEvent;
  }

  /**
   * Update event
   */
  update(id: string, data: UpdateTimetableEventDTO): TimetableEvent | null {
    const events = this.getAll();
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    const updatedEvent: TimetableEvent = {
      ...events[index],
      ...data,
      updatedAt: new Date(),
    };
    
    events[index] = updatedEvent;
    this.save(events);
    
    return updatedEvent;
  }

  /**
   * Delete event
   */
  delete(id: string): boolean {
    const events = this.getAll();
    const filtered = events.filter(e => e.id !== id);
    
    if (filtered.length === events.length) return false;
    
    this.save(filtered);
    return true;
  }

  /**
   * Initialize default data
   * Course ID akan di-refresh setelah course service diinisialisasi
   */
  initializeDefaultData(courseIds?: string[]): void {
    const events = this.getAll();
    
    if (events.length === 0) {
      // Gunakan ID yang diberikan atau fallback ke string kosong
      const cs101Id = courseIds?.[0] || '1';
      const cs201Id = courseIds?.[1] || '2';
      const cs301Id = courseIds?.[2] || '3';
      
      const defaultEvents: CreateTimetableEventDTO[] = [
        {
          title: 'Introduction to Computer Science',
          courseId: cs101Id,
          semesterId: '1',
          day: 'Monday',
          startTime: '08:00',
          endTime: '10:00',
          location: 'Room 101',
          instructor: 'Dr. Smith',
          color: '#4F46E5',
          notes: 'Bring laptop',
        },
        {
          title: 'Data Structures',
          courseId: cs201Id,
          semesterId: '1',
          day: 'Monday',
          startTime: '10:00',
          endTime: '12:00',
          location: 'Room 102',
          instructor: 'Prof. Johnson',
          color: '#7C3AED',
          notes: '',
        },
        {
          title: 'Algorithms',
          courseId: cs301Id,
          semesterId: '1',
          day: 'Wednesday',
          startTime: '08:00',
          endTime: '10:00',
          location: 'Room 103',
          instructor: 'Dr. Williams',
          color: '#EC4899',
          notes: '',
        },
      ];
      
      defaultEvents.forEach(e => this.create(e));
    }
  }

  /**
   * Save events to localStorage
   */
  private save(events: TimetableEvent[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }
}

// Export singleton instance
export const timetableService = new TimetableService();