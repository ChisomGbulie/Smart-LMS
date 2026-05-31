// server/api/chat-windows.js - Modified to skip Ollama
export async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userProfile, isAssessed, userId } = req.body;
  
  console.log(`📨 Received message from ${userId}: ${message}`);

  // Use smart responses directly (skip Ollama completely)
  const response = processConversation(message, userProfile, isAssessed, userId);
  
  res.status(200).json(response);
}

// Store user conversation state
const userStates = new Map();

// Course database mapping for recommendations
const courseDatabase = {
  'Frontend': {
    'React': ['react-complete-guide', 'frontend-mastery', 'modern-react'],
    'JavaScript': ['javascript-fundamentals', 'advanced-js', 'frontend-mastery'],
    'TypeScript': ['typescript-mastery', 'frontend-mastery'],
    'Tailwind CSS': ['frontend-mastery', 'modern-css'],
    'General': ['frontend-mastery', 'web-dev-bootcamp']
  },
  'Backend': {
    'Node.js': ['nodejs-mastery', 'backend-development', 'api-design'],
    'Python': ['python-mastery', 'backend-development', 'django-guide'],
    'Database': ['database-design', 'postgresql-mastery', 'mongodb-guide'],
    'API': ['api-design', 'nodejs-mastery', 'graphql-guide'],
    'General': ['backend-development', 'web-dev-bootcamp']
  }
};

function processConversation(message, userProfile, isAssessed, userId) {
  const msg = message.toLowerCase().trim();

  // Handle empty message to trigger welcome
  if (msg === '' && !isAssessed) {
    const state = userStates.get(userId);
    if (!state || state.step === 'welcome') {
      return {
        reply: "🎯 Welcome to your personalized learning journey!\n\nWhich path interests you most?\n\n🔹 **Frontend** - Build websites & user interfaces\n🔹 **Backend** - Build servers & databases\n🔹 **Full Stack** - Both frontend & backend\n\nType your choice (Frontend/Backend/Full Stack):",
        assessmentComplete: false
      };
    }
  }
  
  // Initialize user state if not exists
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      step: 'welcome',
      chosenPath: null,
      chosenSpecialization: null,
      yearsExperience: null,
      roadmapShown: false
    });
  }
  
  const state = userStates.get(userId);
  
  // If already assessed, handle general questions
  if (isAssessed && state.roadmapShown) {
    return handleGeneralQuestions(msg, userProfile);
  }
  
  // Step 1: Welcome and ask for learning path
  if (state.step === 'welcome') {
    state.step = 'asking_path';
    userStates.set(userId, state);
    return {
      reply: "🎯 Welcome to your personalized learning journey!\n\nWhich path interests you most?\n\n🔹 **Frontend** - Build websites & user interfaces\n🔹 **Backend** - Build servers & databases\n🔹 **Full Stack** - Both frontend & backend\n\nType your choice (Frontend/Backend/Full Stack):",
      assessmentComplete: false
    };
  }
  
  // Step 2: Ask for specialization based on chosen path
  if (state.step === 'asking_path') {
    // Detect the chosen path
    let chosenPath = null;
    if (msg.includes('frontend') || msg.includes('front-end') || msg.includes('front')) {
      chosenPath = 'Frontend';
    } else if (msg.includes('backend') || msg.includes('back-end') || msg.includes('back')) {
      chosenPath = 'Backend';
    } else if (msg.includes('full stack') || msg.includes('fullstack')) {
      chosenPath = 'Full Stack';
    } else {
      return {
        reply: "Please choose from:\n• Frontend\n• Backend\n• Full Stack\n\nType your choice:",
        assessmentComplete: false
      };
    }
    
    state.chosenPath = chosenPath;
    state.step = 'asking_specialization';
    userStates.set(userId, state);
    
    // Provide specialization options based on path
    const options = chosenPath === 'Frontend' 
      ? "🎨 **Frontend Specializations:**\n\n• React.js\n• Vue.js\n• Angular\n• JavaScript/TypeScript\n• Next.js\n• Tailwind CSS\n• General Frontend\n\nOr type your own specialization:"
      : chosenPath === 'Backend'
      ? "⚙️ **Backend Specializations:**\n\n• Node.js\n• Python\n• Java\n• PHP\n• Go\n• Ruby\n• Database Management\n• API Development\n• General Backend\n\nOr type your own specialization:"
      : "🚀 **Full Stack Specializations:**\n\n• MERN (MongoDB, Express, React, Node)\n• PERN (PostgreSQL, Express, React, Node)\n• MEAN (MongoDB, Express, Angular, Node)\n• JAMstack (JavaScript, APIs, Markup)\n• General Full Stack\n\nOr type your own specialization:";
    
    return {
      reply: `👍 Great choice! ${chosenPath} development is a fantastic career path.\n\n${options}`,
      assessmentComplete: false
    };
  }
  
  // Step 3: Ask for years of experience with the specialization
  if (state.step === 'asking_specialization') {
    // Store the chosen specialization
    let specialization = message.trim();
    state.chosenSpecialization = specialization;
    state.step = 'asking_experience';
    userStates.set(userId, state);
    
    return {
      reply: `📚 Great! Let me help you master ${specialization}.\n\nHow many years of experience do you have with ${specialization}?\n\n• 0-1 years (Beginner)\n• 1-3 years (Intermediate)\n• 3+ years (Advanced)\n\nType a number or level:`,
      assessmentComplete: false
    };
  }
  
  // Step 4: Generate roadmap with course recommendations
  if (state.step === 'asking_experience') {
    let years = parseFloat(msg);
    
    // Handle text responses
    if (isNaN(years)) {
      if (msg.includes('beginner') || msg.includes('just started') || msg.includes('no experience')) {
        years = 0;
      } else if (msg.includes('intermediate') || msg.includes('some experience')) {
        years = 2;
      } else if (msg.includes('advanced') || msg.includes('expert') || msg.includes('senior')) {
        years = 4;
      } else {
        return {
          reply: "Please tell me your experience level:\n• 0-1 years (Beginner)\n• 1-3 years (Intermediate)\n• 3+ years (Advanced)\n\nType a number or level:",
          assessmentComplete: false
        };
      }
    }
    
    // Determine experience level
    let experienceLevel = 'Beginner';
    if (years >= 3) {
      experienceLevel = 'Advanced';
    } else if (years >= 1) {
      experienceLevel = 'Intermediate';
    } else {
      experienceLevel = 'Beginner';
    }
    
    state.yearsExperience = years;
    state.experienceLevel = experienceLevel;
    state.step = 'showing_roadmap';
    state.roadmapShown = true;
    
    // Generate roadmap with course recommendations
    const roadmap = generateRoadmapWithCourses(
      state.chosenPath, 
      state.chosenSpecialization, 
      experienceLevel, 
      years
    );
    
    userStates.set(userId, state);
    
    return {
      reply: roadmap,
      assessmentComplete: true,
      skillLevel: experienceLevel,
      careerGoal: `${state.chosenSpecialization} ${state.chosenPath} Developer`
    };
  }
  
  return {
    reply: "👋 Welcome! Let's start with a simple question.\n\nWhich path interests you most? Frontend, Backend, or Full Stack?",
    assessmentComplete: false
  };
}

function generateRoadmapWithCourses(path, specialization, level, years) {
  const experienceNote = years < 1 ? "starting fresh" : 
                         years < 3 ? "with some experience" : 
                         "with solid experience";
  
  // Get course recommendations
  const recommendedCourses = getCourseRecommendations(path, specialization);
  
  // Generate specialization-specific roadmap
  let roadmapContent = '';
  
  if (path === 'Frontend') {
    roadmapContent = getFrontendRoadmap(specialization, level);
  } else if (path === 'Backend') {
    roadmapContent = getBackendRoadmap(specialization, level);
  } else {
    roadmapContent = getFullStackRoadmap(specialization, level);
  }
  
  return `🎯 **Your ${specialization} (${path}) Learning Roadmap**
${experienceNote.toUpperCase()} • ${level} Level

${roadmapContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 **Recommended Courses on Smart-LMS:**

${recommendedCourses}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


✅ **Next Steps:**
1️⃣ Enroll in the recommended courses above
2️⃣ Check "My Learning" page to track progress
3️⃣ Complete hands-on projects to build portfolio

Would you like me to recommend specific projects for ${specialization}?`;
}

function getFrontendRoadmap(specialization, level) {
  const lowerSpecial = specialization.toLowerCase();
  
  if (lowerSpecial.includes('react')) {
    if (level === 'Beginner') {
      return `** React Fundamentals**
├─ JSX & Components
├─ Props & State
├─ Hooks (useState, useEffect)
└─ Event Handling

** Advanced React**
├─ Context API & Redux
├─ React Router
├─ Performance Optimization
└─ Testing with Jest

** Real-World Projects**
├─ E-commerce Dashboard
├─ Task Management App
└─ Portfolio Website`;
    } else if (level === 'Intermediate') {
      return `**Month 1-2: Advanced Patterns**
├─ Custom Hooks
├─ Render Props & HOCs
├─ Code Splitting
└─ Server-Side Rendering

** State Management**
├─ Redux Toolkit
├─ Zustand
├─ React Query
└─ Context Optimization

** Performance & Scale**
├─ Memoization
├─ Virtual DOM Optimization
├─ Lazy Loading
└─ Progressive Web Apps`;
    } else {
      return `**Month 1-2: Architecture**
├─ Micro-frontends
├─ Module Federation
├─ Monorepo Management
└─ Design Systems

** Advanced Optimization**
├─ Core Web Vitals
├─ Bundle Analysis
├─ Advanced Caching
└─ WebAssembly Integration

** Leadership**
├─ Team Code Reviews
├─ Technical Documentation
├─ Mentoring Juniors
└─ Open Source Contribution`;
    }
  }
  
  // Default frontend roadmap
  return `** Core Fundamentals**
├─ HTML5 & CSS3 (Flexbox, Grid)
├─ JavaScript (ES6+)
└─ Responsive Design

** Framework Mastery**
├─ React.js or Vue.js
├─ State Management
└─ API Integration

** Advanced Topics**
├─ TypeScript
├─ Performance Optimization
└─ Deployment & CI/CD`;
}

function getBackendRoadmap(specialization, level) {
  const lowerSpecial = specialization.toLowerCase();
  
  if (lowerSpecial.includes('node')) {
    if (level === 'Beginner') {
      return `** Node.js Basics**
├─ Event Loop & Async Patterns
├─ Express.js Framework
├─ REST API Design
└─ Middleware & Routing

** Databases**
├─ MongoDB with Mongoose
├─ PostgreSQL with Prisma
├─ Authentication (JWT, OAuth)
└─ File Uploads

** Production Ready**
├─ Error Handling
├─ Logging & Monitoring
├─ Performance Optimization
└─ Deployment (Heroku, Railway)`;
    } else if (level === 'Intermediate') {
      return `**Month 1-2: Advanced Backend**
├─ Microservices Architecture
├─ Message Queues (RabbitMQ)
├─ WebSockets (Socket.io)
└─ GraphQL API

** Security & Scaling**
├─ Rate Limiting
├─ DDoS Protection
├─ Database Optimization
└─ Caching (Redis)

** DevOps Integration**
├─ Docker & Kubernetes
├─ CI/CD Pipelines
├─ Cloud Services (AWS)
└─ Performance Testing`;
    } else {
      return `**Month 1-2: System Architecture**
├─ Distributed Systems
├─ Event-Driven Architecture
├─ CQRS Pattern
└─ Load Balancing

** High Performance**
├─ Database Sharding
├─ Advanced Caching Strategies
├─ Real-time Analytics
└─ Disaster Recovery

** Technical Leadership**
├─ Architecture Reviews
├─ Team Mentoring
├─ Technical Debt Management
└─ System Migration Planning`;
    }
  }
  
  // Default backend roadmap
  return `** Backend Fundamentals**
├─ Server-side JavaScript/Python
├─ RESTful APIs
└─ Basic HTTP Concepts

** Databases & Auth**
├─ SQL & NoSQL Databases
├─ Authentication & Authorization
└─ API Security

** Advanced Topics**
├─ Microservices
├─ Docker & Deployment
└─ Performance Optimization`;
}

function getFullStackRoadmap(specialization, level) {
  if (level === 'Beginner') {
    return `** Frontend Foundation**
├─ HTML/CSS/JavaScript
├─ React.js Basics
└─ Responsive Design

** Backend Foundation**
├─ Node.js & Express
├─ Database Design
└─ REST APIs

** Integration**
├─ Connecting Frontend to Backend
├─ Authentication
└─ Deployment`;
  } else if (level === 'Intermediate') {
    return `** Modern Stack**
├─ Next.js (Full Stack Framework)
├─ TypeScript
└─ Tailwind CSS

** Advanced Features**
├─ Real-time with WebSockets
├─ State Management
└─ File Uploads

** DevOps**
├─ Docker
├─ CI/CD
└─ Cloud Deployment`;
  } else {
    return `**Month 1-2: Advanced Architecture**
├─ Microservices + Micro-frontends
├─ GraphQL Federation
└─ Event-Driven Design

** Performance & Scale**
├─ Full Stack Optimization
├─ CDN & Edge Computing
└─ Database Sharding

** Leadership**
├─ Technical Decision Making
├─ Team Leadership
└─ Enterprise Architecture`;
  }
}

function getCourseRecommendations(path, specialization) {
  const lowerSpecial = specialization.toLowerCase();
  let courses = [];
  
  // Match specialization to courses
  if (path === 'Frontend') {
    if (lowerSpecial.includes('react')) {
      courses = ['🚀 React - The Complete Guide', '💎 Frontend Mastery Bundle', '⚛️ Advanced React Patterns'];
    } else if (lowerSpecial.includes('vue')) {
      courses = ['💚 Vue.js Mastery Course', '🎨 Frontend Mastery Bundle'];
    } else if (lowerSpecial.includes('angular')) {
      courses = ['🅰️ Angular Complete Guide', '📘 Frontend Mastery Bundle'];
    } else if (lowerSpecial.includes('javascript') || lowerSpecial.includes('typescript')) {
      courses = ['📜 JavaScript Fundamentals', '🔷 TypeScript Mastery', '💎 Frontend Mastery Bundle'];
    } else if (lowerSpecial.includes('next')) {
      courses = ['▲ Next.js Complete Guide', '⚛️ React - The Complete Guide'];
    } else {
      courses = ['💎 Frontend Mastery Bundle', '🎨 Modern Web Design', '📜 JavaScript Fundamentals'];
    }
  } else if (path === 'Backend') {
    if (lowerSpecial.includes('node')) {
      courses = ['🟢 Node.js Mastery', '🔧 Backend Development Pro', '📡 API Design & Development'];
    } else if (lowerSpecial.includes('python')) {
      courses = ['🐍 Python Mastery', '🌿 Django Complete Guide', '🔧 Backend Development Pro'];
    } else if (lowerSpecial.includes('database')) {
      courses = ['🗄️ Database Design & Management', '📊 PostgreSQL Mastery', '🍃 MongoDB Complete Guide'];
    } else if (lowerSpecial.includes('api')) {
      courses = ['📡 API Design & Development', '🟢 Node.js Mastery', '🔷 GraphQL Guide'];
    } else {
      courses = ['🔧 Backend Development Pro', '🟢 Node.js Mastery', '🗄️ Database Design'];
    }
  } else {
    courses = ['🚀 Full Stack Web Development Bootcamp', '💎 MERN Stack Mastery', '▲ Next.js Complete Guide'];
  }
  
  return courses.map(c => `• ${c}`).join('\n');
}

function handleGeneralQuestions(message, userProfile) {
  const msg = message.toLowerCase();
  const path = userProfile.careerGoal || 'Developer';
  
  if (msg.includes('roadmap') || msg.includes('path') || msg.includes('plan')) {
    return {
      reply: `Would you like me to show you the roadmap for ${path} again? Just type "show roadmap" and I'll resend it!`,
      assessmentComplete: false
    };
  }
  
  if (msg.includes('show roadmap')) {
    return {
      reply: `To see your personalized roadmap again, please click "Start Assessment" to begin a new session. Your previous roadmap was customized for ${path}.`,
      assessmentComplete: false
    };
  }
  
  if (msg.includes('course') || msg.includes('courses')) {
    return {
      reply: `📚 **Recommended Courses for ${path}:**\n\n• Full Stack Web Development Bootcamp\n• React - The Complete Guide\n• Node.js Mastery\n• Database Design & Management\n\nVisit the "Courses" page to enroll! 🎓`,
      assessmentComplete: false
    };
  }
  
  if (msg.includes('job') || msg.includes('salary')) {
    return {
      reply: `💼 **${path} Market Insights (Nigeria):**\n\n• Entry-level: ₦300k-450k/month\n• Mid-level: ₦500k-750k/month\n• Senior: ₦800k-1.2M/month\n\n🔥 Demand is growing 28% year-over-year!`,
      assessmentComplete: false
    };
  }
  
  if (msg.includes('skill') || msg.includes('technology')) {
    return {
      reply: `🔧 **Top Skills for ${path} in 2025:**\n\n✓ React.js, TypeScript, Next.js\n✓ Node.js, Python, PostgreSQL\n✓ Docker, Git, CI/CD\n✓ Cloud (AWS, Azure, GCP)`,
      assessmentComplete: false
    };
  }
  
  if (msg.includes('project') || msg.includes('build')) {
    return {
      reply: `🎯 **Portfolio Project Ideas for ${path}:**\n\n• E-commerce Website\n• Task Management App\n• Blog Platform with CMS\n• Real-time Chat Application\n• Dashboard with Analytics\n\nStart with a simple project and scale up!`,
      assessmentComplete: false
    };
  }
  
  return {
    reply: `I'm here to help with your ${path} journey! Ask me about:\n\n• 📚 Course recommendations (type "courses")\n• 💼 Job market & salaries (type "salary")\n• 🔧 Required skills (type "skills")\n• 🎯 Project ideas (type "projects")\n• 🗺️ Your learning roadmap (type "roadmap")\n\nWhat would you like to know?`,
    assessmentComplete: false
  };
}