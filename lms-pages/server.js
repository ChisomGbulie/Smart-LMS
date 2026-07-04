import express from 'express';
import cors from 'cors';
import { saveAssessment, getAssessment, saveLearningPath, getLearningPath, deleteAssessment } from './server/utils/assessmentDB.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'smart-lms-chat' });
});

// Store conversation state for each user
const conversationState = new Map();

// Store assessment results for each user (persists after assessment)
const assessmentResults = new Map();

// Define assessment questions in sequence
const assessmentQuestions = {
  START: {
    question: "Which path interests you most? Frontend, Backend, or Full Stack?",
    key: 'careerGoal',
    nextStep: 'SPECIFIC_TECH',
    validate: (answer) => {
      const valid = ['frontend', 'backend', 'full stack', 'fullstack'];
      return valid.includes(answer.toLowerCase());
    },
    parse: (answer) => {
      const mapping= {
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
        'full stack': 'Full Stack Developer',
        'fullstack': 'Full Stack Developer'
      };
      return mapping[answer.toLowerCase()];
    }
  },
  SPECIFIC_TECH: {
    question: (careerGoal) => {
      if (careerGoal === 'Frontend Developer') {
        return "Great! Which frontend framework interests you most? React, Vue, or Angular?";
      } else if (careerGoal === 'Backend Developer') {
        return "Awesome! Which backend technology do you want to focus on? Node.js or Python?";
      } else {
        return "Excellent choice! Which stack do you prefer? MERN (MongoDB, Express, React, Node.js) or MEAN (MongoDB, Express, Angular, Node.js)?";
      }
    },
    key: 'specificTech',
    nextStep: 'SKILL_LEVEL',
    validate: (answer, careerGoal) => {
      if (careerGoal === 'Frontend Developer') {
        const valid = ['react', 'vue', 'angular'];
        return valid.includes(answer.toLowerCase());
      } else if (careerGoal === 'Backend Developer') {
        const valid = ['node.js', 'node', 'python'];
        return valid.includes(answer.toLowerCase());
      } else {
        const valid = ['mern', 'mean'];
        return valid.includes(answer.toLowerCase());
      }
    },
    parse: (answer, careerGoal) => {
      if (careerGoal === 'Frontend Developer') {
        const mapping = {
          'react': 'React',
          'vue': 'Vue',
          'angular': 'Angular'
        };
        return mapping[answer.toLowerCase()];
      } else if (careerGoal === 'Backend Developer') {
        const mapping = {
          'node.js': 'Node.js',
          'node': 'Node.js',
          'python': 'Python'
        };
        return mapping[answer.toLowerCase()];
      } else {
        const mapping = {
          'mern': 'MERN',
          'mean': 'MEAN'
        };
        return mapping[answer.toLowerCase()];
      }
    }
  },
  SKILL_LEVEL: {
    question: "What's your current skill level in that specific technology? (Beginner, Intermediate, Advanced)",
    key: 'skillLevel',
    nextStep: 'COMPLETE',
    validate: (answer) => {
      const valid = ['beginner', 'intermediate', 'advanced'];
      return valid.includes(answer.toLowerCase());
    },
    parse: (answer) => {
      return answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase();
    }
  }
};

// Course recommendations
const courseRecommendations = {
  'Frontend Developer': {
    'React': {
      beginner: ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced', 'React.js Mastery'],
      intermediate: ['React.js Mastery', 'TypeScript for Professionals'],
      advanced: ['React.js Mastery', 'TypeScript for Professionals', 'Advanced React Patterns']
    },
    'Vue': {
      beginner: ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced'],
      intermediate: ['Vue.js Mastery'],
      advanced: ['Vue.js Mastery', 'TypeScript for Professionals']
    },
    'Angular': {
      beginner: ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced'],
      intermediate: ['Angular Complete Guide'],
      advanced: ['Angular Complete Guide', 'TypeScript for Professionals']
    }
  },
  'Backend Developer': {
    'Node.js': {
      beginner: ['JavaScript Fundamentals to Advanced', 'Node.js & Express Backend Development'],
      intermediate: ['Node.js & Express Backend Development', 'TypeScript for Professionals'],
      advanced: ['Node.js & Express Backend Development', 'Advanced Backend Architecture']
    },
    'Python': {
      beginner: ['Python Programming Fundamentals'],
      intermediate: ['Python Backend Development'],
      advanced: ['Advanced Python', 'Django Mastery']
    }
  },
  'Full Stack Developer': {
    'MERN': {
      beginner: ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced', 'React.js Mastery', 'Node.js & Express Backend Development'],
      intermediate: ['React.js Mastery', 'Node.js & Express Backend Development', 'TypeScript for Professionals'],
      advanced: ['React.js Mastery', 'Node.js & Express Backend Development', 'TypeScript for Professionals', 'Advanced Full Stack']
    },
    'MEAN': {
      beginner: ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced', 'Angular Complete Guide', 'Node.js & Express Backend Development'],
      intermediate: ['Angular Complete Guide', 'Node.js & Express Backend Development', 'TypeScript for Professionals'],
      advanced: ['Angular Complete Guide', 'Node.js & Express Backend Development', 'TypeScript for Professionals']
    }
  }
};

// Learning roadmaps
const learningRoadmaps = {
  'Frontend Developer': {
    'React': {
      beginner: `📚 **Your Frontend (React) Learning Roadmap for Beginners:**
**Phase 1: Foundations (2-3 weeks)**
• HTML5 & CSS3 fundamentals
• JavaScript basics (variables, functions, arrays)
• Responsive design principles

**Phase 2: React Basics (3-4 weeks)**
• Components & Props
• State & Lifecycle
• Handling events
• Conditional rendering

**Phase 3: Projects (3-4 weeks)**
• Build 2-3 real-world projects
• Deploy to Vercel/Netlify
• Create GitHub portfolio`,
      intermediate: `📚 **Your Frontend (React) Learning Roadmap for Intermediate Level:**
**Phase 1: Advanced React (2-3 weeks)**
• Custom Hooks
• useMemo & useCallback
• Code splitting & lazy loading

**Phase 2: State Management (2-3 weeks)**
• Redux Toolkit
• Zustand or MobX
• Context API patterns

**Phase 3: Full-stack Integration (3 weeks)**
• Next.js fundamentals
• API routes
• TypeScript with React`,
      advanced: `📚 **Your Frontend (React) Learning Roadmap for Advanced Level:**
**Phase 1: Architecture Patterns (2-3 weeks)**
• Micro-frontends
• Monorepo management
• Design systems

**Phase 2: Performance Mastery (2-3 weeks)**
• Core Web Vitals optimization
• Advanced code splitting
• Service workers & PWA

**Phase 3: Leadership Skills (2 weeks)**
• Code review best practices
• Technical documentation
• Mentoring junior developers`
    }
  },
  'Backend Developer': {
    'Node.js': {
      beginner: `📚 **Your Backend (Node.js) Learning Roadmap for Beginners:**
**Phase 1: JavaScript Fundamentals (2-3 weeks)**
• Async/await & Promises
• Event loop understanding
• ES6+ features

**Phase 2: Node.js Basics (3-4 weeks)**
• NPM & modules
• Express Framework
• RESTful API design

**Phase 3: Databases (3-4 weeks)**
• MongoDB with Mongoose
• Authentication (JWT)
• API documentation`,
      intermediate: `📚 **Your Backend (Node.js) Learning Roadmap for Intermediate Level:**
**Phase 1: Advanced Express (2-3 weeks)**
• Custom middleware
• Rate limiting & security
• WebSockets with Socket.io

**Phase 2: Database Mastery (3 weeks)**
• Database indexing
• Query optimization
• Caching strategies (Redis)

**Phase 3: Testing & Deployment (3 weeks)**
• Unit testing with Jest
• Docker & containerization
• CI/CD pipelines`,
      advanced: `📚 **Your Backend (Node.js) Learning Roadmap for Advanced Level:**
**Phase 1: Microservices Architecture (3-4 weeks)**
• Service decomposition
• API Gateway patterns
• Message queues (RabbitMQ)

**Phase 2: Scalability (3 weeks)**
• Load balancing
• Performance optimization
• Cloud deployment (AWS/GCP)

**Phase 3: DevOps & Cloud (3 weeks)**
• Kubernetes orchestration
• Advanced monitoring
• System design`
    }
  },
  'Full Stack Developer': {
    'MERN': {
      beginner: `📚 **Your Full Stack (MERN) Learning Roadmap for Beginners:**
**Phase 1: Frontend Foundations (4-5 weeks)**
• HTML/CSS/JavaScript basics
• React fundamentals
• Responsive design

**Phase 2: Backend Foundations (4-5 weeks)**
• Node.js basics
• Express framework
• RESTful APIs

**Phase 3: Database Integration (3-4 weeks)**
• MongoDB basics
• Connecting Frontend to Backend
• Authentication flow

**Phase 4: Full Stack Projects (4-5 weeks)**
• Build complete MERN apps
• Deployment strategies
• Portfolio development`,
      intermediate: `📚 **Your Full Stack (MERN) Learning Roadmap for Intermediate Level:**
**Phase 1: Advanced Frontend (3 weeks)**
• Custom hooks & context
• Performance optimization
• Next.js fundamentals

**Phase 2: Advanced Backend (3 weeks)**
• Microservices basics
• WebSocket integration
• Advanced security

**Phase 3: DevOps (2-3 weeks)**
• Docker & Kubernetes
• CI/CD pipelines
• Cloud deployment`,
      advanced: `📚 **Your Full Stack (MERN) Learning Roadmap for Advanced Level:**
**Phase 1: Architecture Design (3-4 weeks)**
• Scalable architecture patterns
• Microservices with Node.js
• Frontend micro-frontends

**Phase 2: Performance Engineering (3 weeks)**
• Load testing
• Performance monitoring
• Optimization strategies

**Phase 3: Technical Leadership (2-3 weeks)**
• System design interviews
• Code review best practices
• Team collaboration tools`
    }
  }
};

app.post('/api/chat', async (req, res) => {
  const { message, userProfile, isAssessed, userId } = req.body;
  
  console.log(`📨 Received message from ${userId}: ${message}`);
  console.log(`🔍 Current state for user:`, conversationState.get(userId));
  
  // If already assessed, handle as regular chat
  if (isAssessed) {
    const response = handleRegularChat(message, userProfile, userId);
    if (typeof response === 'string') {
      return res.json({ reply: response });
    } else {
      return res.json(response);
    }
  }
  
  // Get or create conversation state for this user
  let state = conversationState.get(userId);
  
  // If no state exists, create a new one
  if (!state) {
    console.log(`🆕 Creating new state for user ${userId}`);
    state = {
      step: 'START',
      collectedData: {}
    };
    conversationState.set(userId, state);
    
    // Return the first question
    const firstQuestion = assessmentQuestions.START.question;
    return res.json({ 
      reply: `👋 Welcome! Let's start with a simple question.\n\n${firstQuestion}`
    });
  }
  
  // Get the current step
  const currentStepKey = state.step;
  const currentStep = assessmentQuestions[currentStepKey];
  
  console.log(`📍 Current step: ${currentStepKey}`);
  
  if (!currentStep) {
    // Invalid state, reset
    console.log(`⚠️ Invalid state, resetting for user ${userId}`);
    conversationState.delete(userId);
    return res.json({ 
      reply: "Let's start over. Which path interests you most? Frontend, Backend, or Full Stack?"
    });
  }
  
  // For the START step, process the career path answer
  if (currentStepKey === 'START') {
    // Validate the answer
    if (!currentStep.validate(message)) {
      return res.json({
        reply: `I didn't quite understand that. ${currentStep.question}`
      });
    }
    
    // Parse and store the career goal
    const careerGoal = currentStep.parse(message);
    state.collectedData.careerGoal = careerGoal;
    
    // Move to next step
    state.step = 'SPECIFIC_TECH';
    conversationState.set(userId, state);
    
    // Get the next question
    const nextQuestion = assessmentQuestions.SPECIFIC_TECH.question(careerGoal);
    return res.json({
      reply: nextQuestion
    });
  }
  
  // For SPECIFIC_TECH step
  if (currentStepKey === 'SPECIFIC_TECH') {
    // Validate with careerGoal context
    const careerGoal = state.collectedData.careerGoal;
    const isValid = currentStep.validate(message, careerGoal);
    
    if (!isValid) {
      const questionText = currentStep.question(careerGoal);
      return res.json({
        reply: `I didn't quite understand that. ${questionText}`
      });
    }
    
    // Parse and store the specific technology
    const specificTech = currentStep.parse(message, careerGoal);
    state.collectedData.specificTech = specificTech;
    
    // Move to next step
    state.step = 'SKILL_LEVEL';
    conversationState.set(userId, state);
    
    // Return skill level question
    return res.json({
      reply: assessmentQuestions.SKILL_LEVEL.question
    });
  }
  
  // For SKILL_LEVEL step
  if (currentStepKey === 'SKILL_LEVEL') {
    // Validate skill level
    if (!currentStep.validate(message)) {
      return res.json({
        reply: `I didn't quite understand that. ${currentStep.question}`
      });
    }
    
    // Parse and store skill level
    const skillLevel = currentStep.parse(message);
    state.collectedData.skillLevel = skillLevel;
    
    // Complete assessment
    const careerGoal = state.collectedData.careerGoal;
    const specificTech = state.collectedData.specificTech;
    
    // Get learning roadmap
    const roadmap = learningRoadmaps[careerGoal]?.[specificTech]?.[skillLevel.toLowerCase()] || 
      `📚 **Your ${careerGoal} (${specificTech}) Learning Roadmap for ${skillLevel}s:**\n\nCheck our course recommendations below to start your journey!`;
    
    // Get course recommendations
    const recommendedCourses = courseRecommendations[careerGoal]?.[specificTech]?.[skillLevel.toLowerCase()] || 
      ['Introduction to Web Development', 'JavaScript Fundamentals to Advanced'];
    
    // Build courses list string
    const coursesList = recommendedCourses.map(course => `• ${course}`).join('\n');
    
    // Save assessment to database
    const assessmentData = {
      careerGoal,
      specialization: specificTech,
      experienceLevel: skillLevel,
      yearsExperience: 0
    };
    await saveAssessment(userId, assessmentData);
    
    // Save learning path to database
    const pathData = {
      roadmapContent: roadmap,
      recommendedCourses: recommendedCourses
    };
    await saveLearningPath(userId, pathData);
    
    // Store assessment results for later retrieval (in-memory for session)
    assessmentResults.set(userId, {
      careerGoal,
      specificTech,
      skillLevel,
      recommendedCourses,
      roadmap
    });
    
    // Clear conversation state
    conversationState.delete(userId);
    
    console.log(`✅ Assessment complete for ${userId}`);
    
    // Return response WITHOUT market fit score, and with a special flag for the button
    return res.json({
      reply: `✅ **Assessment Complete!**\n\nBased on your answers:\n• **Career Path:** ${careerGoal}\n• **Technology:** ${specificTech}\n• **Skill Level:** ${skillLevel}\n\n${roadmap}\n\n**🎓 Recommended Courses for You:**\n${coursesList}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✨ **Ready to start learning?** ✨\n\nClick the button below to browse all courses and enroll in your recommended path!`,
      assessmentComplete: true,
      careerGoal: careerGoal,
      skillLevel: skillLevel,
      specificTech: specificTech,
      recommendedCourses: recommendedCourses,
      showCoursesButton: true  // Special flag to show button in chat
    });
  }
  
  // Fallback
  return res.json({
    reply: "Let's start over. Which path interests you most? Frontend, Backend, or Full Stack?"
  });
});

// Regular chat handler after assessment is complete
function handleRegularChat(message, userProfile, userId) {
  const lowerMsg = message.toLowerCase();
  
  // Handle assessment request
  if (lowerMsg.includes('assessment')) {
    const results = assessmentResults.get(userId);
    if (results) {
      const { careerGoal, specificTech, skillLevel, roadmap, recommendedCourses } = results;
      const coursesList = recommendedCourses.map(course => `• ${course}`).join('\n');
      
      return {
        reply: `✅ **Assessment Complete!**\n\nBased on your answers:\n• **Career Path:** ${careerGoal}\n• **Technology:** ${specificTech}\n• **Skill Level:** ${skillLevel}\n\n${roadmap}\n\n**🎓 Recommended Courses for You:**\n${coursesList}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✨ **Ready to start learning?** ✨\n\nClick the button below to browse all courses and enroll in your recommended path!`,
        showCoursesButton: true
      };
    }
    return "You haven't completed an assessment yet. Would you like to start one?";
  }
  
  if (lowerMsg.includes('course') || lowerMsg.includes('learn')) {
    return "📚 **Recommended Courses:**\n\n• Introduction to Web Development\n• JavaScript Fundamentals to Advanced\n• React.js Mastery\n• Node.js & Express Backend Development\n\nVisit the Courses page to enroll! 🎓";
  }
  
  if (lowerMsg.includes('job') || lowerMsg.includes('salary')) {
    return "💼 **Market Insights (Nigeria):**\n\n• Entry-level: ₦300k-450k/month\n• Mid-level: ₦500k-750k/month\n• Senior: ₦800k-1.2M/month\n\n🔥 Demand is growing 28% year-over-year!\n\nTop companies hiring: Flutterwave, Paystack, Andela";
  }
  
  if (lowerMsg.includes('skill') || lowerMsg.includes('technology')) {
    return "🔧 **Top Skills for 2025:**\n\n✓ React.js, TypeScript, Next.js\n✓ Node.js, Python, PostgreSQL\n✓ Docker, Git, CI/CD\n✓ Cloud (AWS, Azure, GCP)\n\nWhich skill would you like to learn more about?";
  }
  
  if (lowerMsg.includes('project')) {
    return "🎯 **Portfolio Project Ideas:**\n\n• E-commerce Website\n• Task Management App\n• Blog Platform with CMS\n• Real-time Chat Application\n• Dashboard with Analytics\n\nStart with a simple project and scale up!";
  }
  
  return "I'm here to help with your learning journey! Ask me about:\n\n• 📚 Courses (type 'courses')\n• 💼 Jobs & salaries (type 'jobs')\n• 🔧 Skills (type 'skills')\n• 🎯 Projects (type 'projects')\n• 📋 Assessment (type 'assessment')\n\nWhat would you like to know?";
}

// API Endpoints for Assessment Management
// Get user's assessment
app.get('/api/assessment/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await getAssessment(userId);
    
    if (!result.success) {
      return res.status(404).json({ 
        exists: false,
        message: 'No assessment found for this user' 
      });
    }
    
    return res.json({
      exists: true,
      assessment: result.data
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's learning path
app.get('/api/learning-path/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await getLearningPath(userId);
    
    if (!result.success || !result.exists) {
      return res.status(404).json({ 
        exists: false,
        message: 'No learning path found for this user' 
      });
    }
    
    return res.json({
      exists: true,
      learningPath: result.data
    });
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: error.message });
  }
});

// Retake assessment - delete existing and start fresh
app.post('/api/retake-assessment/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await deleteAssessment(userId);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    // Clear from memory as well
    assessmentResults.delete(userId);
    conversationState.delete(userId);
    
    return res.json({ 
      success: true,
      message: 'Assessment deleted. Ready to start a new one!' 
    });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get complete user profile with assessment and learning path
app.get('/api/user-profile/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const assessment = await getAssessment(userId);
    const learningPath = await getLearningPath(userId);
    
    const profile = {
      userId,
      hasAssessment: assessment.exists,
      assessment: assessment.exists ? assessment.data : null,
      hasLearningPath: learningPath.exists,
      learningPath: learningPath.exists ? learningPath.data : null
    };
    
    return res.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clean up old conversation states every hour
setInterval(() => {
  conversationState.clear();
  console.log('🧹 Cleaned up conversation states');
}, 3600000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});