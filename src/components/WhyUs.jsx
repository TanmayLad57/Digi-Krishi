import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, ShieldCheck, Languages, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WhyUs() {
  const trustPoints = [
    {
      icon: Zap,
      title: 'Instant & 24/7 Available',
      description: 'No need to wait for office hours or travel miles to extension centers. Get instant solutions right when pests attack.',
      color: 'text-[#d97706] dark:text-[#e9c46a]',
      bg: 'bg-[#d97706]/10 dark:bg-[#e9c46a]/20',
    },
    {
      icon: Target,
      title: 'Personalized to Your Crops & Soil',
      description: 'Advice isn’t generic — it adapts to your district weather, soil type, and exact crop growth stage.',
      color: 'text-[#2d6a4f] dark:text-[#74c69d]',
      bg: 'bg-[#2d6a4f]/10 dark:bg-[#74c69d]/20',
    },
    {
      icon: ShieldCheck,
      title: 'Backed by Real Agronomy Experts',
      description: 'Engineered using verified ICAR research datasets and supported by local KVK extension officers for 100% reliability.',
      color: 'text-[#c8553d] dark:text-[#f87171]',
      bg: 'bg-[#c8553d]/10 dark:bg-[#c8553d]/20',
    },
    {
      icon: Languages,
      title: 'Voice-First in Your Local Language',
      description: 'Designed for effortless accessibility — speak naturally in Hindi, Marathi, Punjabi, Telugu, and more soon.',
      color: 'text-[#40916c] dark:text-[#74c69d]',
      bg: 'bg-[#40916c]/10 dark:bg-[#40916c]/20',
    },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#f3eee7] dark:bg-[#14271f] transition-colors relative overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#2d6a4f]/10 dark:bg-[#74c69d]/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1c352b]">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d6a4f]/10 dark:bg-[#74c69d]/20 text-[#2d6a4f] dark:text-[#74c69d] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Why Farmers Trust Us</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332] dark:text-[#f3eee7]">
                Designed Specifically for Smart Indian Agriculture
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
                    className="p-5 rounded-2xl bg-white dark:bg-[#0c1813] border border-[#2d6a4f]/15 dark:border-[#40916c]/20 shadow-sm hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className={`w-10 h-10 rounded-xl ${point.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${point.color}`} />
                    </div>
                    <h3 className="font-serif-display text-lg font-bold text-[#1b4332] dark:text-[#f3eee7]">
                      {point.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-body">
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
