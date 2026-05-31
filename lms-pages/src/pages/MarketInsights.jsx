// src/pages/MarketInsights.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MapPin, 
  Briefcase,
  ArrowLeft,
  DollarSign,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Award,
  Clock,
  Globe,
  Building,
  Zap
} from 'lucide-react';
import { fetchRealTimeMarketData } from '../services/marketData';

export default function MarketInsights() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    const data = await fetchRealTimeMarketData();
    setMarketData(data);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadMarketData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching real-time market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-2 text-blue-100 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                Market Insights
              </h1>
              <p className="text-blue-100">
                Real-time job market trends and in-demand skills from LinkedIn, Indeed, and Jobberman
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{marketData.skills.length}</p>
            <p className="text-sm text-gray-500">In-Demand Skills Tracked</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">Updated</p>
            <p className="text-xs text-gray-500">{new Date(marketData.lastUpdated).toLocaleString()}</p>
          </div>
        </div>

        {/* Skills in Demand Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Most In-Demand Programming Skills
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Based on live job postings from LinkedIn, Indeed, and Jobberman
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {marketData.skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="p-5 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{skill.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          skill.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          skill.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          skill.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {skill.priority} Demand
                        </span>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {skill.growth} growth
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{skill.demand}%</p>
                    <p className="text-xs text-gray-500">of job postings</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`rounded-full h-3 transition-all duration-500 ${
                      skill.priority === 'Critical' ? 'bg-red-500' :
                      skill.priority === 'High' ? 'bg-orange-500' :
                      skill.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{skill.openings.toLocaleString()} current openings</span>
                </div>

                {/* Expanded details */}
                {selectedSkill === skill.name && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Why learn {skill.name}?</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      {getSkillDescription(skill.name)} Companies are actively hiring for this skill with 
                      {skill.openings}+ openings currently available.
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Find Courses
                      </button>
                      <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50">
                        View Jobs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trending Technologies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Fastest Growing Technologies
            </h3>
            <div className="space-y-4">
              {marketData.trending.map(tech => (
                <div key={tech.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +{tech.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Top Hiring Locations
            </h3>
            <div className="space-y-4">
              {marketData.locations?.topLocations.map(loc => (
                <div key={loc.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{loc.name}</span>
                    <span className="text-sm text-gray-600">{loc.jobs} jobs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${loc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Remote Work</span>
                  <span className="text-sm font-bold text-green-600">{marketData.locations?.remotePercentage}% of jobs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 rounded-full h-2"
                    style={{ width: `${marketData.locations?.remotePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Insights */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Salary Insights</h3>
                <p className="text-blue-100">Average salaries for top skills in Nigeria</p>
              </div>
            </div>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Entry Level (0-2 years)</p>
              <p className="text-2xl font-bold">₦300k-450k</p>
              <p className="text-xs text-blue-100 mt-1">per month</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Mid Level (2-5 years)</p>
              <p className="text-2xl font-bold">₦500k-750k</p>
              <p className="text-xs text-blue-100 mt-1">per month</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-1">Senior Level (5+ years)</p>
              <p className="text-2xl font-bold">₦800k-1.2M</p>
              <p className="text-xs text-blue-100 mt-1">per month</p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data aggregated from LinkedIn, Indeed, Jobberman, and other job platforms</p>
          <p className="text-xs mt-1">Last updated: {new Date(marketData.lastUpdated).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function getSkillDescription(skill) {
  const descriptions = {
    'React.js': 'The most popular frontend framework for building modern web applications',
    'TypeScript': 'JavaScript with types - becoming the industry standard for large applications',
    'Node.js': 'JavaScript runtime for building fast, scalable backend applications',
    'Python': 'Versatile language used in web development, data science, and AI',
    'AWS': 'Leading cloud platform with comprehensive services and global infrastructure',
    'Docker': 'Container platform for developing, shipping, and running applications',
    'GraphQL': 'Query language for APIs that provides efficient data fetching',
    'Kubernetes': 'Container orchestration platform for managing microservices'
  };
  return descriptions[skill] || `High-demand skill with excellent career opportunities`;
}