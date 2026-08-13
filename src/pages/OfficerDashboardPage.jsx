import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCheck,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStoredCases } from '../data/mockCases';

export default function OfficerDashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);

  useEffect(() => {
    setCases(getStoredCases());
  }, []);

  const pendingCount = cases.filter((c) => c.status === 'Pending').length;
  const highPriorityCount = cases.filter((c) => c.priority === 'High' && c.status !== 'Resolved').length;
  const resolvedCount = cases.filter((c) => c.status === 'Resolved').length + 25; // mock total

  const recentCases = cases.slice(0, 5);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-[#d97706]" />
            <span>Krishi Vigyan Kendra Extension Portal</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#111827]">
            Welcome back, {currentUser?.name || 'Dr. Sunita Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-body flex flex-wrap items-center gap-2 font-semibold">
            <span>{currentUser?.designation || 'KVK Agronomy Scientist'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#1b4332]">
              <MapPin className="w-3.5 h-3.5 text-[#d97706]" />
              Assigned District: {currentUser?.district || 'Nagpur'} ({currentUser?.talukasCovered?.join(', ') || 'Katol, Kalmeshwar'})
            </span>
          </p>
        </div>

        <Link
          to="/officer-dashboard/cases"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#e9c46a] font-bold text-xs shadow-md shrink-0 transition-all"
        >
          <span>Open Escalation Queue ({pendingCount})</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </motion.div>

      {/* Clean Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 uppercase">
            <span>Pending Cases</span>
            <Clock className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="font-serif-display text-4xl font-bold text-[#111827]">{pendingCount}</div>
          <p className="text-xs text-amber-800 font-semibold">Requires officer review</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-red-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-red-900 uppercase">
            <span>High Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="font-serif-display text-4xl font-bold text-red-600">{highPriorityCount}</div>
          <p className="text-xs text-red-700 font-semibold">Outbreak & low AI confidence</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase">
            <span>Resolved This Month</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-serif-display text-4xl font-bold text-[#1b4332]">{resolvedCount}</div>
          <p className="text-xs text-emerald-800 font-semibold">98.2% farmer rating</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Avg Response Time</span>
            <TrendingUp className="w-4 h-4 text-[#1b4332]" />
          </div>
          <div className="font-serif-display text-4xl font-bold text-gray-900">4.2 hrs</div>
          <p className="text-xs text-gray-600 font-semibold">Target &lt; 6 hrs achieved</p>
        </div>
      </div>

      {/* Main Grid: Recent Escalations Preview + Simple Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Recent Escalations Table */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-[#111827]">
                Recent Escalated Cases
              </h2>
              <p className="text-xs text-gray-600 font-body">Latest farmer questions requiring extension verification.</p>
            </div>
            <Link
              to="/officer-dashboard/cases"
              className="text-xs font-bold text-[#1b4332] hover:text-[#d97706] flex items-center gap-1"
            >
              <span>View All Cases ({cases.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/officer-dashboard/cases/${c.id}`)}
                className="p-4 rounded-2xl bg-[#faf8f5] hover:bg-[#1b4332]/5 border border-gray-200 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900 group-hover:text-[#1b4332] transition-colors">
                      {c.farmerName}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">({c.taluka}, {c.district})</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {c.crop}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.priority === 'High'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                  "{c.question}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <span>AI Confidence:</span>
                    <span className={c.aiConfidence < 70 ? 'text-red-600 font-bold' : 'text-amber-700 font-bold'}>
                      {c.aiConfidence}%
                    </span>
                  </span>
                  <span className="text-gray-400 font-medium">{c.submittedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Simple Analytics Visual & Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly Resolution Trend Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-900 uppercase flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#1b4332]" />
                Weekly Cases Resolved
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">Last 7 Days</span>
            </div>

            {/* Custom SVG/CSS Bar Chart */}
            <div className="h-36 flex items-end justify-between gap-2 pt-4 border-b border-gray-100 pb-2">
              {[
                { day: 'Mon', count: 4, height: '40%' },
                { day: 'Tue', count: 6, height: '60%' },
                { day: 'Wed', count: 8, height: '80%' },
                { day: 'Thu', count: 5, height: '50%' },
                { day: 'Fri', count: 9, height: '90%' },
                { day: 'Sat', count: 7, height: '70%' },
                { day: 'Sun', count: 3, height: '30%' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-600">{bar.count}</span>
                  <div
                    style={{ height: bar.height }}
                    className="w-full rounded-t-lg bg-[#1b4332] hover:bg-[#d97706] transition-colors"
                  />
                  <span className="text-[10px] text-gray-500 font-semibold">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-900 uppercase flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#d97706]" />
                Case Category Breakdown
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className="space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>Pest & Fungal Diseases</span>
                  <span className="font-bold text-gray-900">45%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#1b4332] w-[45%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>Weather & Spray Warnings</span>
                  <span className="font-bold text-gray-900">30%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#d97706] w-[30%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-gray-700">
                  <span>PM-KISAN & Subsidies</span>
                  <span className="font-bold text-gray-900">25%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#c8553d] w-[25%]" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
