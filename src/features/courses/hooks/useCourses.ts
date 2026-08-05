/**
 * useCourses Hook
 * Custom hook untuk mengelola state dan operasi Course
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Course, CreateCourseDTO, UpdateCourseDTO, CourseFilter } from '../types/course.types';
import { courseService } from '../services/courseService';

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  semesterId?: string;
  setSemesterId: (id: string | undefined) => void;
  addCourse: (data: CreateCourseDTO) => Promise<Course>;
  updateCourse: (id: string, data: UpdateCourseDTO) => Promise<Course | null>;
  deleteCourse: (id: string) => Promise<boolean>;
  getCourseById: (id: string) => Course | null;
  filterCourses: (filter: CourseFilter) => Course[];
  refreshCourses: () => void;
  initializeDefaultData: () => void;
}

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [semesterId, setSemesterId] = useState<string | undefined>(undefined);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadCourses = useCallback(() => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      
      let data = courseService.getAll();
      
      if (semesterId) {
        data = data.filter(course => course.semesterId === semesterId);
      }
      
      if (isMounted.current) {
        setCourses(data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      }
      console.error('Error loading courses:', err);
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
      loadCourses();
    }
  }, [loadCourses]);

  const refreshCourses = useCallback(() => {
    loadCourses();
  }, [loadCourses]);

  const initializeDefaultData = useCallback(() => {
    courseService.initializeDefaultData();
    refreshCourses();
  }, [refreshCourses]);

  const addCourse = useCallback(async (data: CreateCourseDTO): Promise<Course> => {
    try {
      setLoading(true);
      setError(null);
      
      const courseData = {
        ...data,
        semesterId: data.semesterId || semesterId,
      };
      
      const newCourse = courseService.create(courseData);
      
      if (isMounted.current) {
        setCourses(prev => [...prev, newCourse]);
      }
      
      return newCourse;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to create course');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [semesterId]);

  const updateCourse = useCallback(async (id: string, data: UpdateCourseDTO): Promise<Course | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = courseService.update(id, data);
      
      if (updated && isMounted.current) {
        setCourses(prev => prev.map(c => c.id === id ? updated : c));
      }
      
      return updated;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to update course');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const deleted = courseService.delete(id);
      
      if (deleted && isMounted.current) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
      
      return deleted;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to delete course');
      }
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getCourseById = useCallback((id: string): Course | null => {
    return courseService.getById(id);
  }, []);

  const filterCourses = useCallback((filter: CourseFilter): Course[] => {
    let filtered = courses;
    
    if (filter.semesterId) {
      filtered = filtered.filter(c => c.semesterId === filter.semesterId);
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.code.toLowerCase().includes(searchLower) ||
        c.name.toLowerCase().includes(searchLower) ||
        c.instructor?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.credits) {
      filtered = filtered.filter(c => c.credits === filter.credits);
    }
    
    if (filter.instructor) {
      const instructorLower = filter.instructor.toLowerCase();
      filtered = filtered.filter(c => 
        c.instructor?.toLowerCase().includes(instructorLower)
      );
    }
    
    return filtered;
  }, [courses]);

  return {
    courses,
    loading,
    error,
    semesterId,
    setSemesterId,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    filterCourses,
    refreshCourses,
    initializeDefaultData,
  };
}