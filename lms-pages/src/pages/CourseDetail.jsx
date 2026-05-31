// src/pages/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { useState, useEffect } from 'react'; // Add useState, useEffect
import { courses } from '../data/courses';
import { BookOpen, Clock, Star, Users, CheckCircle, Play } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this
  const course = courses.find(c => c.id === parseInt(id));
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    // Load progress for this course
    const progress = localStorage.getItem(`course_${id}_progress`);
    if (progress) {
      setUserProgress(parseInt(progress));
    }
  }, [id]);

  const handleEnroll = () => {
    // Add to enrolled courses
    const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolled.includes(parseInt(id))) {
      enrolled.push(parseInt(id));
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
    }
    
    // Redirect to course learning page
    navigate(`/course/${id}/learn`);
  };

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  return (
    // Rest of your component remains the same
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-blue-100 mb-6">{course.description}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>{course.rating} rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{course.duration} total</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span>{course.modules} modules</span>
          </div>
        </div>
      </div>

      {/* Rest of your JSX remains the same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.syllabus.map((module, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Module {module.module}: {module.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{module.duration}</p>
                    </div>
                    <Play className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {module.topics.map((topic, tIdx) => (
                      <span key={tIdx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-gray-900">Free</p>
              <p className="text-sm text-gray-500">Full access to all modules</p>
            </div>
            <button 
              onClick={handleEnroll}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Enroll Now
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              Includes: {course.modules} modules • Certificate • Lifetime access
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{course.instructor}</p>
                <p className="text-sm text-gray-500">Senior Developer & Educator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}