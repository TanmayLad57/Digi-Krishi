import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Filter,
  Search,
  ArrowUpDown,
  PhoneCall,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { getStoredCases } from '../data/mockCases';

export default function OfficerCasesPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');
  const [sortOption, setSortOption] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCases(getStoredCases());
  }, []);

  // Filter & Sort Logic
  const filteredCases = cases
    .filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
      if (cropFilter !== 'All' && !c.crop.toLowerCase().includes(cropFilter.toLowerCase())) return false;
      if (
        searchQuery.trim() &&
        !c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.taluka.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'confidence') return a.aiConfidence - b.aiConfidence;
      if (sortOption === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-2">
            <ClipboardList className="w-4 h-4 text-[#d97706]" />
            <span>KVK Extension Cases Queue</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#111827]">
            Escalated Farmer Cases
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-body">
            Review AI diagnoses, approve dosage remedies, or schedule direct farmer calls.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332] bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Showing {filteredCases.length} of {cases.length} Total Cases</span>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farmer name, crop, question, or taluka..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-[#1b4332] focus:outline-none text-xs font-medium"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-[#1b4332] focus:outline-none text-xs font-bold bg-white"
            >
              <option value="recent">Most Recent First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence">Lowest AI Confidence</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-gray-50"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 shrink-0">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-gray-50"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 shrink-0">Crop:</span>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold bg-gray-50"
            >
              <option value="All">All Crops</option>
              <option value="Cotton">Cotton</option>
              <option value="Paddy">Paddy (Rice)</option>
              <option value="Banana">Banana</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Wheat">Wheat</option>
              <option value="Mustard">Mustard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-300 space-y-3">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-serif-display text-xl font-bold text-gray-800">No cases match selected filters</h3>
            <p className="text-xs text-gray-500">Try adjusting your status, priority, or search query above.</p>
            <button
              onClick={() => { setStatusFilter('All'); setPriorityFilter('All'); setCropFilter('All'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#1b4332] underline pt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCases.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/officer-dashboard/cases/${c.id}`)}
              className="bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-[#1b4332] shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Farmer & Crop Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-display text-lg font-bold text-gray-900 group-hover:text-[#1b4332] transition-colors">
                      {c.farmerName}
                    </h3>
                    <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#1b4332]" />
                      {c.village}, {c.taluka} ({c.district})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold">
                      Crop: {c.crop}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">Input: {c.queryType}</span>
                  </div>
                </div>

                {/* Priority & Status Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      c.priority === 'High'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : c.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {c.priority} Priority
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : c.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              {/* Question Summary */}
              <div className="p-3 rounded-2xl bg-[#faf8f5] border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Farmer Question:</span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
                  "{c.question}"
                </p>
              </div>

              {/* Bottom Metadata & Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="text-gray-500">AI Confidence:</span>
                    <span
                      className={
                        c.aiConfidence < 70
                          ? 'text-red-600 font-extrabold bg-red-50 px-2 py-0.5 rounded'
                          : c.aiConfidence < 85
                          ? 'text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded'
                          : 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded'
                      }
                    >
                      {c.aiConfidence}%
                    </span>
                  </div>

                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {c.submittedTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <a
                    href={`tel:${c.farmerPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1 border border-gray-300"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>Call Kisan ({c.farmerPhone})</span>
                  </a>

                  <button className="px-4 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold flex items-center gap-1 group-hover:bg-[#2d6a4f] shadow-sm">
                    <span>Open Case</span>
                    <ChevronRight className="w-4 h-4 text-[#e9c46a]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
