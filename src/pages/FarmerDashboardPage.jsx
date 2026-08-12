import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, MapPin, Sparkles, Plus, History, ArrowRight, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboardPage() {
  const { currentUser } = useAuth();

  const recentDiagnoses = [
    {
      id: 'diag-1',
      date: 'Today, 2:15 PM',
      crop: 'Cotton',
      condition: 'Yellow Leaf Rust (Puccinia striiformis)',
      remedy: 'Neem oil spray (5ml/L water) or Propiconazole 25% EC',
      status: 'AI Resolved',
    },
    {
      id: 'diag-2',
      date: 'Yesterday',
      crop: 'Banana',
      condition: 'Black Sigatoka Leaf Spot',
      remedy: 'Prune infected lower leaves. Apply Copper Oxychloride @ 3g/L',
      status: 'Officer Verified (Dr. Sharma)',
    },
  ];

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
              Namaste, {currentUser?.name || 'Kisan Brother'}!
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#1b4332]" />
                {currentUser?.district || 'Nagpur'}, {currentUser?.state || 'Maharashtra'}
              </span>
              <span>•</span>
              <span>Crops: {currentUser?.crops?.join(', ') || 'Banana, Cotton'}</span>
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

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase">My Active Queries</div>
            <div className="font-serif-display text-3xl font-bold text-[#1b4332]">2 Case Reports</div>
            <p className="text-xs text-gray-600">1 AI resolved, 1 officer reviewed</p>
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

        {/* Saved Advisory Reports */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="space-y-1">
              <h3 className="font-serif-display text-2xl font-bold text-[#111827]">
                Saved Crop Advisory & Diagnostic History
              </h3>
              <p className="text-xs text-gray-600">Past AI scans, voice queries, and treatment plans saved to your profile.</p>
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
            {recentDiagnoses.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      Crop: {item.crop}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{item.condition}</h4>
                  <p className="text-xs text-gray-700 font-body">{item.remedy}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
