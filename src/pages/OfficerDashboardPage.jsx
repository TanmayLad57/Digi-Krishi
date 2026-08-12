import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, PhoneCall, CheckCircle2, AlertTriangle, FileText, Search, Filter, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OfficerDashboardPage() {
  const { currentUser } = useAuth();
  const [activeCases, setActiveCases] = useState([
    {
      id: 'case-901',
      farmerName: 'Rajesh Patil',
      village: 'Pardi, Katol Taluka',
      crop: 'Cotton',
      queryType: 'Crop Photo Scan',
      condition: 'Yellow Leaf Rust / Severe Outbreak',
      aiConfidence: '88% (Triggered Escalation)',
      time: '10 mins ago',
      status: 'Pending Review',
      phone: '9876543210'
    },
    {
      id: 'case-902',
      farmerName: 'Suresh Deshmukh',
      village: 'Kalmeshwar',
      crop: 'Banana',
      queryType: 'Voice Query (Hindi)',
      condition: 'Black Sigatoka Leaf Spot',
      aiConfidence: '92%',
      time: '1 hour ago',
      status: 'Verified & SMS Sent',
      phone: '9822334455'
    },
  ]);

  const handleVerifyCase = (caseId) => {
    setActiveCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, status: 'Verified & Treatment Dispatched' } : c
      )
    );
  };

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Officer Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-[#d97706]" />
              <span>Krishi Vigyan Kendra • Extension Officer Portal</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#111827]">
              Welcome, {currentUser?.name || 'Dr. Sunita Sharma'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
              <span>ID: {currentUser?.officerId || 'OFF-1092'}</span>
              <span>•</span>
              <span>Designation: {currentUser?.designation || 'KVK Agronomy Scientist'}</span>
              <span>•</span>
              <span>Jurisdiction: {currentUser?.district || 'Nagpur'} District ({currentUser?.talukasCovered?.join(', ') || 'Katol, Kalmeshwar'})</span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>KVK Officer Verified Portal</span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase">Escalated Farmer Cases</div>
            <div className="font-serif-display text-3xl font-bold text-[#1b4332]">2 Active Cases</div>
            <p className="text-xs text-[#d97706] font-bold">1 Requires Urgent Review</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase">Resolved This Week</div>
            <div className="font-serif-display text-3xl font-bold text-emerald-800">48 Advisories</div>
            <p className="text-xs text-gray-600">Avg response time: 14 mins</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-1">
            <div className="text-xs font-bold text-gray-500 uppercase">Assigned Jurisdiction</div>
            <div className="font-serif-display text-3xl font-bold text-gray-900">Katol & Kalmeshwar</div>
            <p className="text-xs text-gray-600">12 Block Panchayat Centers</p>
          </div>
        </div>

        {/* Escalated Farmer Cases Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h3 className="font-serif-display text-2xl font-bold text-[#111827]">
                Incoming Farmer Escalation Queue
              </h3>
              <p className="text-xs text-gray-600">Review AI diagnoses, approve dosage remedies, or schedule field visits.</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 w-fit">
              Nagpur Extension Queue
            </span>
          </div>

          <div className="space-y-4">
            {activeCases.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-[#faf8f5] border-2 border-gray-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{c.farmerName}</span>
                    <span className="text-xs text-gray-500">({c.village})</span>
                    <span className="text-xs font-bold text-[#1b4332] bg-emerald-100 px-2 py-0.5 rounded-md">
                      {c.crop}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{c.time}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-bold block">Input Type:</span>
                    <span className="font-semibold text-gray-900">{c.queryType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block">AI Diagnostic Condition:</span>
                    <span className="font-bold text-amber-950">{c.condition} ({c.aiConfidence})</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Status: {c.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1 border border-gray-300"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#1b4332]" />
                      <span>Call Kisan ({c.phone})</span>
                    </a>

                    {c.status === 'Pending Review' && (
                      <button
                        onClick={() => handleVerifyCase(c.id)}
                        className="px-4 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 text-[#e9c46a]" />
                        <span>Approve & Dispatch SMS</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
