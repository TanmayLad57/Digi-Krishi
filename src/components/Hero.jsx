import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Camera, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Sprout } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2d6a4f]/10 border border-[#2d6a4f]/20 text-[#1b4332] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-[#d97706]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#1b4332] font-bold leading-[1.12]">
              {t('hero.headlineMain')}{' '}
              <span className="relative inline-block text-[#d97706]">
                {t('hero.headlineHighlight')}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#e9c46a]/60 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-lg sm:text-xl text-gray-700 font-body max-w-2xl font-normal leading-relaxed">
              {t('hero.subtext')}
            </p>

            {/* Core Interaction Modalities Chips */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                <Mic className="w-3.5 h-3.5 text-[#d97706]" />
                <span>{t('hero.voiceChip')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                <Camera className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>{t('hero.cameraChip')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-gray-200 text-xs font-medium text-gray-700 shadow-sm">
                <MessageSquare className="w-3.5 h-3.5 text-[#c8553d]" />
                <span>{t('hero.chatChip')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <a
                href="#interactive-demo"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold text-base shadow-lg shadow-[#1b4332]/25 hover:translate-y-[-2px] transition-all"
              >
                <span>{t('hero.btnGetStarted')}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#f3eee7] text-[#1b4332] font-semibold text-base border border-[#2d6a4f]/20 shadow-sm hover:translate-y-[-1px] transition-all"
              >
                <span>{t('hero.btnLearnMore')}</span>
              </a>
            </div>

            {/* Trust metrics bar */}
            <div className="pt-6 border-t border-[#2d6a4f]/15 grid grid-cols-3 gap-4">
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1b4332]">{t('hero.statQueries')}</div>
                <div className="text-xs text-gray-600 font-medium">{t('hero.statQueriesLabel')}</div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2d6a4f]">{t('hero.statAccuracy')}</div>
                <div className="text-xs text-gray-600 font-medium">{t('hero.statAccuracyLabel')}</div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#d97706]">{t('hero.statFree')}</div>
                <div className="text-xs text-gray-600 font-medium">{t('hero.statFreeLabel')}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Floating AI Advisory Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#1b4332]/5">
                <img
                  src="/images/hero.png"
                  alt="Indian farmer holding smartphone in green field with AI technology overlay"
                  className="w-full h-[420px] sm:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#132a22]/80 via-transparent to-transparent" />
                
                {/* Bottom Card Overlay inside image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#2d6a4f]/20 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Sprout className="w-5 h-5 text-[#e9c46a]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">{t('hero.liveBadge')}</span>
                        <span className="text-[10px] text-gray-500">{t('hero.liveTime')}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {t('hero.liveQuery')}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#2d6a4f]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('hero.liveAction')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute -top-5 -left-4 sm:-left-6 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#2d6a4f]/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d97706]/15 flex items-center justify-center text-[#d97706]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{t('hero.trustTitle')}</div>
                  <div className="text-[10px] text-gray-600">{t('hero.trustSub')}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
