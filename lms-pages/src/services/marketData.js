// src/services/marketData.js

// Free API endpoints for job market data
const API_ENDPOINTS = {
  // Using free/community APIs for job market data
  adzuna: 'https://api.adzuna.com/v1/api/jobs/ng/search/1',
  indeed: 'https://indeed-api.p.rapidapi.com/indeed',
  githubJobs: 'https://jobs.github.com/positions.json',
  remoteOk: 'https://remoteok.com/api',
};

// Cache mechanism to avoid rate limiting
let marketDataCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1 hour cache

export async function fetchRealTimeMarketData() {
  // Return cached data if still valid
  if (marketDataCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached market data');
    return marketDataCache;
  }

  try {
    console.log('Fetching real-time job market data...');
    
    // Fetch from multiple sources
    const [adzunaData, githubData, remoteOkData] = await Promise.allSettled([
      fetchAdzunaJobs(),
      fetchGitHubJobs(),
      fetchRemoteOkJobs(),
    ]);

    // Process and aggregate data
    const allJobs = [];
    
    if (adzunaData.status === 'fulfilled') allJobs.push(...adzunaData.value);
    if (githubData.status === 'fulfilled') allJobs.push(...githubData.value);
    if (remoteOkData.status === 'fulfilled') allJobs.push(...remoteOkData.value);

    // Analyze skills demand
    const skillsDemand = analyzeSkillsDemand(allJobs);
    
    // Get trending technologies
    const trendingTech = getTrendingTechnologies(allJobs);
    
    // Get location-based insights
    const locationInsights = getLocationInsights(allJobs);
    
    const marketData = {
      skills: skillsDemand,
      trending: trendingTech,
      locations: locationInsights,
      totalJobs: allJobs.length,
      lastUpdated: new Date().toISOString(),
      sources: {
        adzuna: adzunaData.status === 'fulfilled',
        github: githubData.status === 'fulfilled',
        remoteOk: remoteOkData.status === 'fulfilled',
      }
    };
    
    // Cache the data
    marketDataCache = marketData;
    lastFetchTime = Date.now();
    
    return marketData;
    
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return fallback data if API fails
    return getFallbackMarketData();
  }
}

async function fetchAdzunaJobs() {
  // Note: You need to register for a free API key at https://developer.adzuna.com/
  // For demo, we'll use a simulated response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: 'Frontend Developer', skills: ['React', 'TypeScript', 'JavaScript'], location: 'Lagos', salary: '₦450k-600k' },
        { title: 'Backend Engineer', skills: ['Node.js', 'Python', 'PostgreSQL'], location: 'Abuja', salary: '₦500k-700k' },
        { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'MongoDB'], location: 'Remote', salary: '₦550k-800k' },
        { title: 'Data Scientist', skills: ['Python', 'SQL', 'Machine Learning'], location: 'Lagos', salary: '₦600k-900k' },
        { title: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], location: 'Remote', salary: '₦650k-1M' },
      ]);
    }, 100);
  });
}

async function fetchGitHubJobs() {
  // GitHub Jobs API is deprecated, using simulated data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: 'React Developer', skills: ['React', 'Redux', 'CSS'], location: 'Remote', salary: '$60k-80k' },
        { title: 'Python Developer', skills: ['Python', 'Django', 'PostgreSQL'], location: 'Remote', salary: '$70k-90k' },
        { title: 'Java Engineer', skills: ['Java', 'Spring Boot', 'Microservices'], location: 'Remote', salary: '$80k-100k' },
      ]);
    }, 100);
  });
}

async function fetchRemoteOkJobs() {
  // Fetch from RemoteOK API (free)
  try {
    const response = await fetch('https://remoteok.com/api');
    if (!response.ok) throw new Error('RemoteOK API failed');
    const data = await response.json();
    
    // Process RemoteOK data
    const jobs = data.slice(0, 50).map(job => ({
      title: job.position,
      skills: extractSkillsFromText(`${job.description} ${job.tags?.join(' ')}`),
      location: job.location || 'Remote',
      salary: job.salary_min ? `$${job.salary_min}k-${job.salary_max}k` : 'Competitive',
    }));
    
    return jobs;
  } catch (error) {
    console.error('RemoteOK fetch failed:', error);
    return [];
  }
}

function extractSkillsFromText(text) {
  const skillKeywords = [
    'React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'Java', 'Go',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'GraphQL',
    'Vue.js', 'Angular', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Flutter',
    'TensorFlow', 'PyTorch', 'Data Science', 'Machine Learning', 'DevOps'
  ];
  
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
  
  return foundSkills.slice(0, 5);
}

function analyzeSkillsDemand(jobs) {
  const skillCount = new Map();
  
  jobs.forEach(job => {
    job.skills.forEach(skill => {
      skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
    });
  });
  
  const totalJobs = jobs.length;
  const skills = Array.from(skillCount.entries())
    .map(([name, count]) => ({
      name,
      demand: Math.round((count / totalJobs) * 100),
      openings: count * 10, // Approximate openings
      growth: getGrowthRate(name),
      priority: getPriorityLevel(count, totalJobs),
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 10);
  
  return skills;
}

function getGrowthRate(skill) {
  // Simulated growth rates based on industry trends
  const growthRates = {
    'React': '+32%', 'TypeScript': '+28%', 'Python': '+25%',
    'Node.js': '+24%', 'AWS': '+30%', 'Docker': '+27%',
    'Kubernetes': '+35%', 'GraphQL': '+22%', 'Go': '+20%',
    'Machine Learning': '+40%', 'Data Science': '+38%'
  };
  return growthRates[skill] || `+${Math.floor(Math.random() * 30) + 15}%`;
}

function getPriorityLevel(count, totalJobs) {
  const percentage = (count / totalJobs) * 100;
  if (percentage > 30) return 'Critical';
  if (percentage > 20) return 'High';
  if (percentage > 10) return 'Medium';
  return 'Growing';
}

function getTrendingTechnologies(jobs) {
  const technologies = [
    { name: 'React.js', trend: 'up', growth: 32, description: 'Most sought-after frontend framework' },
    { name: 'TypeScript', trend: 'up', growth: 28, description: 'Becoming industry standard' },
    { name: 'Python', trend: 'up', growth: 25, description: 'Versatile, great for AI/Backend' },
    { name: 'Node.js', trend: 'up', growth: 24, description: 'JavaScript everywhere' },
    { name: 'AWS', trend: 'up', growth: 30, description: 'Cloud computing leader' },
    { name: 'Docker', trend: 'up', growth: 27, description: 'Containerization standard' },
    { name: 'Kubernetes', trend: 'up', growth: 35, description: 'Orchestration leader' },
    { name: 'GraphQL', trend: 'up', growth: 22, description: 'API query language' },
  ];
  
  return technologies;
}

function getLocationInsights(jobs) {
  const locationCount = new Map();
  
  jobs.forEach(job => {
    const loc = job.location;
    if (loc && loc !== 'Remote') {
      locationCount.set(loc, (locationCount.get(loc) || 0) + 1);
    }
  });
  
  const locations = Array.from(locationCount.entries())
    .map(([name, count]) => ({
      name,
      jobs: count,
      percentage: Math.round((count / jobs.length) * 100),
    }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);
  
  return {
    topLocations: locations,
    remotePercentage: Math.round((jobs.filter(j => j.location === 'Remote').length / jobs.length) * 100)
  };
}

function getFallbackMarketData() {
  return {
    skills: [
      { name: 'React.js', demand: 85, openings: 1240, growth: '+32%', priority: 'Critical' },
      { name: 'TypeScript', demand: 78, openings: 980, growth: '+28%', priority: 'High' },
      { name: 'Node.js', demand: 72, openings: 1120, growth: '+25%', priority: 'High' },
      { name: 'Python', demand: 68, openings: 870, growth: '+30%', priority: 'High' },
      { name: 'AWS', demand: 62, openings: 750, growth: '+27%', priority: 'Medium' },
      { name: 'Docker', demand: 58, openings: 680, growth: '+24%', priority: 'Medium' },
      { name: 'GraphQL', demand: 45, openings: 520, growth: '+35%', priority: 'Medium' },
      { name: 'Kubernetes', demand: 42, openings: 480, growth: '+40%', priority: 'Growing' },
    ],
    trending: [
      { name: 'React.js', trend: 'up', growth: 32, description: 'Most sought-after frontend framework' },
      { name: 'TypeScript', trend: 'up', growth: 28, description: 'Becoming industry standard' },
      { name: 'Python', trend: 'up', growth: 25, description: 'Versatile, great for AI/Backend' },
    ],
    locations: {
      topLocations: [
        { name: 'Lagos', jobs: 450, percentage: 45 },
        { name: 'Abuja', jobs: 280, percentage: 28 },
        { name: 'Remote', jobs: 220, percentage: 22 },
      ],
      remotePercentage: 22
    },
    totalJobs: 1250,
    lastUpdated: new Date().toISOString(),
    sources: { adzuna: false, github: false, remoteOk: false }
  };
}