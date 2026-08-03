import { useState, useEffect, useCallback, useRef } from 'react';
import { Course, CourseInput } from '../types/course.types';
import { CourseService } from '../services/courseService';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const fetchCourses = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    try {
      const data = await CourseService.getAllCourses();
      if (isMounted.current) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const addCourse = useCallback(async (courseData: CourseInput) => {
    try {
      const newCourse = await CourseService.createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  }, []);

  const updateCourse = useCallback(async (id: string, courseData: CourseInput) => {
    try {
      const updated = await CourseService.updateCourse(id, courseData);
      if (updated) {
        setCourses(prev => prev.map(c => c.id === id ? updated : c));
      }
      return updated;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      const deleted = await CourseService.deleteCourse(id);
      if (deleted) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
      return deleted;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }, []);

  // Effect untuk fetch data awal
  useEffect(() => {
    // Flag untuk mencegah setState setelah unmount
    let isActive = true;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await CourseService.getAllCourses();
        if (isActive) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isActive = false;
    };
  }, []); // Empty dependency array - hanya jalan sekali

  return {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: fetchCourses,
  };
}