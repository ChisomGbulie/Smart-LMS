// src/utils/assessmentService.js
import { supabase } from './supabase';

/**
 * Check if user has completed an assessment
 */
export async function hasUserAssessment(userId) {
  try {
    const { data, error } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking assessment:', error);
    return false;
  }
}

/**
 * Get user's assessment details
 */
export async function getUserAssessment(userId) {
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (assessmentError && assessmentError.code !== 'PGRST116') {
      throw assessmentError;
    }

    if (!assessment) {
      return null;
    }

    // Also fetch the learning path
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (pathError && pathError.code !== 'PGRST116') {
      throw pathError;
    }

    return {
      assessment,
      learningPath
    };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return null;
  }
}

/**
 * Format assessment data for display
 */
export function formatAssessmentData(assessmentData) {
  if (!assessmentData) return null;

  const { assessment, learningPath } = assessmentData;

  return {
    careerGoal: assessment.career_goal,
    specialization: assessment.specialization,
    experienceLevel: assessment.experience_level,
    yearsExperience: assessment.years_experience,
    createdAt: assessment.created_at,
    updatedAt: assessment.updated_at,
    roadmapContent: learningPath?.roadmap_content || '',
    recommendedCourses: learningPath?.recommended_courses || [],
    message: `🎯 **Your Assessment:**
    
• **Career Path:** ${assessment.career_goal}
• **Specialization:** ${assessment.specialization}
• **Skill Level:** ${assessment.experience_level}
• **Years of Experience:** ${assessment.years_experience}

Your personalized learning roadmap and recommended courses are ready!`
  };
}
