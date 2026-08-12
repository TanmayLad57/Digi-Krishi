import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText,
  Mic,
  Camera,
  Landmark,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Volume2,
  ShieldAlert,
  UserCheck,
  Sprout,
  Upload,
  ImageIcon,
  Search,
  Lock,
  X,
  User,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DemoPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('text-ai');
  const [escalated, setEscalated] = useState(false);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);

  // Tab 1: Ask AI (Text) State
  const [userQuery, setUserQuery] = useState('');
  const [textSubmitted, setTextSubmitted] = useState(false);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState(null);

  // Tab 2: Voice Query State
  const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'recording' | 'processing' | 'done'
  const [voiceTimer, setVoiceTimer] = useState(0);

  // Tab 3: Crop Disease Scan State
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'done'
  const [scannedImage, setScannedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Tab 4: Government Schemes State
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState('pm-kisan');
  const [farmerIdInput, setFarmerIdInput] = useState('');
  const [isVerifyingScheme, setIsVerifyingScheme] = useState(false);

  // Intercept action if user is not logged in
  const checkAuthOrGate = (onAuthenticatedAction) => {
    if (!isAuthenticated) {
      setShowAuthGateModal(true);
      return false;
    }
    onAuthenticatedAction();
    return true;
  };

  const samplePrompts = [
    'My banana leaves have black spots. What should I do?',
    'Yellow spots on cotton leaves in Vidarbha district',
    'Best organic fertilizer dose for paddy before monsoons',
    'How to apply for PM-KISAN 17th installment e-KYC?'
  ];

  // Submit Text AI Query
  const handleTextSubmit = (queryToSubmit) => {
    const q = queryToSubmit || userQuery;
    if (!q.trim()) return;

    checkAuthOrGate(() => {
      setUserQuery(q);
      setIsAnalyzingText(true);
      setEscalated(false);

      setTimeout(() => {
        setIsAnalyzingText(false);
        setTextSubmitted(true);

        if (q.toLowerCase().includes('banana') || q.toLowerCase().includes('black spot')) {
          setActiveAnswer({
            query: q,
            diagnosis: 'Black Sigatoka Leaf Spot (Fungal Infection)',
            remedy: 'Prune heavily infected lower leaves immediately. Apply Copper Oxychloride 50% WP @ 3g/liter water or Propiconazole 25% EC (1ml/liter). Maintain 2.5m plant spacing to reduce canopy humidity.',
            weatherAlert: 'Rain forecasted in 48 hours in your district. Spray immediately before rainfall.',
          });
        } else if (q.toLowerCase().includes('cotton') || q.toLowerCase().includes('yellow')) {
          setActiveAnswer({
            query: q,
            diagnosis: 'Yellow Leaf Rust / Nitrogen Deficiency',
            remedy: 'Spray 1% Urea solution mixed with Neem oil formulation (5ml/L water). Apply Propiconazole if rust exceeds 10% leaf surface.',
            weatherAlert: 'Humidity above 80% — ideal for fungal spread. Monitor fields daily.',
          });
        } else {
          setActiveAnswer({
            query: q,
            diagnosis: 'General Agronomy & Pest Prevention Advisory',
            remedy: `Based on ICAR agronomy guidelines: Apply balanced NPK (12:32:16) ratio and incorporate 2 tons/acre organic farmyard manure. Spray Neem oil (5ml/L) as a preventive measure.`,
            weatherAlert: 'Normal micro-climate forecast for your taluka.',
          });
        }
      }, 1000);
    });
  };

  // Start Voice Recording
  const handleStartRecording = () => {
    checkAuthOrGate(() => {
      setVoiceState('recording');
      setVoiceTimer(3);
      setEscalated(false);

      const interval = setInterval(() => {
        setVoiceTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setVoiceState('processing');
            setTimeout(() => {
              setVoiceState('done');
            }, 1200);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });
  };

  // Handle Audio File Upload
  const handleAudioUpload = (e) => {
    checkAuthOrGate(() => {
      if (e.target.files && e.target.files[0]) {
        setVoiceState('processing');
        setEscalated(false);
        setTimeout(() => {
          setVoiceState('done');
        }, 1200);
      }
    });
  };

  // Trigger Photo Scan
  const triggerPhotoScan = (imageSrc) => {
    checkAuthOrGate(() => {
      setScannedImage(imageSrc);
      setScanState('scanning');
      setEscalated(false);

      setTimeout(() => {
        setScanState('done');
      }, 1500);
    });
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageURL = URL.createObjectURL(file);
      triggerPhotoScan(imageURL);
    }
  };

  // Submit Government Scheme Check
  const handleSchemeSubmit = (e) => {
    e.preventDefault();
    checkAuthOrGate(() => {
      setIsVerifyingScheme(true);
      setEscalated(false);

      setTimeout(() => {
        setIsVerifyingScheme(false);
        setSchemeSubmitted(true);
      }, 1000);
    });
  };

  const tabs = [
    { id: 'text-ai', name: 'Ask AI (Text)', icon: MessageSquareText, badge: 'Custom Text Input' },
    { id: 'voice', name: 'Voice Query (Hindi)', icon: Mic, badge: 'Record or Upload Audio' },
    { id: 'scan', name: 'Crop Disease Scan', icon: Camera, badge: 'Upload Leaf Photo' },
    { id: 'scheme', name: 'Government Schemes', icon: Landmark, badge: 'Subsidy Status' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Interactive AI Advisory Engine</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#111827]">
            Digital Krishi AI Engine
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-body leading-relaxed">
            Select any feature below to test text questions, voice recording, crop photo scanning, or subsidy verification.
          </p>
        </div>

        {/* Demo Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden relative">
          
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 bg-gray-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEscalated(false);
                  }}
                  className={`py-4 px-3 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm font-bold border-b-4 transition-all ${
                    isActive
                      ? 'border-[#1b4332] text-[#1b4332] bg-white shadow-sm'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d97706]' : ''}`} />
                    <span>{tab.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500 hidden sm:inline">
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: ASK AI (TEXT INPUT) */}
              {activeTab === 'text-ai' && (
                <motion.div
                  key="text-ai-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={(e) => { e.preventDefault(); handleTextSubmit(); }} className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">
                      Type Your Agricultural Question Below:
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="e.g., My banana leaves have black spots. What should I do?"
                        className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900 shadow-sm"
                      />
                      <button
                        type="submit"
                        disabled={isAnalyzingText}
                        className="px-6 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center gap-2 shrink-0 transition-all"
                      >
                        {isAnalyzingText ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <span>Ask AI</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-gray-500">Or click a sample question:</span>
                      {samplePrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleTextSubmit(prompt)}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 hover:bg-[#1b4332]/10 hover:text-[#1b4332] text-gray-700 border border-gray-200 transition-colors"
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </form>

                  {!textSubmitted && !isAnalyzingText && (
                    <div className="p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center bg-gray-50 space-y-2">
                      <MessageSquareText className="w-8 h-8 text-gray-400 mx-auto" />
                      <h4 className="text-sm font-bold text-gray-700">No question submitted yet</h4>
                      <p className="text-xs text-gray-500">Type any question above or click one of the sample prompt buttons to see the instant AI diagnosis.</p>
                    </div>
                  )}

                  {textSubmitted && activeAnswer && !isAnalyzingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#faf8f5] p-6 rounded-2xl border-2 border-[#1b4332]/20 space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#1b4332] text-[#e9c46a] flex items-center justify-center">
                            <Sprout className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
                            Digital Krishi Officer Advisory Output
                          </span>
                        </div>
                        <button
                          onClick={() => { setTextSubmitted(false); setUserQuery(''); }}
                          className="text-xs font-bold text-[#1b4332] hover:underline"
                        >
                          Ask Another Question
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold uppercase text-gray-500">Your Submitted Question:</span>
                          <p className="text-sm font-bold text-gray-900">"{activeAnswer.query}"</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                          <span className="text-xs font-bold text-amber-900 block">Identified Condition:</span>
                          <span className="text-base font-bold text-amber-950">{activeAnswer.diagnosis}</span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-gray-900 block">Actionable Remedy & Spray Treatment:</span>
                          <p className="text-xs sm:text-sm text-gray-800 font-body leading-relaxed">
                            {activeAnswer.remedy}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold bg-amber-100 p-3 rounded-xl border border-amber-200">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                          <span>{activeAnswer.weatherAlert}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: VOICE QUERY */}
              {activeTab === 'voice' && (
                <motion.div
                  key="voice-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {voiceState === 'idle' && (
                    <div className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-[#d97706] flex items-center justify-center mx-auto shadow-sm">
                        <Mic className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <h3 className="font-serif-display text-xl font-bold text-gray-900">
                          Ask Question via Voice in Your Language
                        </h3>
                        <p className="text-xs text-gray-600">
                          Speak naturally in Hindi, Marathi, Punjabi, or local terms. No typing required!
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <button
                          onClick={handleStartRecording}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all"
                        >
                          <Mic className="w-5 h-5 text-[#e9c46a]" />
                          <span>🎤 Tap to Record</span>
                        </button>

                        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-gray-100 text-gray-800 font-bold text-sm border-2 border-gray-300 shadow-sm cursor-pointer transition-all">
                          <Upload className="w-4 h-4 text-gray-600" />
                          <span>Upload Audio File</span>
                          <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                        </label>
                      </div>
                    </div>
                  )}

                  {voiceState === 'recording' && (
                    <div className="p-10 rounded-3xl border-2 border-[#d97706] bg-amber-50 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#d97706] text-white flex items-center justify-center mx-auto animate-pulse shadow-lg">
                        <Mic className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">Listening to Voice Input...</span>
                        <h4 className="text-2xl font-bold text-gray-900 font-serif-display">0:0{voiceTimer} Remaining</h4>
                        <p className="text-xs text-gray-600 italic">Speaking in Hindi / Regional dialect...</p>
                      </div>
                    </div>
                  )}

                  {voiceState === 'processing' && (
                    <div className="p-10 rounded-3xl border-2 border-gray-300 bg-gray-50 text-center space-y-3">
                      <RefreshCw className="w-10 h-10 text-[#1b4332] animate-spin mx-auto" />
                      <h4 className="text-sm font-bold text-gray-800">Transcribing Voice Audio & Cross-Referencing ICAR Database...</h4>
                    </div>
                  )}

                  {voiceState === 'done' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-xs font-bold text-gray-500">Recorded Audio Transcription</span>
                        <button
                          onClick={() => setVoiceState('idle')}
                          className="text-xs font-bold text-[#1b4332] hover:underline"
                        >
                          Record Again / Reset
                        </button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Mic className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500">Transcribed Farmer Voice (Hindi • 0:12)</span>
                          <p className="text-sm sm:text-base font-bold text-gray-900 italic">
                            "मानसून की बारिश के बाद धान की फसल में तना छेदक (Stem Borer) से बचाव के उपाय बताएं?"
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#faf8f5] p-6 rounded-2xl border-2 border-[#1b4332]/20 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                            AI Voice Advisory Output (Hindi Audio)
                          </span>
                          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] shadow-sm">
                            <Volume2 className="w-4 h-4 text-[#e9c46a]" /> Play Voice Response
                          </button>
                        </div>
                        <p className="text-sm sm:text-base text-gray-800 font-body leading-relaxed">
                          "नमस्कार किसान भाई! बारिश के बाद धान में तना छेदक का खतरा बढ़ता है। खेत में प्रकाश प्रपंच (Light Trap) लगाएं और 5-6 ट्राइकोकार्ड प्रति एकड़ स्थापित करें। रासायनिक उपचार के लिए कारटाप हाइड्रोक्लोराइड 4% जीआर (5 किग्रा/एकड़) का प्रयोग करें।"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: CROP DISEASE SCAN */}
              {activeTab === 'scan' && (
                <motion.div
                  key="scan-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {scanState === 'idle' && (
                    <div className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mx-auto shadow-sm">
                        <Camera className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <h3 className="font-serif-display text-xl font-bold text-gray-900">
                          Upload Crop Photo for AI Disease Scan
                        </h3>
                        <p className="text-xs text-gray-600">
                          Select a leaf or crop photo from your smartphone. AI computer vision pinpoints diseases instantly.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <button
                          onClick={() => {
                            checkAuthOrGate(() => {
                              fileInputRef.current?.click();
                            });
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition-all"
                        >
                          <Upload className="w-5 h-5 text-[#e9c46a]" />
                          <span>📷 Upload Crop Photo</span>
                        </button>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-500 block mb-2">Or test with a sample crop photo preset:</span>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={() => triggerPhotoScan('/images/disease-scanner.png')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-[#1b4332]/10 hover:border-[#1b4332]"
                          >
                            <ImageIcon className="w-4 h-4 text-[#d97706]" />
                            <span>Sample 1: Yellow Leaf Rust on Cotton</span>
                          </button>
                          <button
                            onClick={() => triggerPhotoScan('/images/hero.png')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-[#1b4332]/10 hover:border-[#1b4332]"
                          >
                            <ImageIcon className="w-4 h-4 text-[#1b4332]" />
                            <span>Sample 2: Wheat Field Health Scan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {scanState === 'scanning' && (
                    <div className="p-12 rounded-3xl border-2 border-[#1b4332] bg-gray-50 text-center space-y-4">
                      <RefreshCw className="w-12 h-12 text-[#1b4332] animate-spin mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-serif-display text-xl font-bold text-gray-900">Scanning Image with Computer Vision...</h4>
                        <p className="text-xs text-gray-600">Matching leaf symptoms with 10,000+ agricultural disease patterns.</p>
                      </div>
                    </div>
                  )}

                  {scanState === 'done' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-xs font-bold text-gray-500">Scan Diagnostic Complete</span>
                        <button
                          onClick={() => { setScanState('idle'); setScannedImage(null); }}
                          className="text-xs font-bold text-[#1b4332] hover:underline"
                        >
                          Try Another Photo / Reset
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-5 relative rounded-2xl overflow-hidden border-2 border-[#1b4332]">
                          <img
                            src={scannedImage || "/images/disease-scanner.png"}
                            alt="Uploaded crop leaf"
                            className="w-full h-56 md:h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-black/75 backdrop-blur-sm border-2 border-[#e9c46a] text-[#e9c46a] text-xs font-bold px-4 py-2 rounded-xl">
                              AI Bounding Box Scan: 96% Match
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Detected: Yellow Leaf Rust (Puccinia striiformis)
                          </span>

                          <h4 className="font-serif-display text-xl font-bold text-[#111827]">
                            Actionable Treatment Plan:
                          </h4>

                          <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                              <span><strong>Organic Remedy:</strong> Neem oil spray solution (5ml/L water) early morning.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                              <span><strong>Chemical Treatment:</strong> Propiconazole 25% EC @ 1ml/liter water.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                              <span><strong>Spray Advice:</strong> High humidity expected tomorrow. Spray before rain starts.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: GOVERNMENT SCHEMES */}
              {activeTab === 'scheme' && (
                <motion.div
                  key="scheme-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSchemeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Select Government Scheme:</label>
                        <select
                          value={selectedScheme}
                          onChange={(e) => setSelectedScheme(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white"
                        >
                          <option value="pm-kisan">PM Kisan Samman Nidhi Yojana</option>
                          <option value="pm-kusum">PM-KUSUM Solar Pump 60% Subsidy</option>
                          <option value="soil-card">Soil Health Card & Fertilizer Grant</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Enter Registration / Aadhaar No:</label>
                        <input
                          type="text"
                          value={farmerIdInput}
                          onChange={(e) => setFarmerIdInput(e.target.value)}
                          placeholder="e.g. 9845-XXXX-1234 (Mock ID)"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingScheme}
                      className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:bg-gray-300 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      {isVerifyingScheme ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying e-KYC Records...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Check Subsidy Status & Eligibility</span>
                        </>
                      )}
                    </button>
                  </form>

                  {schemeSubmitted && !isVerifyingScheme && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h4 className="font-serif-display text-xl font-bold text-[#111827]">
                          Subsidy Verification Result
                        </h4>
                        <button
                          onClick={() => setSchemeSubmitted(false)}
                          className="text-xs font-bold text-[#1b4332] hover:underline"
                        >
                          Check Another Scheme / Reset
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#faf8f5] border-2 border-emerald-300 space-y-1">
                          <div className="text-xs text-gray-600 font-bold">PM-KISAN 17th Installment Status</div>
                          <div className="text-base font-bold text-emerald-950">₹2,000 Credited via Direct Benefit Transfer</div>
                          <div className="text-[11px] text-emerald-800 font-semibold">e-KYC Verified & Bank Account Linked</div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#faf8f5] border-2 border-amber-300 space-y-1">
                          <div className="text-xs text-gray-600 font-bold">PM-KUSUM Solar Pump Subsidy</div>
                          <div className="text-base font-bold text-amber-950">60% State Government Subsidy Eligible</div>
                          <div className="text-[11px] text-amber-800 font-semibold">5HP Solar Pump Application Approved</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>

            {/* Officer Escalation Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Uncertain or Complex Case?</div>
                  <div className="text-[11px] font-semibold text-gray-600">Route query to a real Krishi Vigyan Kendra Officer</div>
                </div>
              </div>

              <button
                onClick={() => {
                  checkAuthOrGate(() => {
                    setEscalated(!escalated);
                  });
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  escalated
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-[#1b4332] border-2 border-[#1b4332] hover:bg-[#1b4332] hover:text-white'
                }`}
              >
                {escalated ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#e9c46a]" />
                    <span>Escalated to Officer Sharma (Nagpur District)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-[#d97706]" />
                    <span>Escalate to Agriculture Officer</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Auth-Gating Modal Interceptor */}
      <AnimatePresence>
        {showAuthGateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-gray-200 space-y-5 text-center relative"
            >
              <button
                onClick={() => setShowAuthGateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7 text-[#d97706]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-display text-2xl font-bold text-gray-900">
                  Sign In to Get Personalized Advice
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-body leading-relaxed">
                  Create a free account to ask questions, save your advisory history, and get instant recommendations tailored to your specific crops and location.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 text-left space-y-1">
                <span className="block">💡 Testing Hackathon Demo?</span>
                <span className="font-semibold block text-gray-700">
                  Click "Sign In" below and use the <strong>1-Click Autofill Demo Login</strong> button!
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  to="/login?role=farmer&redirect=/demo"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md"
                >
                  <User className="w-4 h-4 text-[#e9c46a]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register?role=farmer&redirect=/demo"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm border-2 border-gray-300 shadow-sm"
                >
                  <UserPlus className="w-4 h-4 text-[#1b4332]" />
                  <span>Create Free Account</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
