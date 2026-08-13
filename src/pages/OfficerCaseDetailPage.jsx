import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  PhoneCall,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  Clock,
  Sparkles,
  ShieldCheck,
  UserCheck,
  FileText,
  MessageSquareText,
  Sprout,
  Camera,
  Play
} from 'lucide-react';
import { getStoredCases, saveStoredCases } from '../data/mockCases';

export default function OfficerCaseDetailPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Common Remedy Templates
  const REMEDY_TEMPLATES = [
    {
      title: 'Neem Oil Organic Spray (5ml/L)',
      text: 'Apply 5% Neem Seed Kernel Extract (NSKE) or Neem Oil solution @ 5ml/liter water early morning. Spray thoroughly under leaf canopy. Repeat after 7 days.',
    },
    {
      title: 'Propiconazole Fungicide Dosage (1ml/L)',
      text: 'Spray Propiconazole 25% EC @ 1ml/liter water. Ensure thorough coverage of infected spots. Do not harvest within 14 days of spraying.',
    },
    {
      title: 'Cartap Hydrochloride Stem Borer Remedy',
      text: 'Apply Cartap Hydrochloride 4% GR @ 5 kg/acre in standing water for stem borer control. Maintain 3-5 cm water level for 4 days after application.',
    },
    {
      title: 'PM-KISAN e-KYC CSC Center Steps',
      text: 'Visit nearest Common Service Centre (CSC) with Aadhaar card & linked mobile number for biometric e-KYC verification to release pending installment.',
    },
  ];

  useEffect(() => {
    const allCases = getStoredCases();
    const found = allCases.find((c) => c.id === caseId) || allCases[0];
    setCaseData(found);
    if (found?.officerResponse) {
      setResponseText(found.officerResponse);
    }
  }, [caseId]);

  if (!caseData) return null;

  // Handle Quick Template Select
  const handleTemplateSelect = (e) => {
    const selectedTitle = e.target.value;
    const template = REMEDY_TEMPLATES.find((t) => t.title === selectedTitle);
    if (template) {
      setResponseText((prev) => (prev ? `${prev}\n\n${template.text}` : template.text));
    }
  };

  // Save Response
  const handleSendResponse = (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    const allCases = getStoredCases();
    const updated = allCases.map((c) => {
      if (c.id === caseData.id) {
        return {
          ...c,
          officerResponse: responseText,
          status: c.status === 'Pending' ? 'In Progress' : c.status,
          timeline: [
            ...c.timeline,
            { step: 'Officer Responded', time: 'Just now', text: `Officer sent response via SMS: "${responseText.substring(0, 45)}..."` },
          ],
        };
      }
      return c;
    });

    saveStoredCases(updated);
    setCaseData((prev) => ({ ...prev, officerResponse: responseText, status: prev.status === 'Pending' ? 'In Progress' : prev.status }));
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  // Toggle Resolve
  const handleToggleResolve = () => {
    const newStatus = caseData.status === 'Resolved' ? 'In Progress' : 'Resolved';
    const allCases = getStoredCases();
    const updated = allCases.map((c) => {
      if (c.id === caseData.id) {
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            { step: newStatus, time: 'Just now', text: `Case marked as ${newStatus} by Officer.` },
          ],
        };
      }
      return c;
    });

    saveStoredCases(updated);
    setCaseData((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Back Nav Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate('/officer-dashboard/cases')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#1b4332]" />
          <span>Back to Cases Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Case ID: {caseData.id}</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              caseData.status === 'Resolved'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {caseData.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column Context (7 cols) + Right Column Response & Timeline (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 cols): Full Farmer & Query Context */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Farmer Info Panel */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#1b4332]" />
                Farmer Profile Context
              </span>
              <a
                href={`tel:${caseData.farmerPhone}`}
                className="px-3.5 py-1.5 rounded-xl bg-[#1b4332] text-white hover:bg-[#2d6a4f] text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#e9c46a]" />
                <span>Call Kisan ({caseData.farmerPhone})</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 font-bold block">Farmer Name:</span>
                <span className="font-serif-display text-xl font-bold text-gray-900">{caseData.farmerName}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-bold block">Location:</span>
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d97706]" />
                  {caseData.village}, {caseData.taluka} Taluka ({caseData.district}, {caseData.state})
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-bold block">Primary Crops:</span>
                <span className="text-xs font-bold text-gray-900">{caseData.crops?.join(', ') || caseData.crop}</span>
              </div>

              <div>
                <span className="text-xs text-gray-500 font-bold block">Land Area:</span>
                <span className="text-xs font-bold text-gray-900">{caseData.landArea || '5 Acres'}</span>
              </div>
            </div>
          </div>

          {/* 2. Original Farmer Query */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareText className="w-4 h-4 text-[#d97706]" />
                Original Submitted Question ({caseData.queryType})
              </span>
              <span className="text-xs text-gray-400 font-medium">{caseData.submittedTime}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 space-y-2">
              <p className="text-sm sm:text-base font-bold text-gray-900 font-body leading-relaxed">
                "{caseData.question}"
              </p>

              {/* Voice Query Audio Player if applicable */}
              {caseData.queryType.includes('Voice') && (
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                    className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#2d6a4f]"
                  >
                    {isAudioPlaying ? (
                      <>
                        <Volume2 className="w-4 h-4 text-[#e9c46a] animate-pulse" />
                        <span>Playing Voice Audio (0:15)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-[#e9c46a]" />
                        <span>▶ Play Original Audio Recording</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Attached Photo Scan preview if applicable */}
            {caseData.photoUrl && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-700 block flex items-center gap-1">
                  <Camera className="w-4 h-4 text-[#1b4332]" /> Attached Crop Leaf Photo & Bounding Box Overlay:
                </span>
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#1b4332] max-w-md">
                  <img
                    src={caseData.photoUrl}
                    alt="Farmer crop leaf scan"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="bg-black/75 backdrop-blur-sm border-2 border-[#e9c46a] text-[#e9c46a] text-xs font-bold px-4 py-2 rounded-xl">
                      AI Computer Vision Box: {caseData.aiConfidence}% Match
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. AI Analysis & Escalation Reason */}
          <div className="bg-[#faf8f5] p-6 rounded-3xl border-2 border-[#1b4332]/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                Automated AI Analysis & Escalation Trigger
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Confidence: {caseData.aiConfidence}%
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-800 font-body">
              <div>
                <span className="font-bold text-gray-900 block">AI Detected Condition:</span>
                <span className="font-bold text-amber-950 text-sm">{caseData.aiDiagnosis}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200 text-amber-900 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                <span><strong>Reason for Escalation:</strong> {caseData.escalationReason}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Officer Response Form & Timeline */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Officer Response Workspace */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#1b4332]" />
                Extension Officer Advisory Response
              </span>
              <button
                onClick={handleToggleResolve}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-all border ${
                  caseData.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {caseData.status === 'Resolved' ? '✓ Marked Resolved' : 'Mark as Resolved'}
              </button>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              {/* Quick Template Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Quick Select Remedy Template:
                </label>
                <select
                  onChange={handleTemplateSelect}
                  defaultValue=""
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 bg-gray-50 focus:outline-none"
                >
                  <option value="" disabled>-- Select pre-formatted remedy text --</option>
                  {REMEDY_TEMPLATES.map((t) => (
                    <option key={t.title} value={t.title}>{t.title}</option>
                  ))}
                </select>
              </div>

              {/* Response Textarea */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-900 uppercase">
                  Expert Advisory Note to Farmer:
                </label>
                <textarea
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type official KVK agricultural advice, chemical dosage per acre, or spray instructions..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-xs font-medium text-gray-900"
                  required
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4 text-[#e9c46a]" />
                <span>Send Response to Farmer (SMS / Mobile)</span>
              </button>

              {isSent && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-300 text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Advisory response sent successfully to farmer's mobile!</span>
                </div>
              )}
            </form>
          </div>

          {/* Case Activity Timeline Log */}
          <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm space-y-4">
            <div className="text-xs font-bold text-gray-900 uppercase border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1b4332]" />
              Case Activity Timeline & Audit Log
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {caseData.timeline.map((item, idx) => (
                <div key={idx} className="relative text-xs space-y-0.5">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#1b4332] border-2 border-white" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{item.step}</span>
                    <span className="text-[10px] text-gray-400 font-semibold">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-body">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
