// src/pages/MyLearning.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { courses, userProgress as initialProgress } from '../data/courses';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Award,
  TrendingUp,
  ChevronRight,
  Filter,
  Search,
  Grid3x3,
  List,
  Calendar,
  Star,
  Users,
  Target,
  Flame,
  AlertCircle
} from 'lucide-react';

export default function MyLearning() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'in-progress', 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHours: 0,
    completedHours: 0,
    averageProgress: 0
  });

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    setLoading(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Load user profile from database or use local data
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Get enrolled courses from localStorage or database
      // For demo, we'll use the initialProgress data
      const enrolledCourseIds = initialProgress.enrolledCourses;
      
      // Filter courses that user is enrolled in
      const enrolled = courses
        .filter(course => enrolledCourseIds.includes(course.id))
        .map(course => ({
          ...course,
          progress: initialProgress.progress[course.id] || 0,
          completed: initialProgress.progress[course.id] === 100,
          lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextModule: course.syllabus[Math.floor(course.syllabus.length * (initialProgress.progress[course.id] / 100))] || course.syllabus[0]
        }));

      setEnrolledCourses(enrolled);

      // Calculate statistics
      const total = enrolled.length;
      const completed = enrolled.filter(c => c.completed).length;
      const inProgress = enrolled.filter(c => !c.completed && c.progress > 0).length;
      const totalHours = enrolled.reduce((sum, c) => sum + parseInt(c.duration), 0);
      const completedHours = enrolled.reduce((sum, c) => {
        if (c.completed) return sum + parseInt(c.duration);
        return sum + (parseInt(c.duration) * (c.progress / 100));
      }, 0);
      const avgProgress = total > 0 ? Math.round(enrolled.reduce((sum, c) => sum + c.progress, 0) / total) : 0;

      setStats({
        totalCourses: total,
        completedCourses: completed,
        inProgressCourses: inProgress,
        totalHours: totalHours,
        completedHours: Math.round(completedHours),
        averageProgress: avgProgress
      });

    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = enrolledCourses.filter(course => {
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'completed' 
        ? course.completed 
        : !course.completed && course.progress > 0;
    
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (progress, completed) => {
    if (completed) {
      return { text: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle };
    }
    if (progress > 0) {
      return { text: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: PlayCircle };
    }
    return { text: 'Not Started', color: 'bg-gray-100 text-gray-700', icon: Clock };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const continueCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
              <p className="text-gray-600">Track your progress and continue where you left off</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/courses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Browse More Courses
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-sm text-gray-500">Courses Enrolled</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              <p className="text-sm text-gray-500">Courses Finished</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
              <p className="text-sm text-gray-500">Average Completion</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500">Hours</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedHours}</p>
              <p className="text-sm text-gray-500">of {stats.totalHours} hours learned</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({stats.totalCourses})
                </button>
                <button
                  onClick={() => setFilterStatus('in-progress')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === 'in-progress' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  In Progress ({stats.inProgressCourses})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === 'completed' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed ({stats.completedCourses})
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search or filters' : "You haven't enrolled in any courses yet"}
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredCourses.map((course) => {
              const StatusIcon = getStatusBadge(course.progress, course.completed).icon;
              
              return viewMode === 'grid' ? (
                // Grid View
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(course.progress, course.completed).color}`}>
                        {getStatusBadge(course.progress, course.completed).text}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} total</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-50 text-green-600' :
                        course.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 transition-all duration-500 ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => continueCourse(course.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group"
                      >
                        {course.completed ? 'Review Course' : 'Continue Learning'}
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(course.progress, course.completed).color}`}>
                          {getStatusBadge(course.progress, course.completed).text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{course.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{course.modules} modules</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Last accessed: {formatDate(course.lastAccessed)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-64">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className={`rounded-full h-2 transition-all duration-500 ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <button
                        onClick={() => continueCourse(course.id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2"
                      >
                        {course.completed ? 'Review Course' : 'Continue Learning'}
                        <PlayCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Achievement Section (if any completed courses) */}
        {stats.completedCourses > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Great job! 🎉</h3>
                  <p className="text-green-100">
                    You've completed {stats.completedCourses} course{stats.completedCourses > 1 ? 's' : ''} and earned {stats.completedCourses} certificate{stats.completedCourses > 1 ? 's' : ''}!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Flame className="h-6 w-6" />
                <span>{stats.completedCourses * 100} XP</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Next Steps */}
        {filteredCourses.length > 0 && stats.completedCourses < stats.totalCourses && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recommended Next Steps</h3>
            </div>
            <div className="space-y-2">
              {filteredCourses
                .filter(c => !c.completed && c.progress > 0)
                .slice(0, 2)
                .map(course => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Continue {course.title}</span>
                    </div>
                    <button
                      onClick={() => continueCourse(course.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Resume →
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}