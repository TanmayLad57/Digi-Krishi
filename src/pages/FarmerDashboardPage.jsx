import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Camera,
  Mic,
  MessageSquareText,
  Volume2,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFarmerHistory } from '../data/mockCases';

export default function FarmerDashboardPage() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setHistory(getFarmerHistory());
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-[#d97706]" />
              <span>Kisan Portal • Farmer Dashboard</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#111827]">
              Namaste, {currentUser?.name || 'Rajesh Patil'}!
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#1b4332]" />
                {currentUser?.district || 'Nagpur'}, {currentUser?.state || 'Maharashtra'}
              </span>
              <span>•</span>
              <span>Crops: {currentUser?.crops?.join(', ') || 'Banana, Cotton, Paddy'}</span>
              <span>•</span>
              <span>Land: {currentUser?.landArea || '5'} Acres</span>
            </div>
          </div>

          <Link
            to="/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#e9c46a] font-bold text-sm shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Launch AI Kisan Advisory</span>
          </Link>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase">My Total Query History</div>
            <div className="font-serif-display text-3xl font-bold text-[#1b4332]">
              {history.length} Saved Records
            </div>
            <p className="text-xs text-gray-600">Click any record below to view full response</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase">Local District Forecast</div>
            <div className="font-serif-display text-3xl font-bold text-[#d97706]">28°C • Rain Expected</div>
            <p className="text-xs text-gray-600">Fungicide spray advisory active for Nagpur taluka</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase">PM-KISAN Status</div>
            <div className="font-serif-display text-3xl font-bold text-emerald-800">17th Installment Credited</div>
            <p className="text-xs text-emerald-900 font-semibold">e-KYC active on Aadhaar linked bank account</p>
          </div>
        </div>

        {/* Saved Advisory Reports (Clickable Accordion) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <h3 className="font-serif-display text-2xl font-bold text-[#111827]">
                Saved Crop Advisory & Diagnostic History
              </h3>
              <p className="text-xs text-gray-600">
                Click any card to expand and review the original query, AI diagnosis, confidence score, and extension officer notes.
              </p>
            </div>
            <Link
              to="/demo"
              className="text-xs font-bold text-[#1b4332] hover:text-[#d97706] flex items-center gap-1"
            >
              <span>New AI Query</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              const isAutoEscalated = item.status === 'Auto-Escalated';
              const isOfficerVerified = item.status?.includes('Officer');

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                    isExpanded
                      ? 'border-[#1b4332] bg-white shadow-md'
                      : 'border-gray-200 bg-[#faf8f5] hover:bg-gray-100/90 hover:border-gray-300'
                  }`}
                  onClick={() => toggleExpand(item.id)}
                >
                  {/* Card Main Row Summary Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                          Crop: {item.crop}
                        </span>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">• {item.queryType}</span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 leading-snug">
                        {item.aiDiagnosis || item.question}
                      </h4>
                      <p className="text-xs text-gray-600 font-body line-clamp-1">
                        "{item.question}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                          isOfficerVerified
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : isAutoEscalated
                            ? 'bg-amber-50 text-amber-950 border-amber-300'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        }`}
                      >
                        {isOfficerVerified ? (
                          <>
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>{item.status}</span>
                          </>
                        ) : isAutoEscalated ? (
                          <>
                            <ShieldAlert className="w-4 h-4 text-[#d97706]" />
                            <span>Auto-Escalated</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>AI Resolved</span>
                          </>
                        )}
                      </div>

                      {/* Expand Arrow Icon */}
                      <button className="p-1 rounded-full text-gray-400 group-hover:text-gray-700">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#1b4332]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Accordion Conversation Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 bg-[#faf8f5] p-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Original Submitted Input */}
                        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                          <span className="text-xs font-bold text-gray-500 uppercase block">
                            Original Question ({item.queryType}):
                          </span>
                          <p className="text-sm font-bold text-gray-900">
                            "{item.question}"
                          </p>

                          {item.audioTranscript && (
                            <div className="pt-2 flex items-center gap-2 text-xs text-amber-900 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                              <Volume2 className="w-4 h-4 text-[#d97706]" />
                              <span>Audio Transcript: "{item.audioTranscript}"</span>
                            </div>
                          )}

                          {item.photoUrl && (
                            <div className="pt-2">
                              <span className="text-xs font-bold text-gray-600 block mb-1">Uploaded Crop Leaf Photo:</span>
                              <img
                                src={item.photoUrl}
                                alt="Crop leaf scan"
                                className="w-48 h-32 object-cover rounded-xl border-2 border-[#1b4332]"
                              />
                            </div>
                          )}
                        </div>

                        {/* AI Diagnostic Output */}
                        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <span className="text-xs font-bold uppercase text-[#1b4332]">
                              AI Diagnosis & Remedy Plan
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                              AI Confidence: {item.aiConfidence}%
                            </span>
                          </div>

                          <div className="text-sm font-bold text-amber-950">
                            Condition: {item.aiDiagnosis}
                          </div>

                          <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                            {item.remedy}
                          </p>
                        </div>

                        {/* Auto-Escalation Banner if applicable */}
                        {isAutoEscalated && (
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium space-y-1">
                            <div className="font-bold text-amber-900 flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 text-[#d97706]" />
                              <span>Auto-Escalation Status</span>
                            </div>
                            <p>
                              {item.escalationNote || `AI Confidence score (${item.aiConfidence}%) is below 80%. This case was automatically routed to extension officer Dr. Sunita Sharma (Nagpur KVK).`}
                            </p>
                          </div>
                        )}

                        {/* Officer Response if available */}
                        {item.officerResponse && (
                          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase">
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              <span>Extension Officer Response (Dr. Sunita Sharma, KVK Nagpur)</span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
                              "{item.officerResponse}"
                            </p>
                          </div>
                        )}

                        <div className="text-right text-[11px] text-gray-400 font-semibold">
                          Logged to Kisan Profile • {item.date}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
