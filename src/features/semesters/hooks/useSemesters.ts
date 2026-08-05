/**
 * useSemesters Hook
 * Custom hook untuk mengelola state dan operasi Semester
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Semester, CreateSemesterDTO, UpdateSemesterDTO, SemesterFilter } from '../types/semester.types';
import { semesterService } from '../services/semesterService';

interface UseSemestersReturn {
  semesters: Semester[];
  loading: boolean;
  error: string | null;
  activeSemester: Semester | null;
  createSemester: (data: CreateSemesterDTO) => Promise<Semester>;
  updateSemester: (id: string, data: UpdateSemesterDTO) => Promise<Semester | null>;
  deleteSemester: (id: string) => Promise<boolean>;
  setActiveSemester: (id: string) => Promise<Semester | null>;
  getSemesterById: (id: string) => Semester | null;
  getSemesterByNumber: (number: number) => Semester | null;
  filterSemesters: (filter: SemesterFilter) => Semester[];
  refreshSemesters: () => void;
}

export function useSemesters(): UseSemestersReturn {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSemester, setActiveSemesterState] = useState<Semester | null>(null);
  
  // Ref untuk mencegah state update setelah unmount
  const isMounted = useRef(true);

  // Cleanup pada unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Define loadSemesters dengan mounted check
  const loadSemesters = useCallback(() => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      
      const data = semesterService.getAll();
      if (isMounted.current) {
        setSemesters(data);
      }
      
      const active = semesterService.getActive();
      if (isMounted.current) {
        setActiveSemesterState(active);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to load semesters');
      }
      console.error('Error loading semesters:', err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load semesters on mount - menggunakan ref untuk mencegah double call
  const hasLoaded = useRef(false);
  
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadSemesters();
    }
  }, [loadSemesters]);

  const refreshSemesters = useCallback(() => {
    loadSemesters();
  }, [loadSemesters]);

  const createSemester = useCallback(async (data: CreateSemesterDTO): Promise<Semester> => {
    try {
      setLoading(true);
      setError(null);
      
      const newSemester = semesterService.create(data);
      
      if (isMounted.current) {
        setSemesters(prev => [...prev, newSemester]);
        
        if (newSemester.isActive) {
          setActiveSemesterState(newSemester);
        }
      }
      
      return newSemester;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to create semester');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateSemester = useCallback(async (id: string, data: UpdateSemesterDTO): Promise<Semester | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = semesterService.update(id, data);
      
      if (updated && isMounted.current) {
        setSemesters(prev => prev.map(s => s.id === id ? updated : s));
        
        if (updated.isActive) {
          setActiveSemesterState(updated);
        } else if (activeSemester?.id === id) {
          const newActive = semesterService.getActive();
          setActiveSemesterState(newActive);
        }
      }
      
      return updated;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to update semester');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [activeSemester]);

  const deleteSemester = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const deleted = semesterService.delete(id);
      
      if (deleted && isMounted.current) {
        setSemesters(prev => prev.filter(s => s.id !== id));
        
        if (activeSemester?.id === id) {
          const newActive = semesterService.getActive();
          setActiveSemesterState(newActive);
        }
      }
      
      return deleted;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to delete semester');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [activeSemester]);

  const setActiveSemester = useCallback(async (id: string): Promise<Semester | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = semesterService.setActive(id);
      
      if (updated && isMounted.current) {
        setSemesters(prev => prev.map(s => ({
          ...s,
          isActive: s.id === id
        })));
        setActiveSemesterState(updated);
      }
      
      return updated;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to set active semester');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getSemesterById = useCallback((id: string): Semester | null => {
    return semesterService.getById(id);
  }, []);

  const getSemesterByNumber = useCallback((number: number): Semester | null => {
    return semesterService.getByNumber(number);
  }, []);

  const filterSemesters = useCallback((filter: SemesterFilter): Semester[] => {
    let filtered = semesters;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.academicYear.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.isActive !== undefined) {
      filtered = filtered.filter(s => s.isActive === filter.isActive);
    }
    
    if (filter.academicYear) {
      filtered = filtered.filter(s => s.academicYear === filter.academicYear);
    }
    
    return filtered;
  }, [semesters]);

  return {
    semesters,
    loading,
    error,
    activeSemester,
    createSemester,
    updateSemester,
    deleteSemester,
    setActiveSemester,
    getSemesterById,
    getSemesterByNumber,
    filterSemesters,
    refreshSemesters,
  };
}