import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Camera, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Sprout } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-28 overflow-hidden bg-earth-pattern">
      {/* Subtle organic gradient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#e9c46a]/20 via-[#2d6a4f]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#d97706]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetric Copy & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2d6a4f]/10 dark:bg-[#40916c]/20 border border-[#2d6a4f]/20 dark:border-[#40916c]/30 text-[#1b4332] dark:text-[#74c69d] text-xs sm:text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 text-[#d97706] dark:text-[#e9c46a]" />
              <span>AI-Powered Kisan Advisory — Instant & Expert Backed</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1b4332] dark:text-[#f3eee7] font-bold leading-[1.12]"
            >
              Your AI Agricultural Assistant,{' '}
              <span className="relative inline-block text-[#d97706] dark:text-[#e9c46a]">
                Anytime, Anywhere.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#e9c46a]/60 dark:text-[#d97706]/60 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </motion.h1>

            {/* Supporting Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-body max-w-2xl font-normal leading-relaxed"
            >
              Ask crop questions in your language via <span className="font-semibold text-[#1b4332] dark:text-[#74c69d]">Voice 🎙</span>, <span className="font-semibold text-[#1b4332] dark:text-[#74c69d]">Text 💬</span>, or <span className="font-semibold text-[#1b4332] dark:text-[#74c69d]">Crop Leaf Photo 📷</span>. Get instant, scientific recommendations tailored to your soil, weather, and district.
            </motion.p>

            {/* Core Interaction Modalities Chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-wrap gap-2.5 pt-1"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-[#1c352b]/90 border border-gray-200 dark:border-[#40916c]/30 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                <Mic className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Voice Queries (Hindi / Local Dialects)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-[#1c352b]/90 border border-gray-200 dark:border-[#40916c]/30 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                <Camera className="w-3.5 h-3.5 text-[#2d6a4f] dark:text-[#74c69d]" />
                <span>Crop Photo AI Scanner</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-[#1c352b]/90 border border-gray-200 dark:border-[#40916c]/30 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm">
                <MessageSquare className="w-3.5 h-3.5 text-[#c8553d]" />
                <span>Smart WhatsApp & Web Chat</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
            >
              <a
                href="#interactive-demo"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] dark:bg-[#40916c] dark:hover:bg-[#74c69d] text-white dark:text-[#0c1813] font-semibold text-base shadow-lg shadow-[#1b4332]/25 dark:shadow-none hover:translate-y-[-2px] transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-[#1c352b] hover:bg-[#f3eee7] dark:hover:bg-[#254639] text-[#1b4332] dark:text-[#f3eee7] font-semibold text-base border border-[#2d6a4f]/20 dark:border-[#40916c]/30 shadow-sm hover:translate-y-[-1px] transition-all"
              >
                <span>Learn More</span>
              </a>
            </motion.div>

            {/* Trust metrics bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pt-6 border-t border-[#2d6a4f]/15 dark:border-[#40916c]/20 grid grid-cols-3 gap-4"
            >
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#e9c46a]">50k+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Farmer Queries Solved</div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2d6a4f] dark:text-[#74c69d]">98.4%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Diagnostic Accuracy</div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#d97706] dark:text-[#e9c46a]">100%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Free & Expert-Backed</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Visual & Floating AI Advisory Cards */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1c352b] bg-[#1b4332]/5">
                <img
                  src="/images/hero.png"
                  alt="Indian farmer holding smartphone in green field with AI technology overlay"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#132a22]/80 via-transparent to-transparent" />
                
                {/* Bottom Card Overlay inside image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#14271f]/95 backdrop-blur-md p-4 rounded-2xl border border-[#2d6a4f]/20 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Sprout className="w-5 h-5 text-[#e9c46a]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#d97706] dark:text-[#e9c46a]">Live AI Diagnosis</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">Just Now • Vidarbha</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                        "Yellow leaf spots on cotton crop identified as Leaf Rust."
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2d6a4f] dark:text-[#74c69d]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Recommended organic fungicide dosage sent in Hindi voice note</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-5 -left-4 sm:-left-6 bg-white dark:bg-[#1c352b] px-4 py-2.5 rounded-2xl shadow-xl border border-[#2d6a4f]/20 dark:border-[#40916c]/30 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#d97706]/15 flex items-center justify-center text-[#d97706] dark:text-[#e9c46a]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-100">ICAR Knowledge Base</div>
                  <div className="text-[10px] text-gray-600 dark:text-gray-400">Verified by Ag-Officers</div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
