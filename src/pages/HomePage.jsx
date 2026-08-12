import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  Scan,
  CloudSun,
  Landmark,
  UserCheck,
  ArrowRight,
  Sparkles,
  Sprout,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const fullFeatures = [
    {
      id: 'ask-ai',
      icon: MessageSquareText,
      title: 'Ask Agricultural Questions',
      badge: 'Multilingual Voice & Text',
      description: 'Farmers can type or speak in Hindi, Marathi, Punjabi, or local dialects for instant expert guidance on pest management, fertilizer ratios, and crop health.',
      details: [
        'Voice input support for non-literate ease of access',
        'Understands local crop terms & regional pest names',
        'Provides step-by-step organic & chemical remedies'
      ],
      color: 'bg-[#1b4332] text-white',
      accentBorder: 'border-[#1b4332]',
    },
    {
      id: 'crop-diagnosis',
      icon: Scan,
      title: 'Crop Disease Diagnosis',
      badge: 'Computer Vision AI',
      description: 'Snap a picture of damaged leaves, stems, or fruits; our AI computer vision pinpoints diseases instantly with clear treatment steps.',
      details: [
        '98.4% accuracy on major Indian crops (Wheat, Cotton, Paddy, Mustard)',
        'Identifies early-stage leaf rust, stem borer, and nutrient deficiencies',
        'Recommends exact dosage per acre to prevent over-spraying'
      ],
      color: 'bg-[#d97706] text-white',
      accentBorder: 'border-[#d97706]',
    },
    {
      id: 'weather-advisory',
      icon: CloudSun,
      title: 'Weather & Micro-climate Advisory',
      badge: 'Real-time Forecast',
      description: 'Hyperlocal district-level rainfall predictions and custom alerts on optimal spray timing to protect crops from sudden rain washouts.',
      details: [
        'District & taluka micro-climate forecast integration',
        'Automated spray window advisories (e.g. "Do not spray fungicide today due to rain")',
        'Temperature & humidity risk alerts for fungal outbreaks'
      ],
      color: 'bg-[#2d6a4f] text-white',
      accentBorder: 'border-[#2d6a4f]',
    },
    {
      id: 'gov-schemes',
      icon: Landmark,
      title: 'Government Schemes & Subsidies',
      badge: 'Direct Scheme Access',
      description: 'Step-by-step assistance for PM-KISAN, PM Fasal Bima Yojana, Soil Health Card, and state-specific agricultural subsidy applications.',
      details: [
        'e-KYC and installment status checking assistant',
        'Solar pump (PM-KUSUM) 60% subsidy eligibility calculator',
        'Simple document checklist for easy scheme registration'
      ],
      color: 'bg-[#c8553d] text-white',
      accentBorder: 'border-[#c8553d]',
    },
    {
      id: 'officer-support',
      icon: UserCheck,
      title: 'Agriculture Officer Escalation',
      badge: 'Human Expert Backup',
      description: 'If a query is complex or needs field verification, it automatically routes to a real Krishi Vigyan Kendra (KVK) extension officer.',
      details: [
        'Automatic routing to district extension officer queue',
        'Farmer gets SMS notification with officer name & contact details',
        'Field visit queue management for severe outbreak reports'
      ],
      color: 'bg-[#132a22] text-white',
      accentBorder: 'border-[#132a22]',
    },
  ];

  return (
    <div className="pt-24 pb-16 space-y-16 bg-[#faf8f5]">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden bg-earth-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs sm:text-sm font-bold"
              >
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>AI-Powered Kisan Advisory — Instant & Expert Backed</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#111827] font-bold leading-[1.12]"
              >
                Your AI Agricultural Assistant,{' '}
                <span className="text-[#d97706] relative inline-block">
                  Anytime, Anywhere.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-700 font-body leading-relaxed"
              >
                Ask crop questions in your language via <span className="font-bold text-[#1b4332]">Voice 🎙</span>, <span className="font-bold text-[#1b4332]">Text 💬</span>, or <span className="font-bold text-[#1b4332]">Crop Photo 📷</span>. Get instant, scientific recommendations tailored to your soil, weather, and district.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#e9c46a] font-bold text-base shadow-lg transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-gray-100 text-[#111827] font-bold text-base border border-gray-300 shadow-sm transition-all"
                >
                  <span>Learn More</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Image Frame */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
              >
                <img
                  src="/images/hero.png"
                  alt="Indian farmer utilizing smart smartphone app in crop field"
                  className="w-full h-[400px] sm:h-[460px] object-cover"
                />
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-lg text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1b4332] flex items-center justify-center text-[#e9c46a] shrink-0">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#d97706]">Live AI Diagnosis</span>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        "Yellow leaf spots on cotton identified as Leaf Rust."
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* High-Contrast Stats Strip */}
      <section className="bg-[#1b4332] text-white py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#2d6a4f]">
            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="font-serif-display text-4xl font-bold text-[#e9c46a]">50,000+</div>
              <div className="text-sm font-bold text-gray-200">Farmer Queries Solved</div>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="font-serif-display text-4xl font-bold text-[#e9c46a]">98.4%</div>
              <div className="text-sm font-bold text-gray-200">Diagnostic Accuracy</div>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="font-serif-display text-4xl font-bold text-[#e9c46a]">100% Free</div>
              <div className="text-sm font-bold text-gray-200">Expert-Backed & Open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Full Feature Capabilities Section (Directly Below Stats Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827]">
            Core Agricultural Features
          </h2>
          <p className="text-base text-gray-700 font-body leading-relaxed">
            Combining verified ICAR research datasets with 24/7 AI multi-modal availability and human extension officer escalation.
          </p>
        </div>

        {/* Full Detailed Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fullFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            const isWide = idx === 0;

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-3xl p-8 border-2 ${feat.accentBorder} shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                  isWide ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-display text-2xl font-bold text-[#111827] pt-2">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-gray-700 leading-relaxed font-body">
                    {feat.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">Key Highlights:</div>
                    <ul className="space-y-1.5">
                      {feat.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">Feature Ready</span>
                  <Link
                    to="/demo"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1b4332] hover:text-[#d97706] transition-colors"
                  >
                    <span>Test in AI Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-xl">
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
            Ready to Try Digital Krishi Officer?
          </h2>
          <p className="text-base text-gray-200 max-w-xl mx-auto font-body">
            Test custom questions, voice input, crop leaf scanning, and officer escalation in our interactive simulator.
          </p>
          <div>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#e9c46a] hover:bg-[#f59e0b] text-[#1b4332] font-bold text-base shadow-lg transition-all"
            >
              <span>Launch AI Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
