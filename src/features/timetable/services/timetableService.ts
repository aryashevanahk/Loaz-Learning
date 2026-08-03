import { Schedule, TimetableEvent, DAY_COLORS } from '../types/timetable.types';

const STORAGE_KEY = 'timetable_data';

export class TimetableService {
  static getSchedules(): Schedule[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading timetable:', error);
      return [];
    }
  }

  static saveSchedules(schedules: Schedule[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  }

  static addSchedule(schedule: Omit<Schedule, 'id'>): Schedule {
    const schedules = this.getSchedules();
    const newSchedule: Schedule = {
      ...schedule,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      courseId: schedule.courseId || '',
    };
    schedules.push(newSchedule);
    this.saveSchedules(schedules);
    return newSchedule;
  }

  static updateSchedule(id: string, updates: Partial<Schedule>): Schedule | null {
    const schedules = this.getSchedules();
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    schedules[index] = { ...schedules[index], ...updates };
    this.saveSchedules(schedules);
    return schedules[index];
  }

  static deleteSchedule(id: string): boolean {
    const schedules = this.getSchedules();
    const filtered = schedules.filter(s => s.id !== id);
    if (filtered.length === schedules.length) return false;
    this.saveSchedules(filtered);
    return true;
  }

  static getEventsForWeek(date: Date = new Date()): TimetableEvent[] {
    const schedules = this.getSchedules();
    const startOfWeek = this.getStartOfWeek(date);
    
    return schedules.map(schedule => {
      const eventDate = this.getDateForDay(startOfWeek, schedule.day);
      return {
        id: schedule.id,
        title: schedule.title,
        start: new Date(`${eventDate.toDateString()} ${schedule.startTime}`),
        end: new Date(`${eventDate.toDateString()} ${schedule.endTime}`),
        color: schedule.color || DAY_COLORS[schedule.day as keyof typeof DAY_COLORS] || '#4F46E5',
        location: schedule.location,
        description: schedule.description,
        courseId: schedule.courseId,
      };
    });
  }

  private static getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private static getDateForDay(startOfWeek: Date, day: string): Date {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const index = days.indexOf(day);
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + index);
    return d;
  }

  static generateDefaultSchedules(): Schedule[] {
    const schedules: Schedule[] = [];
    const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random();
    
    const defaultSchedules: Omit<Schedule, 'id'>[] = [
      {
        day: 'Senin',
        startTime: '08:00',
        endTime: '09:30',
        title: 'Matematika',
        location: 'Ruang 101',
        color: '#4F46E5',
        description: 'Kalkulus Lanjutan',
        courseId: '',
      },
      {
        day: 'Senin',
        startTime: '10:00',
        endTime: '11:30',
        title: 'Fisika',
        location: 'Ruang 102',
        color: '#7C3AED',
        description: 'Fisika Dasar',
        courseId: '',
      },
      {
        day: 'Selasa',
        startTime: '09:00',
        endTime: '10:30',
        title: 'Kimia',
        location: 'Ruang 103',
        color: '#EC4899',
        description: 'Kimia Organik',
        courseId: '',
      },
      {
        day: 'Rabu',
        startTime: '13:00',
        endTime: '14:30',
        title: 'Biologi',
        location: 'Ruang 104',
        color: '#10B981',
        description: 'Biologi Molekuler',
        courseId: '',
      },
      {
        day: 'Kamis',
        startTime: '08:00',
        endTime: '09:30',
        title: 'Bahasa Inggris',
        location: 'Ruang 105',
        color: '#F59E0B',
        description: 'English for Academic Purposes',
        courseId: '',
      },
    ];

    defaultSchedules.forEach(schedule => {
      schedules.push({
        id: generateId(),
        ...schedule,
      });
    });

    return schedules;
  }

  static async initializeDefaultData(): Promise<void> {
    const schedules = this.getSchedules();
    if (schedules.length === 0) {
      const defaultSchedules = this.generateDefaultSchedules();
      this.saveSchedules(defaultSchedules);
    }
  }
}

export { DAY_COLORS };