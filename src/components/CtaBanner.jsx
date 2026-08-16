import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sprout, ArrowRight, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section className="py-16 lg:py-24 bg-[#faf8f5] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#132a22] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#40916c]/30 text-center"
        >
          {/* Subtle background wheat graphic lines */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-[#e9c46a]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-[#d97706]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e9c46a]/20 border border-[#e9c46a]/30 text-[#e9c46a] text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Digital Krishi Platform</span>
            </div>

            {/* Main CTA Heading */}
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#f3eee7]">
              {t('cta.title')}
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-200 font-body max-w-2xl mx-auto leading-relaxed">
              {t('cta.subtext')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.a
                href="/demo"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#e9c46a] hover:bg-[#f59e0b] text-[#1b4332] font-bold text-base shadow-xl transition-all"
              >
                <span>{t('cta.btnAsk')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>

              <a
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
              >
                <span>{t('cta.btnRegister')}</span>
              </a>
            </div>

            {/* Security Guarantee */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 font-medium border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e9c46a]" />
                100% Free & Open Access
              </span>
              <span className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-[#74c69d]" />
                ICAR Research Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#e9c46a]" />
                Voice & Multilingual AI
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
