import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HelpCircle, Cpu, CheckCircle2, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: t('howItWorks.s1Number'),
      title: t('howItWorks.s1Title'),
      description: t('howItWorks.s1Desc'),
      icon: HelpCircle,
      badge: 'Step 01',
      color: 'bg-[#2d6a4f]',
    },
    {
      number: t('howItWorks.s2Number'),
      title: t('howItWorks.s2Title'),
      description: t('howItWorks.s2Desc'),
      icon: Cpu,
      badge: 'Step 02',
      color: 'bg-[#d97706]',
    },
    {
      number: t('howItWorks.s3Number'),
      title: t('howItWorks.s3Title'),
      description: t('howItWorks.s3Desc'),
      icon: CheckCircle2,
      badge: 'Step 03',
      color: 'bg-[#40916c]',
    },
    {
      number: t('howItWorks.s4Number'),
      title: t('howItWorks.s4Title'),
      description: t('howItWorks.s4Desc'),
      icon: UserCheck,
      badge: 'Step 04',
      color: 'bg-[#c8553d]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#faf8f5] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>{t('howItWorks.badge')}</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332]">
            {t('howItWorks.title')}
          </h2>
          <p className="text-base text-gray-700 font-body">
            {t('howItWorks.subtext')}
          </p>
        </div>

        {/* 4-Step Timeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Decorative Connecting Horizontal Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#2d6a4f]/20 -z-0 -translate-y-6" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: '-50px' }}
                className="relative z-10 bg-white p-6 rounded-3xl border border-[#2d6a4f]/15 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Header Badge & Number */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif-display text-3xl font-bold text-gray-300">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d97706]">
                    {step.badge}
                  </span>

                  {/* Title & Description */}
                  <h3 className="font-serif-display text-xl font-bold text-[#1b4332]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector hint for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden pt-4 flex justify-center text-[#2d6a4f]">
                    <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
