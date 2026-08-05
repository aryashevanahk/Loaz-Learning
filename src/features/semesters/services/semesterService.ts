/**
 * Semester Service
 * Mengelola operasi CRUD untuk data Semester di localStorage
 */

import { Semester, CreateSemesterDTO, UpdateSemesterDTO } from '../types/semester.types';

// Constants lokal untuk menghindari circular dependency
const STORAGE_KEYS = {
  SEMESTERS: 'loaz_semesters',
  ACTIVE_SEMESTER: 'loaz_active_semester',
};

const DEFAULT_SEMESTER_DATA = {
  name: 'Semester 1',
  semesterNumber: 1,
  academicYear: '2024/2025',
  startDate: new Date(new Date().getFullYear(), 7, 1),
  endDate: new Date(new Date().getFullYear() + 1, 0, 31),
  isActive: true,
};

class SemesterService {
  private storageKey = STORAGE_KEYS.SEMESTERS;
  private activeKey = STORAGE_KEYS.ACTIVE_SEMESTER;

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get all semesters from localStorage
   */
  getAll(): Semester[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const semesters = JSON.parse(data);
      return semesters.map((s: Omit<Semester, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
        startDate: string;
        endDate: string;
        createdAt: string;
        updatedAt: string;
      }) => ({
        ...s,
        startDate: new Date(s.startDate),
        endDate: new Date(s.endDate),
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting semesters:', error);
      return [];
    }
  }

  /**
   * Get active semester
   */
  getActive(): Semester | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const activeId = localStorage.getItem(this.activeKey);
      if (!activeId) {
        const semesters = this.getAll();
        const active = semesters.find(s => s.isActive);
        if (active) return active;
        
        const defaultSemester = this.createDefaultSemester();
        return defaultSemester;
      }
      
      const semester = this.getById(activeId);
      return semester;
    } catch (error) {
      console.error('Error getting active semester:', error);
      return null;
    }
  }

  /**
   * Create default semester
   */
  private createDefaultSemester(): Semester {
    const defaultData: CreateSemesterDTO = {
      name: DEFAULT_SEMESTER_DATA.name,
      semesterNumber: DEFAULT_SEMESTER_DATA.semesterNumber,
      academicYear: DEFAULT_SEMESTER_DATA.academicYear,
      startDate: DEFAULT_SEMESTER_DATA.startDate,
      endDate: DEFAULT_SEMESTER_DATA.endDate,
      isActive: true,
    };
    
    return this.create(defaultData);
  }

  /**
   * Get semester by ID
   */
  getById(id: string): Semester | null {
    const semesters = this.getAll();
    return semesters.find(s => s.id === id) || null;
  }

  /**
   * Get semester by semester number
   */
  getByNumber(semesterNumber: number): Semester | null {
    const semesters = this.getAll();
    return semesters.find(s => s.semesterNumber === semesterNumber) || null;
  }

  /**
   * Get semesters by academic year
   */
  getByAcademicYear(academicYear: string): Semester[] {
    const semesters = this.getAll();
    return semesters.filter(s => s.academicYear === academicYear);
  }

  /**
   * Create new semester
   */
  create(data: CreateSemesterDTO): Semester {
    const semesters = this.getAll();
    const now = new Date();
    
    if (data.isActive) {
      semesters.forEach(s => s.isActive = false);
    }
    
    const newSemester: Semester = {
      id: this.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    semesters.push(newSemester);
    this.save(semesters);
    
    if (newSemester.isActive) {
      localStorage.setItem(this.activeKey, newSemester.id);
    }
    
    return newSemester;
  }

  /**
   * Update semester
   */
  update(id: string, data: UpdateSemesterDTO): Semester | null {
    const semesters = this.getAll();
    const index = semesters.findIndex(s => s.id === id);
    
    if (index === -1) return null;
    
    if (data.isActive) {
      semesters.forEach(s => s.isActive = false);
    }
    
    const updatedSemester: Semester = {
      ...semesters[index],
      ...data,
      updatedAt: new Date(),
    };
    
    semesters[index] = updatedSemester;
    this.save(semesters);
    
    if (updatedSemester.isActive) {
      localStorage.setItem(this.activeKey, updatedSemester.id);
    } else if (semesters.some(s => s.isActive === true)) {
      const active = semesters.find(s => s.isActive);
      if (active) {
        localStorage.setItem(this.activeKey, active.id);
      }
    }
    
    return updatedSemester;
  }

  /**
   * Delete semester
   */
  delete(id: string): boolean {
    const semesters = this.getAll();
    const filtered = semesters.filter(s => s.id !== id);
    
    if (filtered.length === semesters.length) return false;
    
    this.save(filtered);
    
    const activeId = localStorage.getItem(this.activeKey);
    if (activeId === id) {
      const newActive = filtered.find(s => s.isActive);
      if (newActive) {
        localStorage.setItem(this.activeKey, newActive.id);
      } else {
        const defaultSemester = this.createDefaultSemester();
        localStorage.setItem(this.activeKey, defaultSemester.id);
      }
    }
    
    return true;
  }

  /**
   * Set active semester
   */
  setActive(id: string): Semester | null {
    const semesters = this.getAll();
    const target = semesters.find(s => s.id === id);
    
    if (!target) return null;
    
    semesters.forEach(s => s.isActive = false);
    target.isActive = true;
    
    this.save(semesters);
    localStorage.setItem(this.activeKey, target.id);
    
    return target;
  }

  /**
   * Initialize default data
   */
  initializeDefaultData(): void {
    const semesters = this.getAll();
    
    if (semesters.length === 0) {
      const now = new Date();
      const year = now.getFullYear();
      
      const defaultSemesters: CreateSemesterDTO[] = [
        {
          name: 'Semester 1',
          semesterNumber: 1,
          academicYear: `${year-1}/${year}`,
          startDate: new Date(year-1, 7, 1),
          endDate: new Date(year-1, 11, 31),
          isActive: false,
        },
        {
          name: 'Semester 2',
          semesterNumber: 2,
          academicYear: `${year-1}/${year}`,
          startDate: new Date(year, 0, 1),
          endDate: new Date(year, 4, 31),
          isActive: false,
        },
        {
          name: 'Semester 3',
          semesterNumber: 3,
          academicYear: `${year}/${year+1}`,
          startDate: new Date(year, 7, 1),
          endDate: new Date(year, 11, 31),
          isActive: true,
        },
        {
          name: 'Semester 4',
          semesterNumber: 4,
          academicYear: `${year}/${year+1}`,
          startDate: new Date(year+1, 0, 1),
          endDate: new Date(year+1, 4, 31),
          isActive: false,
        },
      ];
      
      defaultSemesters.forEach(s => {
        const created = this.create(s);
        if (s.isActive) {
          localStorage.setItem(this.activeKey, created.id);
        }
      });
    }
  }

  /**
   * Save semesters to localStorage
   */
  private save(semesters: Semester[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(semesters));
  }
}

export const semesterService = new SemesterService();