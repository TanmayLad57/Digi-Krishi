import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  ShieldCheck,
  Languages,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function WhyUsPage() {
  const trustPillars = [
    {
      icon: Zap,
      title: 'Instant 24/7 Answers',
      description: 'No waiting for office hours or traveling miles to extension centers. Get instant crop disease remedies day or night right in your field.',
      color: 'bg-[#d97706]/10 text-[#d97706]',
      border: 'border-[#d97706]/30',
    },
    {
      icon: Target,
      title: 'Personalized to Your Crops & Soil',
      description: 'Advice isn’t generic — it adapts to your district weather forecast, soil type, and exact crop growth stage (Wheat, Cotton, Paddy, Mustard).',
      color: 'bg-[#1b4332]/10 text-[#1b4332]',
      border: 'border-[#1b4332]/30',
    },
    {
      icon: ShieldCheck,
      title: 'Backed by Real Agronomy Experts',
      description: 'Engineered using verified ICAR research datasets and supported by local Krishi Vigyan Kendra (KVK) extension officers for 100% reliability.',
      color: 'bg-[#c8553d]/10 text-[#c8553d]',
      border: 'border-[#c8553d]/30',
    },
    {
      icon: Languages,
      title: 'Voice-First in Native Languages',
      description: 'Designed for effortless accessibility — speak naturally in Hindi, Marathi, Punjabi, Telugu, and Kannada with clear audio playback.',
      color: 'bg-[#2d6a4f]/10 text-[#2d6a4f]',
      border: 'border-[#2d6a4f]/30',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Why Choose Digital Krishi Officer</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#111827]">
            Built for Smart Indian Agriculture
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-body leading-relaxed">
            Delivering trusted agronomy intelligence to every kisan across India with speed, personalization, and expert accountability.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trustPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-3xl p-8 border-2 ${pillar.border} shadow-sm hover:shadow-lg transition-all space-y-4`}
              >
                <div className={`w-14 h-14 rounded-2xl ${pillar.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#111827]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-body">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Agriculture Officer Collaboration Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border-2 border-gray-200 shadow-md">
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
              <img
                src="/images/officer.png"
                alt="Agriculture Extension Officer in field with farmer"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              <UserCheck className="w-4 h-4" />
              <span>Human + AI Partnership</span>
            </div>
            <h2 className="font-serif-display text-3xl font-bold text-[#111827]">
              Seamless Escalation to Extension Officers
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed font-body">
              Digital Krishi Officer doesn’t replace real experts — it empowers them. When AI encounters complex symptoms or severe pest outbreaks, it immediately queues the case for a local Krishi Vigyan Kendra extension officer for field review.
            </p>
            <div className="pt-2">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b4332] text-white font-bold text-sm hover:bg-[#2d6a4f] transition-all shadow-md"
              >
                <span>Test Escalation in Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
