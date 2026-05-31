// src/data/courses.js

export const courses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and basic JavaScript",
    category: "Web Development",
    level: "Beginner",
    duration: "40 hours",
    modules: 8,
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 12450,
    image: "/courses/web-dev-basics.jpg",
    prerequisites: ["Basic computer literacy"],
    learningOutcomes: [
      "Build responsive websites using HTML5 and CSS3",
      "Understand core JavaScript concepts",
      "Deploy websites to production",
      "Work with developer tools"
    ],
    syllabus: [
      { module: 1, title: "HTML Fundamentals", duration: "5 hours", topics: ["Tags", "Elements", "Forms", "Semantic HTML"] },
      { module: 2, title: "CSS Styling", duration: "8 hours", topics: ["Selectors", "Flexbox", "Grid", "Responsive Design"] },
      { module: 3, title: "JavaScript Basics", duration: "10 hours", topics: ["Variables", "Functions", "Arrays", "Objects"] },
      { module: 4, title: "DOM Manipulation", duration: "6 hours", topics: ["Selectors", "Events", "Dynamic Content"] },
      { module: 5, title: "Git & Version Control", duration: "4 hours", topics: ["Commits", "Branches", "GitHub"] },
      { module: 6, title: "Responsive Design", duration: "3 hours", topics: ["Media Queries", "Mobile First"] },
      { module: 7, title: "Web Accessibility", duration: "2 hours", topics: ["ARIA", "Semantic HTML", "Screen Readers"] },
      { module: 8, title: "Final Project", duration: "2 hours", topics: ["Portfolio Website"] }
    ]
  },
  {
    id: 2,
    title: "JavaScript Fundamentals to Advanced",
    description: "Master JavaScript from basics to advanced concepts including ES6+, async programming, and more",
    category: "Programming",
    level: "Intermediate",
    duration: "60 hours",
    modules: 12,
    instructor: "Michael Chen",
    rating: 4.9,
    students: 18900,
    image: "/courses/js-advanced.jpg",
    prerequisites: ["Basic HTML/CSS", "Understanding of programming concepts"],
    learningOutcomes: [
      "Write clean, efficient JavaScript code",
      "Understand closures, promises, and async/await",
      "Work with APIs and fetch data",
      "Build interactive web applications"
    ],
    syllabus: [
      { module: 1, title: "Variables & Data Types", duration: "4 hours", topics: ["var/let/const", "Primitives", "Type Coercion"] },
      { module: 2, title: "Functions & Scope", duration: "5 hours", topics: ["Declarations", "Arrow Functions", "Hoisting"] },
      { module: 3, title: "Arrays & Objects", duration: "5 hours", topics: ["Methods", "Destructuring", "Spread/Rest"] },
      { module: 4, title: "DOM Manipulation", duration: "6 hours", topics: ["Selectors", "Events", "Forms"] },
      { module: 5, title: "ES6+ Features", duration: "6 hours", topics: ["Classes", "Modules", "Template Literals"] },
      { module: 6, title: "Asynchronous JavaScript", duration: "7 hours", topics: ["Callbacks", "Promises", "Async/Await"] },
      { module: 7, title: "Error Handling", duration: "3 hours", topics: ["Try/Catch", "Debugging", "Error Types"] },
      { module: 8, title: "Working with APIs", duration: "6 hours", topics: ["Fetch API", "REST", "JSON"] },
      { module: 9, title: "Regular Expressions", duration: "4 hours", topics: ["Patterns", "Matching", "Replacement"] },
      { module: 10, title: "Browser APIs", duration: "5 hours", topics: ["LocalStorage", "Geolocation", "Canvas"] },
      { module: 11, title: "Testing & Debugging", duration: "4 hours", topics: ["Jest", "Console", "DevTools"] },
      { module: 12, title: "Final Project", duration: "5 hours", topics: ["Build a Full App"] }
    ]
  },
  {
    id: 3,
    title: "React.js Mastery",
    description: "Build modern, responsive web applications with React.js and hooks",
    category: "Frontend Framework",
    level: "Intermediate",
    duration: "50 hours",
    modules: 10,
    instructor: "Emily Rodriguez",
    rating: 4.9,
    students: 15600,
    image: "/courses/react-mastery.jpg",
    prerequisites: ["Strong JavaScript knowledge", "ES6+ understanding"],
    learningOutcomes: [
      "Build complete React applications",
      "Master hooks and state management",
      "Implement routing and authentication",
      "Optimize performance"
    ],
    syllabus: [
      { module: 1, title: "React Fundamentals", duration: "5 hours", topics: ["Components", "JSX", "Props"] },
      { module: 2, title: "State & Lifecycle", duration: "6 hours", topics: ["useState", "useEffect", "Lifecycle"] },
      { module: 3, title: "Handling Events", duration: "3 hours", topics: ["Event Handlers", "Forms", "Refs"] },
      { module: 4, title: "Lists & Keys", duration: "3 hours", topics: ["Rendering Lists", "Keys", "Conditional Rendering"] },
      { module: 5, title: "React Router", duration: "5 hours", topics: ["Routing", "Navigation", "Protected Routes"] },
      { module: 6, title: "State Management", duration: "7 hours", topics: ["Context API", "useReducer", "Redux Intro"] },
      { module: 7, title: "Hooks Deep Dive", duration: "6 hours", topics: ["Custom Hooks", "useMemo", "useCallback"] },
      { module: 8, title: "API Integration", duration: "5 hours", topics: ["Fetching Data", "Axios", "Loading States"] },
      { module: 9, title: "Styling in React", duration: "4 hours", topics: ["CSS Modules", "Styled Components", "Tailwind"] },
      { module: 10, title: "Final Project", duration: "6 hours", topics: ["E-commerce Application"] }
    ]
  },
  {
    id: 4,
    title: "Node.js & Express Backend Development",
    description: "Build scalable backend APIs and full-stack applications with Node.js",
    category: "Backend Development",
    level: "Intermediate",
    duration: "55 hours",
    modules: 11,
    instructor: "David Kim",
    rating: 4.7,
    students: 9870,
    image: "/courses/nodejs-backend.jpg",
    prerequisites: ["JavaScript proficiency", "Understanding of databases"],
    learningOutcomes: [
      "Build RESTful APIs",
      "Implement authentication and authorization",
      "Work with databases",
      "Deploy Node.js applications"
    ],
    syllabus: [
      { module: 1, title: "Node.js Introduction", duration: "4 hours", topics: ["Event Loop", "NPM", "Modules"] },
      { module: 2, title: "Express Framework", duration: "5 hours", topics: ["Routing", "Middleware", "Error Handling"] },
      { module: 3, title: "RESTful APIs", duration: "6 hours", topics: ["CRUD", "HTTP Methods", "Status Codes"] },
      { module: 4, title: "MongoDB Integration", duration: "6 hours", topics: ["Mongoose", "Schemas", "Models"] },
      { module: 5, title: "Authentication", duration: "5 hours", topics: ["JWT", "bcrypt", "Sessions"] },
      { module: 6, title: "Authorization", duration: "3 hours", topics: ["Roles", "Permissions", "Middleware"] },
      { module: 7, title: "File Uploads", duration: "4 hours", topics: ["Multer", "Cloud Storage"] },
      { module: 8, title: "WebSockets", duration: "4 hours", topics: ["Socket.io", "Real-time Features"] },
      { module: 9, title: "Security Best Practices", duration: "4 hours", topics: ["Helmet", "CORS", "XSS Protection"] },
      { module: 10, title: "Testing & Deployment", duration: "6 hours", topics: ["Jest", "Heroku", "Environment Variables"] },
      { module: 11, title: "Final Project", duration: "8 hours", topics: ["Full Stack Application"] }
    ]
  },
  {
    id: 5,
    title: "TypeScript for Professionals",
    description: "Master TypeScript to build type-safe, scalable applications",
    category: "Programming",
    level: "Intermediate",
    duration: "35 hours",
    modules: 7,
    instructor: "Alex Turner",
    rating: 4.8,
    students: 7430,
    image: "/courses/typescript.jpg",
    prerequisites: ["JavaScript experience", "Object-oriented understanding"],
    learningOutcomes: [
      "Write type-safe JavaScript",
      "Use advanced TypeScript features",
      "Integrate TypeScript with React and Node",
      "Improve code maintainability"
    ],
    syllabus: [
      { module: 1, title: "TypeScript Basics", duration: "5 hours", topics: ["Types", "Interfaces", "Type Inference"] },
      { module: 2, title: "Functions & Types", duration: "4 hours", topics: ["Function Types", "Overloads", "Optional Params"] },
      { module: 3, title: "Advanced Types", duration: "6 hours", topics: ["Unions", "Generics", "Type Guards"] },
      { module: 4, title: "Classes & OOP", duration: "5 hours", topics: ["Access Modifiers", "Abstract Classes", "Interfaces"] },
      { module: 5, title: "TypeScript with React", duration: "6 hours", topics: ["Props Types", "Hooks Types", "Context"] },
      { module: 6, title: "TypeScript with Node", duration: "4 hours", topics: ["Express Types", "Decorators"] },
      { module: 7, title: "Final Project", duration: "5 hours", topics: ["Type-safe Application"] }
    ]
  },
  {
    id: 6,
    title: "Python Programming Fundamentals",
    description: "Learn Python from scratch - perfect for beginners in programming",
    category: "Programming",
    level: "Beginner",
    duration: "45 hours",
    modules: 9,
    instructor: "Dr. Maria Garcia",
    rating: 4.8,
    students: 21000,
    image: "/courses/python-basics.jpg",
    prerequisites: ["No prior programming experience needed"],
    learningOutcomes: [
      "Write Python programs confidently",
      "Understand core programming concepts",
      "Work with data structures",
      "Build small applications"
    ],
    syllabus: [
      { module: 1, title: "Python Basics", duration: "5 hours", topics: ["Variables", "Data Types", "Input/Output"] },
      { module: 2, title: "Control Flow", duration: "4 hours", topics: ["If Statements", "Loops", "Break/Continue"] },
      { module: 3, title: "Functions", duration: "5 hours", topics: ["Parameters", "Return Values", "Scope"] },
      { module: 4, title: "Data Structures", duration: "6 hours", topics: ["Lists", "Dictionaries", "Tuples", "Sets"] },
      { module: 5, title: "File Handling", duration: "3 hours", topics: ["Read/Write", "CSV", "JSON"] },
      { module: 6, title: "Error Handling", duration: "3 hours", topics: ["Exceptions", "Try/Except", "Finally"] },
      { module: 7, title: "Modules & Packages", duration: "4 hours", topics: ["Import", "Creating Modules", "pip"] },
      { module: 8, title: "OOP Basics", duration: "6 hours", topics: ["Classes", "Inheritance", "Magic Methods"] },
      { module: 9, title: "Final Project", duration: "9 hours", topics: ["Build a Game or Utility"] }
    ]
  }
];

// User progress tracking (simulated)
export const userProgress = {
  enrolledCourses: [1, 2, 3],
  completedCourses: [1],
  currentCourse: 2,
  progress: {
    1: 100,
    2: 75,
    3: 40,
    4: 0,
    5: 0,
    6: 0
  }
};

// Course categories
export const categories = [
  "Web Development",
  "Programming",
  "Frontend Framework",
  "Backend Development",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "Career Development"
];