// src/pages/Jobs.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  ExternalLink,
  Clock,
  Building,
  Filter,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
  Bookmark,
  Share2,
  RefreshCw,
  AlertCircle,
  Code
} from 'lucide-react';
import { fetchRealJobs } from '../services/jobService';

export default function Jobs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    skill: 'all',
    source: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Available filter options
  const locations = ['all', 'remote', 'Lagos', 'Abuja', 'Remote (Nigeria)'];
  const skills = ['all', 'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'Java', 'Flutter', 'AWS'];

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const jobData = await fetchRealJobs(filters);
    setJobs(jobData.jobs);
    setTotalJobs(jobData.totalJobs);
    setLastUpdated(jobData.lastUpdated);
    setLoading(false);
  };

  const handleFilterChange = async (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setLoading(true);
    const jobData = await fetchRealJobs(newFilters);
    setJobs(jobData.jobs);
    setTotalJobs(jobData.totalJobs);
    setLoading(false);
  };

  const refreshJobs = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const clearFilters = async () => {
    const emptyFilters = { search: '', location: 'all', skill: 'all', source: 'all' };
    setFilters(emptyFilters);
    setLoading(true);
    const jobData = await fetchRealJobs(emptyFilters);
    setJobs(jobData.jobs);
    setTotalJobs(jobData.totalJobs);
    setLoading(false);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="mb-2 text-blue-100 hover:text-white transition text-sm flex items-center gap-1"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <Briefcase className="h-7 w-7" />
                  Job Opportunities
                </h1>
                {/* Tech Job Badge - Added */}
                <span className="text-xs bg-green-500/20 text-green-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  💻 Strictly Computing & Programming Jobs
                </span>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {totalJobs} tech jobs found • Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'just now'}
              </p>
            </div>
            <button
              onClick={refreshJobs}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tech jobs by title, company, or skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Filters - Desktop always visible, Mobile toggle */}
            <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-3`}>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc.charAt(0).toUpperCase() + loc.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {skills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill === 'all' ? 'All Skills' : skill}
                  </option>
                ))}
              </select>

              {(filters.search || filters.location !== 'all' || filters.skill !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{jobs.length}</span> of <span className="font-semibold">{totalJobs}</span> tech jobs
          </p>
          <p className="text-xs text-gray-400">Data from RemoteOK, Stack Overflow, GitHub Jobs & more</p>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding the best tech jobs for you...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tech jobs found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search filters or check back later for new opportunities
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job List */}
            <div className="lg:col-span-2 space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer ${
                    selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getMatchScoreColor(job.matchScore)}`}>
                          {job.matchScore}% Match
                        </span>
                        {/* Tech Job Badge - Added to job card */}
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          Tech Job
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        {job.salary && job.salary !== 'Competitive salary' && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(job.postedDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{job.source}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(job.url, '_blank');
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        Apply Now <ExternalLink className="h-3 w-3" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Job Details Panel */}
            <div className="lg:col-span-1">
              {selectedJob ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedJob.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{selectedJob.company}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        Tech Role
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedJob.location}
                        </span>
                      </div>
                      {selectedJob.salary && selectedJob.salary !== 'Competitive salary' && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Salary</span>
                          <span className="text-gray-900 flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {selectedJob.salary}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Posted</span>
                        <span className="text-gray-900">{formatDate(selectedJob.postedDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Source</span>
                        <span className="text-gray-900">{selectedJob.source}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Match Score</span>
                        <span className={`font-semibold ${getMatchScoreColor(selectedJob.matchScore)} px-2 py-1 rounded-full text-xs`}>
                          {selectedJob.matchScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedJob.description}</p>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <a
                        href={selectedJob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        Apply Now <ExternalLink className="h-4 w-4" />
                      </a>
                      <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Job
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a tech job to view details</p>
                  <p className="text-xs text-gray-400 mt-2">Click on any job listing to see more information</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Tech job data aggregated from RemoteOK, Stack Overflow Jobs, GitHub Jobs, and more</p>
          <p className="mt-1">All jobs shown are strictly computing/programming roles</p>
          <p className="mt-1">Click "Apply Now" to be redirected to the original job posting</p>
        </div>
      </div>
    </div>
  );
}