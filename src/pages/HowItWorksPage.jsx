import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Cpu,
  CheckCircle2,
  UserCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Database,
  FileCheck2
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Farmer Asks a Question',
      badge: 'Multi-Modal Input',
      description: 'Speak in your local language, type a query in our Ask AI box, or snap a photo of infected leaves or soil using your smartphone.',
      details: 'Supports Hindi, Marathi, Punjabi, Telugu, and English with voice audio synthesis.',
      icon: HelpCircle,
      color: 'bg-[#1b4332] text-white',
    },
    {
      number: '02',
      title: 'AI & Knowledge Base Analysis',
      badge: 'Agronomy AI Core',
      description: 'Our engine cross-references your input against verified ICAR research, regional weather forecasts, and historical crop data.',
      details: 'Evaluates micro-climate temperature, humidity, and district-level soil health cards.',
      icon: Cpu,
      color: 'bg-[#d97706] text-white',
    },
    {
      number: '03',
      title: 'Instant Actionable Answer',
      badge: '24/7 Response',
      description: 'Receive step-by-step remedies, precise spray dosage per acre, organic alternatives, and spray weather timing in simple language.',
      details: 'Clear organic solutions (Neem oil) alongside recommended scientific chemical dosages.',
      icon: CheckCircle2,
      color: 'bg-[#2d6a4f] text-white',
    },
    {
      number: '04',
      title: 'Human Officer Escalation',
      badge: 'Real Expert Backup',
      description: 'If the diagnosis has edge-case complexity or confidence is under 90%, it is automatically routed to a local KVK extension officer.',
      details: 'Officer reviews crop photo & context, providing direct phone follow-up if needed.',
      icon: UserCheck,
      color: 'bg-[#c8553d] text-white',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Process Flow</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#111827]">
            How Digital Krishi Officer Works
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-body leading-relaxed">
            From field observation to expert solution in seconds — combining AI speed with human officer accountability.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.12 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif-display text-3xl font-bold text-gray-300">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d97706]">
                    {step.badge}
                  </span>

                  <h3 className="font-serif-display text-xl font-bold text-[#111827]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-body">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 text-xs font-semibold text-gray-600">
                  {step.details}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Knowledge Base Credibility Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-gray-200 shadow-md space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="font-serif-display text-2xl font-bold text-[#111827]">
              Backed by Verified Agricultural Intelligence
            </h3>
            <p className="text-sm text-gray-700">
              Unlike generic chatbot models, Digital Krishi Officer is grounded in verified scientific datasets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 space-y-1">
              <Database className="w-5 h-5 text-[#1b4332]" />
              <div className="text-sm font-bold text-gray-900">ICAR Agronomy Rules</div>
              <div className="text-xs text-gray-600">Trained on Indian Council of Agricultural Research guidelines.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-gray-200 space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#d97706]" />
              <div className="text-sm font-bold text-gray-900">IMD Weather Forecasts</div>
              <div className="text-xs text-gray-600">Hyperlocal district rain, temp & humidity micro-climate data.</div>
            </div>

            <div className="p-[#faf8f5] p-4 rounded-2xl border border-gray-200 space-y-1">
              <FileCheck2 className="w-5 h-5 text-[#2d6a4f]" />
              <div className="text-sm font-bold text-gray-900">KVK Extension Officers</div>
              <div className="text-xs text-gray-600">Direct human officer escalation for edge-case diagnostics.</div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1b4332] text-white font-bold text-sm hover:bg-[#2d6a4f] shadow-md"
            >
              <span>Test How It Works in Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
