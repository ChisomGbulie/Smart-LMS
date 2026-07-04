// server/utils/assessmentDB.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function ensureSupabaseConfigured() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

/**
 * Save user assessment to database
 */
export async function saveAssessment(userId, assessmentData) {
  try {
    ensureSupabaseConfigured();

    // Check if assessment already exists
    const { data: existing } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing assessment
      result = await supabase
        .from('user_assessments')
        .update({
          career_goal: assessmentData.careerGoal,
          specialization: assessmentData.specialization,
          experience_level: assessmentData.experienceLevel,
          years_experience: assessmentData.yearsExperience,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
    } else {
      // Create new assessment
      result = await supabase
        .from('user_assessments')
        .insert([
          {
            user_id: userId,
            career_goal: assessmentData.careerGoal,
            specialization: assessmentData.specialization,
            experience_level: assessmentData.experienceLevel,
            years_experience: assessmentData.yearsExperience
          }
        ])
        .select();
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error saving assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user assessment from database
 */
export async function getAssessment(userId) {
  try {
    ensureSupabaseConfigured();

    const { data, error } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, exists: false };
      }
      throw error;
    }

    return { success: true, exists: true, data };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save learning path to database
 */
export async function saveLearningPath(userId, pathData) {
  try {
    ensureSupabaseConfigured();

    // First, get the assessment ID
    const { data: assessment } = await supabase
      .from('user_assessments')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!assessment) {
      return { success: false, error: 'Assessment not found' };
    }

    // Check if learning path already exists
    const { data: existing } = await supabase
      .from('learning_paths')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing learning path
      result = await supabase
        .from('learning_paths')
        .update({
          roadmap_content: pathData.roadmapContent,
          recommended_courses: pathData.recommendedCourses,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();
    } else {
      // Create new learning path
      result = await supabase
        .from('learning_paths')
        .insert([
          {
            user_id: userId,
            assessment_id: assessment.id,
            roadmap_content: pathData.roadmapContent,
            recommended_courses: pathData.recommendedCourses
          }
        ])
        .select();
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error saving learning path:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user learning path from database
 */
export async function getLearningPath(userId) {
  try {
    ensureSupabaseConfigured();

    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, exists: false };
      }
      throw error;
    }

    return { success: true, exists: true, data };
  } catch (error) {
    console.error('Error fetching learning path:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete assessment (for retaking assessment)
 */
export async function deleteAssessment(userId) {
  try {
    ensureSupabaseConfigured();

    await supabase
      .from('learning_paths')
      .delete()
      .eq('user_id', userId);

    const result = await supabase
      .from('user_assessments')
      .delete()
      .eq('user_id', userId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return { success: false, error: error.message };
  }
}
