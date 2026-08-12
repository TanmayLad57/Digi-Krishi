import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Scan, CloudSun, Landmark, UserCheck, ArrowUpRight, Sparkles } from 'lucide-react';

export default function KeyCapabilities() {
  const capabilities = [
    {
      id: 'ask-questions',
      icon: MessageSquareText,
      title: 'Ask Agricultural Questions',
      description: 'Farmers can type or speak in Hindi, Marathi, Punjabi, or local dialects for instant expert guidance on pest management, fertilizer ratios, and crop health.',
      badge: 'Multilingual Voice & Text',
      color: 'from-[#2d6a4f] to-[#1b4332]',
      accentBg: 'bg-[#2d6a4f]/10 dark:bg-[#74c69d]/20',
      accentText: 'text-[#2d6a4f] dark:text-[#74c69d]',
      highlight: true,
    },
    {
      id: 'crop-diagnosis',
      icon: Scan,
      title: 'Crop Disease Diagnosis',
      description: 'Snap a picture of damaged leaves or stems; our AI computer vision pinpoints diseases instantly with clear treatment steps.',
      badge: 'Computer Vision AI',
      color: 'from-[#d97706] to-[#b45309]',
      accentBg: 'bg-[#d97706]/10 dark:bg-[#e9c46a]/20',
      accentText: 'text-[#d97706] dark:text-[#e9c46a]',
      highlight: true,
    },
    {
      id: 'weather-advisory',
      icon: CloudSun,
      title: 'Weather & Micro-climate Advisory',
      description: 'Hyperlocal district-level rainfall predictions and custom alerts on optimal spray timing to protect crops from sudden rain.',
      badge: 'Real-time Forecast',
      color: 'from-[#40916c] to-[#1b4332]',
      accentBg: 'bg-[#40916c]/10 dark:bg-[#40916c]/20',
      accentText: 'text-[#40916c] dark:text-[#74c69d]',
      highlight: false,
    },
    {
      id: 'gov-schemes',
      icon: Landmark,
      title: 'Government Schemes & Subsidies',
      description: 'Step-by-step assistance for PM-KISAN, PM Fasal Bima Yojana, and state-specific agricultural subsidy applications.',
      badge: 'Direct Scheme Access',
      color: 'from-[#c8553d] to-[#991b1b]',
      accentBg: 'bg-[#c8553d]/10 dark:bg-[#c8553d]/20',
      accentText: 'text-[#c8553d] dark:text-[#f87171]',
      highlight: false,
    },
    {
      id: 'officer-support',
      icon: UserCheck,
      title: 'Agriculture Officer Escalation',
      description: 'If a query is complex or needs field verification, it automatically routes to a real Krishi Vigyan Kendra (KVK) extension officer.',
      badge: 'Human Expert Backup',
      color: 'from-[#2d6a4f] to-[#047857]',
      accentBg: 'bg-[#2d6a4f]/10 dark:bg-[#74c69d]/20',
      accentText: 'text-[#2d6a4f] dark:text-[#74c69d]',
      highlight: false,
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
    <section id="features" className="py-20 lg:py-28 bg-[#faf8f5] dark:bg-[#0c1813] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/10 dark:bg-[#e9c46a]/15 text-[#d97706] dark:text-[#e9c46a] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332] dark:text-[#f3eee7]">
              Built to Solve Real Farming Challenges in India
            </h2>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-md font-body">
            Combining state-of-the-art AI with verified Indian agricultural research so every farmer gets trustworthy advice instantly.
          </p>
        </div>

        {/* Capabilities Asymmetric Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            // Feature 1 and 2 get full-width or larger emphasis span on desktop
            const isWide = idx === 0 || idx === 1;
            
            return (
              <motion.div
                key={cap.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isWide ? 'lg:col-span-1 shadow-md' : 'lg:col-span-1'
                } bg-white dark:bg-[#14271f] border border-[#2d6a4f]/15 dark:border-[#40916c]/20 hover:border-[#2d6a4f]/40 dark:hover:border-[#74c69d]/40 shadow-sm hover:shadow-xl`}
              >
                <div className="space-y-4">
                  {/* Top bar with Icon and Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${cap.accentBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`w-7 h-7 ${cap.accentText}`} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cap.accentBg} ${cap.accentText}`}>
                      {cap.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#f3eee7] pt-2">
                    {cap.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-body">
                    {cap.description}
                  </p>
                </div>

                {/* Footer link trigger */}
                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-[#1c352b] flex items-center justify-between text-xs font-semibold text-[#2d6a4f] dark:text-[#74c69d] group-hover:text-[#d97706] dark:group-hover:text-[#e9c46a] transition-colors">
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
