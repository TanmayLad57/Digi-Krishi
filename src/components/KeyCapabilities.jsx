import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquareText, Scan, CloudSun, Landmark, UserCheck, ArrowUpRight, Sparkles } from 'lucide-react';

export default function KeyCapabilities() {
  const { t } = useTranslation();

  const capabilities = [
    {
      id: 'ask-questions',
      icon: MessageSquareText,
      title: t('keyCapabilities.f1Title'),
      description: t('keyCapabilities.f1Desc'),
      badge: 'Multilingual Voice & Text',
      accentBg: 'bg-[#2d6a4f]/10',
      accentText: 'text-[#2d6a4f]',
    },
    {
      id: 'crop-diagnosis',
      icon: Scan,
      title: t('keyCapabilities.f2Title'),
      description: t('keyCapabilities.f2Desc'),
      badge: 'Computer Vision AI',
      accentBg: 'bg-[#d97706]/10',
      accentText: 'text-[#d97706]',
    },
    {
      id: 'weather-advisory',
      icon: CloudSun,
      title: t('keyCapabilities.f3Title'),
      description: t('keyCapabilities.f3Desc'),
      badge: 'Scientific Dataset',
      accentBg: 'bg-[#40916c]/10',
      accentText: 'text-[#40916c]',
    },
    {
      id: 'officer-support',
      icon: UserCheck,
      title: t('keyCapabilities.f4Title'),
      description: t('keyCapabilities.f4Desc'),
      badge: 'Expert Backup',
      accentBg: 'bg-[#2d6a4f]/10',
      accentText: 'text-[#2d6a4f]',
    },
    {
      id: 'gov-schemes',
      icon: Landmark,
      title: t('keyCapabilities.f5Title'),
      description: t('keyCapabilities.f5Desc'),
      badge: 'Scheme Helper',
      accentBg: 'bg-[#c8553d]/10',
      accentText: 'text-[#c8553d]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-20 lg:py-28 bg-[#faf8f5] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('keyCapabilities.badge')}</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332]">
              {t('keyCapabilities.title')}
            </h2>
          </div>
          <p className="text-base text-gray-600 max-w-md font-body">
            {t('keyCapabilities.subtext')}
          </p>
        </div>

        {/* Capabilities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 bg-white border border-[#2d6a4f]/15 hover:border-[#2d6a4f]/40 shadow-sm hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${cap.accentBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`w-7 h-7 ${cap.accentText}`} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cap.accentBg} ${cap.accentText}`}>
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1b4332] pt-2">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed font-body">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#2d6a4f] group-hover:text-[#d97706] transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
