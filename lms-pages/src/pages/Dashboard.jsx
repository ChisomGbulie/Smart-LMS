// src/pages/Dashboard.jsx - CORRECTED VERSION
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { courses, userProgress as initialProgress } from '../data/courses'
import { 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  MessageSquare,
  CheckCircle,
  Clock,
  Award,
  ChevronRight,
  Target,
  BarChart3,
  Bell,
  Sparkles,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Send
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chatSectionRef = useRef(null);
  
  // Generate user ID for demo purposes
  const userId = useMemo(() => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', id);
    }
    return id;
  }, []);
  
  // User Profile Data
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    skillLevel: 'Beginner',
    careerGoal: 'Software Developer',
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursLearned: 0,
    marketFit: 0
  })

  // Personalized Learning Path Data
  const [personalizedPath, setPersonalizedPath] = useState([])
  const [allCourses, setAllCourses] = useState([])
  
  // Job Matches Data
  const [jobMatches, setJobMatches] = useState([])
  
  // In-Demand Skills Data
  const [inDemandSkills, setInDemandSkills] = useState([])
  
  // Chat Messages
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  
  // Assessment Status
  const [isAssessed, setIsAssessed] = useState(false)
  const [showAssessmentCompleteModal, setShowAssessmentCompleteModal] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState(null)

  const assessmentStartedRef = useRef(false);
  const initialMessageSentRef = useRef(false);
  const assessmentCompletedRef = useRef(false);

  // Load assessment state from localStorage on mount
  useEffect(() => {
    const savedAssessmentState = localStorage.getItem(`assessment_completed_${user?.id}`);
    if (savedAssessmentState === 'true') {
      setIsAssessed(true);
    }
  }, [user?.id]);

  // Save assessment state to localStorage when it changes to true
  useEffect(() => {
    if (isAssessed && user?.id) {
      localStorage.setItem(`assessment_completed_${user.id}`, 'true');
    }
  }, [isAssessed, user?.id]);

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (user?.id && chatMessages.length > 0) {
      localStorage.setItem(`chat_messages_${user.id}`, JSON.stringify(chatMessages));
    }
  }, [chatMessages, user?.id]);

  // Load and display chat messages when assessment is completed
  useEffect(() => {
    if (isAssessed && user?.id && chatMessages.length === 0) {
      const savedChatMessages = localStorage.getItem(`chat_messages_${user.id}`);
      if (savedChatMessages) {
        try {
          const messages = JSON.parse(savedChatMessages);
          if (messages.length > 0) {
            setChatMessages(messages);
          }
        } catch (error) {
          console.error('Error loading chat messages:', error);
        }
      }
    }
  }, [isAssessed, user?.id]);

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (err) {
      console.error('Sign out error:', err.message)
    }
  }

    // Start Assessment - With scroll functionality restored
  const startAssessment = useCallback(() => {
    // Prevent multiple calls
    if (assessmentStartedRef.current || initialMessageSentRef.current) {
      console.log('Assessment already started, ignoring duplicate call');
      return;
    }
    
    assessmentStartedRef.current = true;
    initialMessageSentRef.current = true;
    
    // Close sidebar if open on mobile
    setSidebarOpen(false);
    
    // Switch to overview tab if not already there
    setActiveTab('overview');
    
    // Scroll to chat section with smooth behavior
    setTimeout(() => {
      if (chatSectionRef.current) {
        chatSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Add a highlight effect to draw attention
        chatSectionRef.current.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2', 'shadow-lg');
        setTimeout(() => {
          if (chatSectionRef.current) {
            chatSectionRef.current.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2', 'shadow-lg');
          }
        }, 2000);
      }
    }, 100);
    
    // Clear any existing messages
    setChatMessages([]);
    setChatLoading(true);
    
    // Send the API call directly
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'I want to start the career assessment',
        userProfile: {
          name: userProfile.name,
          skillLevel: userProfile.skillLevel,
          careerGoal: userProfile.careerGoal
        },
        isAssessed: isAssessed,
        userId: user?.id || 'anonymous'
      })
    })
    .then(response => response.json())
    .then(data => {
      setChatMessages([
        { type: 'user', message: 'I want to start the career assessment' },
        { type: 'bot', message: data.reply }
      ]);
      setChatLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setChatMessages([{ 
        type: 'bot', 
        message: "👋 Welcome! Which path interests you most? Frontend, Backend, or Full Stack?" 
      }]);
      setChatLoading(false);
      assessmentStartedRef.current = false;
      initialMessageSentRef.current = false;
    });
  }, [userProfile.name, userProfile.skillLevel, userProfile.careerGoal, isAssessed, user?.id]);

  // Fetch Job Matches
  const fetchJobMatches = async () => {
    const mockJobs = [
      { id: 1, title: 'Frontend Developer', company: 'Flutterwave', location: 'Lagos, Nigeria', salary: '₦450k-600k', skills: ['React', 'Tailwind', 'TypeScript'], matchScore: 92 },
      { id: 2, title: 'Full Stack Engineer', company: 'Paystack', location: 'Remote (Nigeria)', salary: '₦550k-750k', skills: ['React', 'Node.js', 'PostgreSQL'], matchScore: 88 },
      { id: 3, title: 'UI Developer', company: 'Andela', location: 'Lagos, Nigeria', salary: '₦400k-550k', skills: ['React', 'CSS', 'JavaScript'], matchScore: 85 }
    ]
    setJobMatches(mockJobs)
  }

  // Fetch In-Demand Skills
  const fetchInDemandSkills = async () => {
    const mockSkills = [
      { name: 'React.js', growth: '+32%', openings: 124, priority: 'Critical' },
      { name: 'TypeScript', growth: '+28%', openings: 98, priority: 'High' },
      { name: 'Node.js', growth: '+25%', openings: 112, priority: 'High' },
      { name: 'Python', growth: '+20%', openings: 87, priority: 'Medium' }
    ]
    setInDemandSkills(mockSkills)
  }

  // Load User Profile
  const loadUserProfile = async (user) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          email: user.email,
          skill_level: 'Beginner',
          career_goal: 'Not Set',
          is_assessed: false,
          created_at: new Date(),
          updated_at: new Date()
        }
        
        const { data: created } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single()
        
        if (created) {
          setUserProfile({
            name: created.full_name,
            email: created.email,
            skillLevel: created.skill_level,
            careerGoal: created.career_goal,
            completedCourses: 0,
            inProgressCourses: 0,
            totalHoursLearned: 0,
            marketFit: 0
          })
          setIsAssessed(false)
        }
      } else if (profile) {
        setUserProfile({
          name: profile.full_name,
          email: profile.email,
          skillLevel: profile.skill_level,
          careerGoal: profile.career_goal,
          completedCourses: profile.completed_courses || 0,
          inProgressCourses: profile.in_progress_courses || 0,
          totalHoursLearned: profile.total_hours || 0,
          marketFit: profile.market_fit || 0
        })
        setIsAssessed(profile.is_assessed || false)
      }
    } catch (err) {
      console.error('Error loading user profile:', err)
    }
  }

  // Load Dashboard Data
  const loadDashboardData = async () => {
    console.log("loadDashboardData started");
    try {
      setAllCourses(courses)
      
      const userEnrolledCourses = courses.filter(course => 
        initialProgress.enrolledCourses.includes(course.id)
      )
      
      const pathWithProgress = userEnrolledCourses.map(course => ({
        id: course.id,
        course_name: course.title,
        progress: initialProgress.progress[course.id] || 0,
        type: course.category.toLowerCase().includes('web') ? 'technical' : 'career',
        job_demand: course.students > 15000 ? 'Very High' : 'High',
        description: course.description
      }))
      
      setPersonalizedPath(pathWithProgress)
      await fetchJobMatches()
      await fetchInDemandSkills()
      
      // Only clear/set messages if not already populated from localStorage
      if (chatMessages.length === 0) {
        if (!isAssessed) {
          setChatMessages([]);
        } else {
          // Try to load from localStorage
          const savedChatMessages = localStorage.getItem(`chat_messages_${user?.id}`);
          if (!savedChatMessages) {
            // Only show welcome message if no saved messages
            setChatMessages([{
              type: 'bot',
              message: `👋 Welcome back! Your learning path is ${userProfile.marketFit}% aligned with current job market demands.\n\nI see you're aiming to become a ${userProfile.careerGoal} (${userProfile.skillLevel} level).\n\nI'm here to help with your learning journey! Ask me about:\n• 📚 Courses (type 'courses')\n• 💼 Jobs & salaries (type 'jobs')\n• 🔧 Skills (type 'skills')\n• 🎯 Projects (type 'projects')\n• 📋 Assessment (type 'assessment')\n\nWhat would you like to know?`
            }]);
          }
        }
      }
      console.log("loadDashboardData completed");
    } catch (error) {
      console.error("Error in loadDashboardData:", error);
      setPersonalizedPath([]);
      setJobMatches([]);
      setInDemandSkills([]);
    }
  };

// Handle Chat Submit - With better error handling
const handleChatSubmit = async (e) => {
  e.preventDefault();
  if (!chatInput.trim() || chatLoading) return;

  const userMessage = chatInput.trim().toLowerCase();
  setChatMessages(prev => [...prev, { type: 'user', message: chatInput.trim() }]);
  setChatInput('');
  
  // Check if user is asking about their assessment
  if (userMessage.includes('assessment') && isAssessed && assessmentResults) {
    // Display assessment results immediately
    const assessmentMessage = `📋 **Your Career Assessment Results:**\n\n🎯 Career Goal: ${assessmentResults.careerGoal}\n📊 Skill Level: ${assessmentResults.skillLevel}\n🔥 Job Market Fit: ${assessmentResults.marketFit}%\n\nBased on your assessment, you're ${assessmentResults.marketFit}% aligned with current job market demands for a ${assessmentResults.careerGoal} position.\n\nWould you like me to recommend specific courses, show you job opportunities, or discuss required skills?`;
    setChatMessages(prev => [...prev, { type: 'bot', message: assessmentMessage }]);
    return;
  }
  
  setChatLoading(true);

  try {
    console.log('Sending message:', userMessage);
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        userProfile: {
          name: userProfile.name,
          skillLevel: userProfile.skillLevel,
          careerGoal: userProfile.careerGoal
        },
        isAssessed: isAssessed,
        userId: user?.id || 'anonymous'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response:', data);
    
    // If the response includes a button flag, add a special button after the bot message
    if (data.showCoursesButton) {
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        message: data.reply,
        showCoursesButton: true 
      }]);
    } else {
      setChatMessages(prev => [...prev, { type: 'bot', message: data.reply }]);
    }
    
    if (data.assessmentComplete && !isAssessed && !assessmentCompletedRef.current) {
      console.log('Assessment completed!');
      assessmentCompletedRef.current = true;
      setIsAssessed(true);
      setUserProfile(prev => ({
        ...prev,
        skillLevel: data.skillLevel || prev.skillLevel,
        careerGoal: data.careerGoal || prev.careerGoal,
        marketFit: data.marketFit || 75
      }));
      
      // Store assessment results for later display
      setAssessmentResults({
        skillLevel: data.skillLevel || userProfile.skillLevel,
        careerGoal: data.careerGoal || userProfile.careerGoal,
        marketFit: data.marketFit || 75
      });
      
      // Show success modal
      setShowAssessmentCompleteModal(true);
      
      assessmentStartedRef.current = false;
      initialMessageSentRef.current = false;
      
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ 
            is_assessed: true,
            skill_level: data.skillLevel || userProfile.skillLevel,
            career_goal: data.careerGoal || userProfile.careerGoal,
            market_fit: data.marketFit || 0,
            updated_at: new Date()
          })
          .eq('user_id', user.id);
        
        if (!error) {
          await loadDashboardData();
        }
      }
    }  
    
  } catch (error) {
    console.error('Chat error:', error);
    setChatMessages(prev => [...prev, { 
      type: 'bot', 
      message: "⚠️ I'm having trouble connecting. Please make sure the server is running on port 3001 and try again." 
    }]);
  } finally {
    setChatLoading(false);
  }
};

  useEffect(() => {
    return () => {
      assessmentStartedRef.current = false;
      initialMessageSentRef.current = false;
    };
  }, []);

  // Debug chat messages
  useEffect(() => {
    console.log('Chat Messages Updated:', chatMessages);
    console.log('isAssessed:', isAssessed);
    console.log('chatLoading:', chatLoading);
  }, [chatMessages, isAssessed, chatLoading]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          navigate('/login');
          return;
        }
        
        setUser(session.user);
        await loadUserProfile(session.user);
        await loadDashboardData();
        setLoading(false);
        
      } catch (err) {
        console.error('Session error:', err);
        setLoading(false);
        navigate('/login');
      }
    }
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const displayName = userProfile.name || user?.user_metadata?.full_name || user?.email?.split('@')[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Smart-LMS
              </span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => navigate('/my-learning')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'learning' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <BookOpen className="h-5 w-5" />
              <span>My Learning</span>
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-600 hover:bg-gray-50`}
            >
              <BookOpen className="h-5 w-5" />
              <span>All Courses</span>
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Job Matches</span>
            </button>
            <button 
              onClick={() => navigate('/market-insights')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${activeTab === 'market' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Market Insights</span>
            </button>
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg lg:hidden">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{userProfile.skillLevel} · {userProfile.careerGoal}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isAssessed && (
            <div className="mb-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-bold mb-2">🎯 Complete Your Career Assessment</h2>
                  <p className="text-amber-100">Get personalized course recommendations based on your skills and real-time job market data.</p>
                </div>
                <button 
                  onClick={startAssessment}
                  disabled={assessmentStartedRef.current || chatLoading}
                  className="mt-4 md:mt-0 bg-white text-amber-600 px-6 py-2.5 rounded-lg font-medium hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assessmentStartedRef.current || chatLoading ? 'Starting...' : 'Start Assessment →'}
                </button>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {displayName?.split(' ')[0] || 'User'}! 👋</h1>
                <p className="text-blue-100 mb-4">Your personalized learning journey is on track. The job market is showing strong demand for your target skills.</p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Goal: {userProfile.careerGoal}
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Market Fit: {userProfile.marketFit}%
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/my-learning')}
                className="mt-4 md:mt-0 bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Continue Learning
              </button>
            </div>
          </div>

          {/* Main Grid Content - Keep the rest of your JSX exactly as is from here */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personalized Learning Path */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                        Your AI-Powered Learning Route
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Personalized based on your skills and real-time job market demand</p>
                    </div>
                    <button 
                      onClick={() => navigate('/my-learning')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {personalizedPath.map((course) => (
                    <div key={course.id} className="p-5 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-medium text-gray-900">{course.course_name}</h3>
                            {course.job_demand === 'Very High' && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🔥 High Demand</span>
                            )}
                            {course.job_demand === 'High' && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">📈 In Demand</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center">
                              {course.progress === 100 ? <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
                              {course.progress}% Complete
                            </span>
                            <span className="capitalize">{course.type}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`rounded-full h-2 transition-all duration-500 ${
                                course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <button className="ml-4 text-blue-600 hover:text-blue-700">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chatbot Interface */}
<div ref={chatSectionRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
      <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
      AI Learning Assistant
      {!isAssessed && (
        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full animate-pulse">
          Assessment Required
        </span>
      )}
    </h2>
    <p className="text-sm text-gray-600">
      {!isAssessed 
        ? "Complete the assessment to get personalized course recommendations" 
        : "Ask me about courses, career paths, or job market trends"}
    </p>
  </div>
  
  <div className="p-5 h-80 overflow-y-auto flex flex-col space-y-3 bg-gray-50">
    {/* Show initial state when no messages and not assessed */}
    {chatMessages.length === 0 && !isAssessed ? (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Sparkles className="h-12 w-12 text-blue-300 mb-3" />
        <p className="text-gray-500 mb-2">Ready to start your career assessment?</p>
        <p className="text-xs text-gray-400 mb-4">The chatbot will guide you through finding your perfect learning path</p>
        <button 
          onClick={startAssessment}
          disabled={assessmentStartedRef.current || chatLoading}
          className="mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {assessmentStartedRef.current || chatLoading ? 'Starting Assessment...' : 'Begin Assessment →'}
        </button>
      </div>
    ) : (
      /* Show messages when they exist */
      <>
        {chatMessages.map((msg, idx) => (
          <div key={idx}>
            <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
            {/* Show courses button if flag is true */}
            {msg.showCoursesButton && (
              <div className="flex justify-start mt-2 ml-4">
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2 shadow-md"
                >
                  📚 Browse All Courses
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </>
    )}
    
    {/* Loading indicator */}
    {chatLoading && (
      <div className="flex justify-start">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    )}
  </div>
  
  <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-100">
    <div className="flex items-center gap-2">
      <input 
        type="text" 
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder={
          !isAssessed && chatMessages.length === 0 
            ? "Click 'Begin Assessment' to start..." 
            : isAssessed 
              ? "Ask about your Assessment results, courses, or job market insights..." 
              : "Type your answer here..."
        }
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        disabled={chatLoading || (!isAssessed && chatMessages.length === 0)}
      />
      <button 
        type="submit"
        disabled={chatLoading || !chatInput.trim() || (!isAssessed && chatMessages.length === 0)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
    <p className="text-xs text-gray-400 mt-2">
      {!isAssessed && chatMessages.length === 0 
        ? "Click 'Begin Assessment' to start your personalized career journey" 
        : isAssessed
          ? "AI-powered career guidance · Real-time labor market insights"
          : "Answer the questions to get your personalized learning path"}
    </p>
  </form>
</div>
            </div>

            {/* Right Column - Keep the rest of your JSX as is */}
            <div className="space-y-6">
              {/* Skills in Demand */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    Skills in Demand
                  </h2>
                  <p className="text-sm text-gray-600">Real-time from LinkedIn & Jobberman</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {inDemandSkills.map((skill) => (
                    <div key={skill.name} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          skill.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          skill.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{skill.priority}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">{skill.growth} growth</span>
                        <span className="text-gray-500">{skill.openings} openings</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50">
                  <button 
                    onClick={() => navigate('/market-insights')}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1">
                    View All Market Trends →
                  </button>
                </div>
              </div>

              {/* Job Matches */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                    Recommended Jobs For You
                  </h2>
                  <p className="text-sm text-gray-600">Based on your completed courses</p>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {jobMatches.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company} · {job.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {job.matchScore}% Match
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{job.salary}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => navigate('/jobs')}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                        View Job <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500">Job data aggregated from Indeed, LinkedIn & Jobberman</p>
                </div>
              </div>

              {/* Career Progress Insight */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
                <div className="flex items-start justify-between mb-3">
                  <Target className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Career Path</span>
                </div>
                <h3 className="font-semibold mb-1">Path to {userProfile.careerGoal}</h3>
                <p className="text-sm text-purple-100 mb-3">You're {userProfile.marketFit}% of the way to being job-ready</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                  <div className="bg-white rounded-full h-2" style={{ width: `${userProfile.marketFit}%` }}></div>
                </div>
                <p className="text-xs text-purple-100">Next milestone: Complete React.js Mastery course</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Complete Modal */}
        {showAssessmentCompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Title and Message */}
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Assessment Complete! 🎉</h2>
              <p className="text-slate-600 mb-2">
                Great job! Your assessment is complete.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Based on your responses, we've personalized your learning path as a <span className="font-semibold text-slate-700">{userProfile.careerGoal}</span> ({userProfile.skillLevel}).
              </p>

              {/* Market Fit */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-100">
                <p className="text-sm text-slate-600 mb-1">Your Job Market Fit</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{userProfile.marketFit}%</p>
                  <span className="text-sm text-slate-600">aligned with market demands</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowAssessmentCompleteModal(false);
                    navigate('/courses');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  📚 Browse All Courses
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowAssessmentCompleteModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}