import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const steps = [
    {
      number: t('howItWorks.s1Number'),
      title: t('howItWorks.s1Title'),
      badge: 'Multi-Modal Input',
      description: t('howItWorks.s1Desc'),
      details: 'Supports English, Hindi, Marathi, and Malayalam voice & text.',
      icon: HelpCircle,
      color: 'bg-[#1b4332] text-white',
    },
    {
      number: t('howItWorks.s2Number'),
      title: t('howItWorks.s2Title'),
      badge: 'Agronomy AI Core',
      description: t('howItWorks.s2Desc'),
      details: 'Evaluates micro-climate temperature, humidity, and district-level soil health cards.',
      icon: Cpu,
      color: 'bg-[#d97706] text-white',
    },
    {
      number: t('howItWorks.s3Number'),
      title: t('howItWorks.s3Title'),
      badge: '24/7 Response',
      description: t('howItWorks.s3Desc'),
      details: 'Clear organic solutions (Neem oil) alongside recommended scientific chemical dosages.',
      icon: CheckCircle2,
      color: 'bg-[#2d6a4f] text-white',
    },
    {
      number: t('howItWorks.s4Number'),
      title: t('howItWorks.s4Title'),
      badge: 'Real Expert Backup',
      description: t('howItWorks.s4Desc'),
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
            <span>{t('howItWorks.badge')}</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#111827]">
            {t('howItWorks.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-700 font-body leading-relaxed">
            {t('howItWorks.subtext')}
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
              Unlike generic chatbot models, Krishi Sathi is grounded in verified scientific datasets.
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
              <span>{t('navbar.getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
