// src/utils/courseUtils.js
import { courses } from '../data/courses';

// Save course progress to localStorage
export const saveCourseProgress = (courseId, progress) => {
  localStorage.setItem(`course_${courseId}_progress`, progress.toString());
  
  // Update enrolled courses progress tracking
  const allProgress = JSON.parse(localStorage.getItem('allCoursesProgress') || '{}');
  allProgress[courseId] = progress;
  localStorage.setItem('allCoursesProgress', JSON.stringify(allProgress));
};

// Load course progress
export const loadCourseProgress = (courseId) => {
  const progress = localStorage.getItem(`course_${courseId}_progress`);
  return progress ? parseInt(progress) : 0;
};

// Check if user is enrolled in course
export const isEnrolled = (courseId) => {
  const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
  return enrolled.includes(courseId);
};

// Enroll in course
export const enrollInCourse = (courseId) => {
  const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
  if (!enrolled.includes(courseId)) {
    enrolled.push(courseId);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
  }
};

// Get all enrolled courses with their details and progress
export const getEnrolledCoursesWithProgress = () => {
  const enrolledIds = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
  const allProgress = JSON.parse(localStorage.getItem('allCoursesProgress') || '{}');
  
  return enrolledIds.map(id => {
    const course = courses.find(c => c.id === id);
    if (!course) return null;
    
    return {
      ...course,
      progress: allProgress[id] || 0,
      completed: (allProgress[id] || 0) === 100,
      lastAccessed: localStorage.getItem(`course_${id}_lastAccessed`) || new Date().toISOString()
    };
  }).filter(Boolean);
};

// Update last accessed time
export const updateLastAccessed = (courseId) => {
  localStorage.setItem(`course_${courseId}_lastAccessed`, new Date().toISOString());
};

// Get user statistics
export const getUserStats = () => {
  const enrolledCourses = getEnrolledCoursesWithProgress();
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(c => c.completed).length;
  const inProgressCourses = enrolledCourses.filter(c => !c.completed && c.progress > 0).length;
  
  const totalHours = enrolledCourses.reduce((sum, c) => sum + parseInt(c.duration), 0);
  const completedHours = enrolledCourses.reduce((sum, c) => {
    if (c.completed) return sum + parseInt(c.duration);
    return sum + (parseInt(c.duration) * (c.progress / 100));
  }, 0);
  const averageProgress = totalCourses > 0 
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses) 
    : 0;
  
  return {
    totalCourses,
    completedCourses,
    inProgressCourses,
    totalHours,
    completedHours,
    averageProgress
  };
};