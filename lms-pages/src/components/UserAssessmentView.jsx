// src/components/UserAssessmentView.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function UserAssessmentView({ userId, onRetakeClick }) {
  const [assessment, setAssessment] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserAssessment();
    }
  }, [userId]);

  const fetchUserAssessment = async () => {
    try {
      setLoading(true);
      
      // Fetch assessment from database
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('user_assessments')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (assessmentError && assessmentError.code !== 'PGRST116') {
        throw assessmentError;
      }

      if (assessmentData) {
        setAssessment(assessmentData);

        // Fetch learning path
        const { data: pathData, error: pathError } = await supabase
          .from('learning_paths')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (pathError && pathError.code !== 'PGRST116') {
          throw pathError;
        }

        if (pathData) {
          setLearningPath(pathData);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching assessment:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeAssessment = async () => {
    if (!window.confirm('Are you sure? Retaking the assessment will overwrite your current data.')) {
      return;
    }

    try {
      // Delete existing assessment
      const { error: deleteError } = await supabase
        .from('user_assessments')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      setAssessment(null);
      setLearningPath(null);
      
      if (onRetakeClick) {
        onRetakeClick();
      }
    } catch (err) {
      console.error('Error retaking assessment:', err);
      setError('Failed to delete assessment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading your assessment...</span>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">
          You haven't completed an assessment yet. Start one to get personalized course recommendations!
        </p>
        <button
          onClick={onRetakeClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assessment Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Your Assessment Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Career Path</p>
            <p className="text-lg font-bold text-blue-600">{assessment.career_goal}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Specialization</p>
            <p className="text-lg font-bold text-blue-600">{assessment.specialization}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Skill Level</p>
            <p className="text-lg font-bold text-blue-600">{assessment.experience_level}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Last updated: {new Date(assessment.updated_at).toLocaleDateString()}
        </p>
      </div>

      {/* Learning Path */}
      {learningPath && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Your Learning Roadmap</h3>
          
          <div className="prose max-w-none text-gray-700 mb-6">
            {learningPath.roadmap_content.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2 leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">📚 Recommended Courses</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learningPath.recommended_courses && learningPath.recommended_courses.map((course, idx) => (
                <li key={idx} className="flex items-center bg-blue-50 p-3 rounded-lg">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">{course}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center md:justify-start">
        <button
          onClick={() => window.location.href = '/courses'}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-8 rounded-lg transition flex items-center gap-2"
        >
          📚 Browse Courses
        </button>
        
        <button
          onClick={handleRetakeAssessment}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-8 rounded-lg transition flex items-center gap-2"
        >
          🔄 Retake Assessment
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
