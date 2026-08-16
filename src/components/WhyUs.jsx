import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Zap, Target, ShieldCheck, Languages, Sparkles } from 'lucide-react';

export default function WhyUs() {
  const { t } = useTranslation();

  const trustPoints = [
    {
      icon: Zap,
      title: t('whyUs.c1Title'),
      description: t('whyUs.c1Desc'),
      color: 'text-[#d97706]',
      bg: 'bg-[#d97706]/10',
    },
    {
      icon: Target,
      title: t('whyUs.c2Title'),
      description: t('whyUs.c2Desc'),
      color: 'text-[#2d6a4f]',
      bg: 'bg-[#2d6a4f]/10',
    },
    {
      icon: ShieldCheck,
      title: t('whyUs.c3Title'),
      description: t('whyUs.c3Desc'),
      color: 'text-[#c8553d]',
      bg: 'bg-[#c8553d]/10',
    },
    {
      icon: Languages,
      title: t('whyUs.c4Title'),
      description: t('whyUs.c4Desc'),
      color: 'text-[#40916c]',
      bg: 'bg-[#40916c]/10',
    },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#f3eee7] transition-colors relative overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#2d6a4f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Real Agriculture Officer Photo & Trust Badge */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/images/officer.png"
                  alt="Agriculture extension officer collaborating with farmer in field"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b4332]/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#e9c46a]">Human + AI Synergy</span>
                  <h4 className="font-serif-display text-xl font-bold">Bridge to Real Extension Officers</h4>
                  <p className="text-xs text-gray-200 font-body">Combining machine intelligence with boots-on-the-ground farming expertise.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 4 Key Trust Pillars */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                <span>{t('whyUs.badge')}</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332]">
                {t('whyUs.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-5 rounded-2xl bg-white border border-[#2d6a4f]/15 shadow-sm hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className={`w-10 h-10 rounded-xl ${point.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${point.color}`} />
                    </div>
                    <h3 className="font-serif-display text-lg font-bold text-[#1b4332]">
                      {point.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-body">
                      {point.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
