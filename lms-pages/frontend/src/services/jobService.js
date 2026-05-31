// src/services/jobService.js
// This is a simplified version that will work immediately

// Cache mechanism
let jobsCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 1800000; // 30 minutes cache

export async function fetchRealJobs(filters = {}) {
  // Return cached data if still valid
  if (jobsCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached job data');
    return jobsCache;
  }

  try {
    console.log('Fetching job data...');
    
    // Try to fetch from RemoteOK API (works without API key)
    let remoteJobs = [];
    try {
      const response = await fetch('https://remoteok.com/api');
      if (response.ok) {
        const data = await response.json();
        remoteJobs = parseRemoteOKJobs(data);
      }
    } catch (e) {
      console.log('RemoteOK fetch failed, using fallback data');
    }
    
    // Combine with fallback data if needed
    let allJobs = remoteJobs.length > 0 ? remoteJobs : getFallbackJobs();
    
    // Apply filters
    let filteredJobs = applyFilters(allJobs, filters);
    
    const jobData = {
      jobs: filteredJobs,
      totalJobs: filteredJobs.length,
      lastUpdated: new Date().toISOString(),
      filters: filters
    };
    
    // Cache the data
    jobsCache = jobData;
    lastFetchTime = Date.now();
    
    return jobData;
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return getFallbackJobData();
  }
}

function parseRemoteOKJobs(data) {
  if (!Array.isArray(data)) return [];
  
  // RemoteOK returns first item as metadata, rest are jobs
  const jobs = data.slice(1);
  
  return jobs.slice(0, 30).map(job => ({
    id: `remoteok_${job.id}`,
    title: job.position || job.title || 'Software Developer',
    company: job.company || 'Tech Company',
    location: job.location || 'Remote',
    salary: extractSalary(job.salary || job.description || ''),
    description: job.description ? stripHtml(job.description).substring(0, 300) : 'Exciting opportunity in tech',
    skills: extractSkills(job.description || job.tags?.join(' ') || ''),
    url: job.url || '#',
    postedDate: job.date || new Date().toISOString(),
    source: 'RemoteOK',
    matchScore: Math.floor(Math.random() * 30) + 65,
    employmentType: 'Full-time'
  }));
}

function extractSalary(text) {
  const patterns = [
    /₦[\d,]+(?:-₦[\d,]+)?/i,
    /\$[\d,]+(?:-\$[\d,]+)?/i,
    /[\d,]+(?:-[\d,]+)?\s*(?:₦|\$|USD)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return 'Competitive salary';
}

function extractSkills(text) {
  const techSkills = [
    'React', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'PostgreSQL'
  ];
  
  return techSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 4);
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function applyFilters(jobs, filters) {
  let filtered = [...jobs];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.location && filters.location !== 'all') {
    if (filters.location === 'remote') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    } else {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
  }
  
  if (filters.skill && filters.skill !== 'all') {
    filtered = filtered.filter(job =>
      job.skills.some(skill => 
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      )
    );
  }
  
  return filtered;
}

function getFallbackJobs() {
  return [
    {
      id: 1,
      title: 'Frontend Developer (React)',
      company: 'Flutterwave',
      location: 'Lagos, Nigeria',
      salary: '₦450k-600k',
      description: 'Looking for a skilled Frontend Developer with React and TypeScript experience to join our payment solutions team.',
      skills: ['React', 'TypeScript', 'Tailwind', 'JavaScript'],
      url: 'https://flutterwave.com/careers',
      postedDate: new Date().toISOString(),
      source: 'Sample',
      matchScore: 92,
      employmentType: 'Full-time'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Paystack',
      location: 'Remote (Nigeria)',
      salary: '₦550k-750k',
      description: 'Join our engineering team to build scalable payment solutions. Must have experience with React, Node.js, and PostgreSQL.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'JavaScript'],
      url: 'https://paystack.com/careers',
      postedDate: new Date().toISOString(),
      source: 'Sample',
      matchScore: 88,
      employmentType: 'Full-time'
    },
    {
      id: 3,
      title: 'Backend Engineer (Python)',
      company: 'Andela',
      location: 'Lagos, Nigeria',
      salary: '₦500k-700k',
      description: 'Seeking Backend Engineer with Python and Django experience to build robust APIs.',
      skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
      url: 'https://andela.com/careers',
      postedDate: new Date().toISOString(),
      source: 'Sample',
      matchScore: 85,
      employmentType: 'Full-time'
    },
    {
      id: 4,
      title: 'Mobile Developer (Flutter)',
      company: 'Kuda Bank',
      location: 'Lagos, Nigeria',
      salary: '₦500k-650k',
      description: 'Looking for Flutter developer to build cross-platform mobile applications for digital banking.',
      skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs'],
      url: 'https://kuda.com/careers',
      postedDate: new Date().toISOString(),
      source: 'Sample',
      matchScore: 82,
      employmentType: 'Full-time'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'MainOne',
      location: 'Lagos, Nigeria',
      salary: '₦600k-850k',
      description: 'Seeking DevOps engineer with AWS, Docker, and Kubernetes experience.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
      url: 'https://mainone.net/careers',
      postedDate: new Date().toISOString(),
      source: 'Sample',
      matchScore: 87,
      employmentType: 'Full-time'
    }
  ];
}

function getFallbackJobData() {
  return {
    jobs: getFallbackJobs(),
    totalJobs: 5,
    lastUpdated: new Date().toISOString(),
    filters: {}
  };
}