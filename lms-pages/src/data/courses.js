// src/data/courses.js

export const categories = [
  'Web Development', 
  'Data Science', 
  'Mobile Development', 
  'Cloud Computing',
  'Artificial Intelligence',
  'Cybersecurity',
  'DevOps',
  'Game Development'
];

export const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp 2026",
    description: "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.",
    category: "Web Development",
    level: "Beginner",
    duration: "48 hours",
    modules: 12,
    rating: 4.8,
    students: 15420,
    instructor: "Dr. Sarah Johnson",
    learningOutcomes: [
      "Build responsive websites with modern HTML5 & CSS3",
      "Master JavaScript ES6+ and React framework",
      "Create RESTful APIs with Node.js and Express",
      "Work with MongoDB databases",
      "Deploy full-stack applications to production"
    ],
    syllabus: [
      { module: 1, title: "HTML5 & CSS3 Fundamentals", duration: "4 hours", topics: ["Semantic HTML", "CSS Grid", "Flexbox", "Responsive Design"] },
      { module: 2, title: "JavaScript Essentials", duration: "6 hours", topics: ["Variables & Functions", "DOM Manipulation", "Async/Await", "ES6 Features"] },
      { module: 3, title: "React.js Mastery", duration: "10 hours", topics: ["Components & Props", "Hooks", "State Management", "React Router"] },
      { module: 4, title: "Backend Development with Node.js", duration: "8 hours", topics: ["Express.js", "REST APIs", "Authentication", "Middleware"] },
      { module: 5, title: "Database Integration", duration: "6 hours", topics: ["MongoDB", "Mongoose", "SQL Basics", "Data Modeling"] },
      { module: 6, title: "Full-Stack Projects", duration: "14 hours", topics: ["E-commerce Site", "Social Media App", "Portfolio", "Deployment"] }
    ]
  },
  {
    id: 2,
    title: "Python for Data Science & Machine Learning",
    description: "Learn Python programming, data analysis, visualization, and machine learning algorithms using real datasets.",
    category: "Data Science",
    level: "Intermediate",
    duration: "52 hours",
    modules: 14,
    rating: 4.9,
    students: 18750,
    instructor: "Prof. Michael Chen",
    learningOutcomes: [
      "Master Python programming for data analysis",
      "Use NumPy, Pandas, and Matplotlib effectively",
      "Build machine learning models with Scikit-learn",
      "Perform data cleaning and feature engineering",
      "Create data visualizations and dashboards"
    ],
    syllabus: [
      { module: 1, title: "Python Basics", duration: "6 hours", topics: ["Data Types", "Loops", "Functions", "File I/O"] },
      { module: 2, title: "NumPy for Numerical Computing", duration: "4 hours", topics: ["Arrays", "Broadcasting", "Linear Algebra"] },
      { module: 3, title: "Pandas for Data Manipulation", duration: "8 hours", topics: ["DataFrames", "Grouping", "Merging", "Time Series"] },
      { module: 4, title: "Data Visualization", duration: "5 hours", topics: ["Matplotlib", "Seaborn", "Plotly", "Dashboards"] },
      { module: 5, title: "Machine Learning Fundamentals", duration: "10 hours", topics: ["Regression", "Classification", "Clustering", "Evaluation"] },
      { module: 6, title: "Advanced ML Algorithms", duration: "10 hours", topics: ["Random Forest", "XGBoost", "SVM", "Neural Networks"] },
      { module: 7, title: "Capstone Project", duration: "9 hours", topics: ["Real Dataset Analysis", "Model Deployment", "Reporting"] }
    ]
  },
  {
    id: 3,
    title: "Android App Development with Kotlin",
    description: "Build professional Android apps using Kotlin, Jetpack Compose, and modern Android development practices.",
    category: "Mobile Development",
    level: "Intermediate",
    duration: "45 hours",
    modules: 11,
    rating: 4.7,
    students: 9830,
    instructor: "Emma Rodriguez",
    learningOutcomes: [
      "Develop Android apps using Kotlin",
      "Build UI with Jetpack Compose",
      "Implement navigation and architecture patterns",
      "Work with Room database and APIs",
      "Publish apps to Google Play Store"
    ],
    syllabus: [
      { module: 1, title: "Kotlin Fundamentals", duration: "6 hours", topics: ["Syntax", "OOP", "Coroutines", "Functional Programming"] },
      { module: 2, title: "Android Basics", duration: "5 hours", topics: ["Activities", "Intents", "Lifecycle", "Permissions"] },
      { module: 3, title: "Jetpack Compose UI", duration: "8 hours", topics: ["Composables", "State", "Theming", "Animations"] },
      { module: 4, title: "Architecture Components", duration: "6 hours", topics: ["ViewModel", "LiveData", "Room", "DataStore"] },
      { module: 5, title: "Networking & APIs", duration: "5 hours", topics: ["Retrofit", "OkHttp", "JSON Parsing", "Error Handling"] },
      { module: 6, title: "Publishing & Deployment", duration: "15 hours", topics: ["Testing", "Play Console", "App Signing", "Monetization"] }
    ]
  },
  {
    id: 4,
    title: "AWS Cloud Practitioner Certification",
    description: "Prepare for AWS Cloud Practitioner certification. Learn cloud concepts, AWS services, security, pricing, and best practices.",
    category: "Cloud Computing",
    level: "Beginner",
    duration: "25 hours",
    modules: 8,
    rating: 4.8,
    students: 12560,
    instructor: "David Okonkwo",
    learningOutcomes: [
      "Understand cloud computing concepts",
      "Navigate AWS Management Console",
      "Identify core AWS services (EC2, S3, RDS, Lambda)",
      "Understand security and compliance",
      "Prepare for certification exam"
    ],
    syllabus: [
      { module: 1, title: "Cloud Concepts", duration: "3 hours", topics: ["Cloud Models", "Benefits", "Economics", "Shared Responsibility"] },
      { module: 2, title: "AWS Core Services", duration: "6 hours", topics: ["EC2", "S3", "VPC", "RDS", "Lambda"] },
      { module: 3, title: "Security & Compliance", duration: "4 hours", topics: ["IAM", "Shared Responsibility", "Compliance", "Encryption"] },
      { module: 4, title: "Billing & Pricing", duration: "3 hours", topics: ["Pricing Models", "Cost Explorer", "Budgets", "Support Plans"] },
      { module: 5, title: "Architecture & Design", duration: "4 hours", topics: ["Well-Architected", "High Availability", "Scalability"] },
      { module: 6, title: "Exam Preparation", duration: "5 hours", topics: ["Practice Exams", "Study Guide", "Test Strategies"] }
    ]
  },
  {
    id: 5,
    title: "Artificial Intelligence & Deep Learning",
    description: "Master AI concepts including neural networks, deep learning, computer vision, and NLP using TensorFlow and PyTorch.",
    category: "Artificial Intelligence",
    level: "Advanced",
    duration: "60 hours",
    modules: 15,
    rating: 4.9,
    students: 7230,
    instructor: "Dr. Aisha Mohammed",
    learningOutcomes: [
      "Build neural networks from scratch",
      "Implement deep learning models with TensorFlow",
      "Apply computer vision techniques",
      "Develop NLP applications",
      "Deploy AI models to production"
    ],
    syllabus: [
      { module: 1, title: "Neural Network Fundamentals", duration: "6 hours", topics: ["Perceptrons", "Activation", "Backpropagation", "Optimization"] },
      { module: 2, title: "TensorFlow & PyTorch", duration: "8 hours", topics: ["Tensors", "Models", "Training Loops", "Callbacks"] },
      { module: 3, title: "Computer Vision", duration: "10 hours", topics: ["CNNs", "Transfer Learning", "Object Detection", "Image Segmentation"] },
      { module: 4, title: "Natural Language Processing", duration: "8 hours", topics: ["Tokenization", "Word Embeddings", "RNNs", "Transformers"] },
      { module: 5, title: "Generative AI", duration: "8 hours", topics: ["GANs", "VAEs", "Diffusion Models", "LLMs"] },
      { module: 6, title: "MLOps & Deployment", duration: "20 hours", topics: ["Model Serving", "Monitoring", "CI/CD", "Capstone Project"] }
    ]
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    description: "Learn security principles, threat analysis, network security, cryptography, and ethical hacking techniques.",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "35 hours",
    modules: 9,
    rating: 4.7,
    students: 10540,
    instructor: "James Wilson",
    learningOutcomes: [
      "Understand cybersecurity principles",
      "Identify common threats and vulnerabilities",
      "Implement network security measures",
      "Apply cryptography concepts",
      "Perform basic penetration testing"
    ],
    syllabus: [
      { module: 1, title: "Security Fundamentals", duration: "4 hours", topics: ["CIA Triad", "Threats", "Risk Management", "Compliance"] },
      { module: 2, title: "Network Security", duration: "5 hours", topics: ["Firewalls", "IDS/IPS", "VPNs", "Secure Protocols"] },
      { module: 3, title: "Cryptography", duration: "4 hours", topics: ["Encryption", "Hashing", "PKI", "Digital Signatures"] },
      { module: 4, title: "Web Security", duration: "4 hours", topics: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF"] },
      { module: 5, title: "Ethical Hacking", duration: "8 hours", topics: ["Reconnaissance", "Scanning", "Exploitation", "Reporting"] },
      { module: 6, title: "Incident Response", duration: "10 hours", topics: ["Detection", "Response Plan", "Forensics", "Recovery"] }
    ]
  },
  {
    id: 7,
    title: "DevOps Engineering with Docker & Kubernetes",
    description: "Master DevOps practices including CI/CD, containerization, orchestration, and infrastructure as code.",
    category: "DevOps",
    level: "Intermediate",
    duration: "42 hours",
    modules: 10,
    rating: 4.8,
    students: 8640,
    instructor: "Alex Thompson",
    learningOutcomes: [
      "Implement CI/CD pipelines",
      "Containerize applications with Docker",
      "Orchestrate containers with Kubernetes",
      "Use infrastructure as code tools",
      "Monitor and log applications"
    ],
    syllabus: [
      { module: 1, title: "DevOps Fundamentals", duration: "3 hours", topics: ["DevOps Culture", "CI/CD Concepts", "Version Control"] },
      { module: 2, title: "Docker Deep Dive", duration: "6 hours", topics: ["Images", "Containers", "Docker Compose", "Registry"] },
      { module: 3, title: "Kubernetes Essentials", duration: "8 hours", topics: ["Pods", "Services", "Deployments", "Ingress"] },
      { module: 4, title: "CI/CD Pipelines", duration: "5 hours", topics: ["Jenkins", "GitHub Actions", "GitLab CI", "ArgoCD"] },
      { module: 5, title: "Infrastructure as Code", duration: "5 hours", topics: ["Terraform", "Ansible", "CloudFormation"] },
      { module: 6, title: "Monitoring & Logging", duration: "15 hours", topics: ["Prometheus", "Grafana", "ELK Stack", "Project"] }
    ]
  },
  {
    id: 8,
    title: "iOS App Development with SwiftUI",
    description: "Build beautiful iOS apps using Swift and SwiftUI. Master Apple's ecosystem and publish to App Store.",
    category: "Mobile Development",
    level: "Intermediate",
    duration: "48 hours",
    modules: 12,
    rating: 4.8,
    students: 7520,
    instructor: "Sophia Lee",
    learningOutcomes: [
      "Develop iOS apps with Swift",
      "Build UIs with SwiftUI",
      "Implement data persistence",
      "Integrate with APIs",
      "Publish to App Store"
    ],
    syllabus: [
      { module: 1, title: "Swift Fundamentals", duration: "8 hours", topics: ["Syntax", "Optionals", "Protocols", "Closures"] },
      { module: 2, title: "SwiftUI Basics", duration: "6 hours", topics: ["Views", "Modifiers", "State", "Navigation"] },
      { module: 3, title: "Data Management", duration: "5 hours", topics: ["Core Data", "UserDefaults", "File Manager"] },
      { module: 4, title: "Networking", duration: "4 hours", topics: ["URLSession", "JSON", "Async/Await", "REST APIs"] },
      { module: 5, title: "Advanced SwiftUI", duration: "5 hours", topics: ["Animations", "Custom Views", "Gestures", "Combine"] },
      { module: 6, title: "App Store Deployment", duration: "20 hours", topics: ["Testing", "App Store Connect", "Submission", "Capstone"] }
    ]
  },
  {
    id: 9,
    title: "Database Design & SQL Mastery",
    description: "Master database design principles, advanced SQL queries, optimization, and database administration.",
    category: "Data Science",
    level: "Beginner",
    duration: "30 hours",
    modules: 8,
    rating: 4.7,
    students: 11980,
    instructor: "Dr. Patricia Okafor",
    learningOutcomes: [
      "Design normalized database schemas",
      "Write complex SQL queries",
      "Optimize query performance",
      "Manage database transactions",
      "Implement database security"
    ],
    syllabus: [
      { module: 1, title: "Database Design", duration: "5 hours", topics: ["ERD", "Normalization", "Constraints", "Indexes"] },
      { module: 2, title: "SQL Fundamentals", duration: "6 hours", topics: ["SELECT", "JOINs", "Subqueries", "Aggregations"] },
      { module: 3, title: "Advanced SQL", duration: "5 hours", topics: ["Window Functions", "CTEs", "Stored Procedures", "Triggers"] },
      { module: 4, title: "Performance Optimization", duration: "4 hours", topics: ["Query Plans", "Index Strategy", "Partitioning"] },
      { module: 5, title: "Database Security", duration: "3 hours", topics: ["Authentication", "Authorization", "Encryption", "Auditing"] },
      { module: 6, title: "NoSQL Databases", duration: "7 hours", topics: ["MongoDB", "Cassandra", "Redis", "Use Cases"] }
    ]
  },
  {
    id: 10,
    title: "Game Development with Unity & C#",
    description: "Create 2D and 3D games using Unity engine and C# programming. Learn game design, physics, and optimization.",
    category: "Game Development",
    level: "Intermediate",
    duration: "55 hours",
    modules: 14,
    rating: 4.8,
    students: 6850,
    instructor: "Carlos Mendez",
    learningOutcomes: [
      "Build games with Unity engine",
      "Program game mechanics in C#",
      "Implement physics and animations",
      "Optimize game performance",
      "Publish to multiple platforms"
    ],
    syllabus: [
      { module: 1, title: "Unity Fundamentals", duration: "6 hours", topics: ["Scene Setup", "GameObjects", "Components", "Prefabs"] },
      { module: 2, title: "C# for Game Development", duration: "8 hours", topics: ["Scripting", "MonoBehaviour", "Coroutines", "Events"] },
      { module: 3, title: "Game Physics", duration: "5 hours", topics: ["Rigidbody", "Colliders", "Raycasting", "Character Controllers"] },
      { module: 4, title: "Animation & VFX", duration: "5 hours", topics: ["Animator", "Sprites", "Particle Systems", "Shader Graph"] },
      { module: 5, title: "User Interface", duration: "4 hours", topics: ["UI Toolkit", "Menus", "HUD", "Event System"] },
      { module: 6, title: "Game Design & Publishing", duration: "27 hours", topics: ["Level Design", "Audio", "Optimization", "Build & Release"] }
    ]
  }
];

// User progress tracking structure
export const userProgress = {
  enrolledCourses: [], // Array of course IDs the user has enrolled in
  progress: {}, // Object mapping course ID to progress percentage
  completions: {}, // Object mapping course ID to completion date
  lastAccessed: {} // Object mapping course ID to last access timestamp
};

// Function to get recommended courses based on user's interests and completed courses
export const getRecommendedCourses = (userProfile, enrolledIds = []) => {
  if (!userProfile) return courses.filter(c => !enrolledIds.includes(c.id)).slice(0, 4);
  
  // Simple recommendation logic based on career goal
  const careerGoal = userProfile.careerGoal?.toLowerCase() || '';
  let recommended = [];
  
  if (careerGoal.includes('web') || careerGoal.includes('frontend') || careerGoal.includes('full stack')) {
    recommended = courses.filter(c => c.category === 'Web Development');
  } else if (careerGoal.includes('data') || careerGoal.includes('scientist') || careerGoal.includes('analyst')) {
    recommended = courses.filter(c => c.category === 'Data Science');
  } else if (careerGoal.includes('mobile') || careerGoal.includes('android') || careerGoal.includes('ios')) {
    recommended = courses.filter(c => c.category === 'Mobile Development');
  } else if (careerGoal.includes('cloud') || careerGoal.includes('aws') || careerGoal.includes('devops')) {
    recommended = courses.filter(c => c.category === 'Cloud Computing' || c.category === 'DevOps');
  } else if (careerGoal.includes('ai') || careerGoal.includes('machine learning')) {
    recommended = courses.filter(c => c.category === 'Artificial Intelligence');
  } else if (careerGoal.includes('security') || careerGoal.includes('cyber')) {
    recommended = courses.filter(c => c.category === 'Cybersecurity');
  } else {
    recommended = courses;
  }
  
  return recommended.filter(c => !enrolledIds.includes(c.id)).slice(0, 4);
};

// Function to get trending courses (highest enrolled)
export const getTrendingCourses = () => {
  return [...courses].sort((a, b) => b.students - a.students).slice(0, 6);
};

// Function to get courses by category
export const getCoursesByCategory = (category) => {
  if (category === 'All') return courses;
  return courses.filter(course => course.category === category);
};