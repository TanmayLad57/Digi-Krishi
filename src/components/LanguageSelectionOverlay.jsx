import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', nativeName: 'English', scriptFont: 'font-sans' },
  { code: 'hi', nativeName: 'हिंदी', scriptFont: 'font-sans' },
  { code: 'mr', nativeName: 'मराठी', scriptFont: 'font-sans' },
  { code: 'ml', nativeName: 'മലയാളം', scriptFont: 'font-sans' }
];

export default function LanguageSelectionOverlay() {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const hasSelected = localStorage.getItem('hasSelectedLanguage');
    if (!hasSelected) {
      setIsVisible(true);
    }
  }, []);

  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    localStorage.setItem('hasSelectedLanguage', 'true');
    localStorage.setItem('selectedLanguage', code);
    localStorage.setItem('i18nextLng', code);

    setTimeout(() => {
      setIsVisible(false);
    }, 250);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-[#faf8f5] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#1b4332]/20 text-center space-y-6 sm:space-y-8 relative overflow-hidden"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#e9c46a]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1b4332] text-[#e9c46a] flex items-center justify-center mx-auto shadow-lg shadow-[#1b4332]/25 relative z-10">
              <Sprout className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            {/* Multilingual Heading */}
            <div className="space-y-3 relative z-10 max-w-xl mx-auto">
              <h2 className="font-serif-display text-lg sm:text-2xl font-bold text-[#111827] leading-snug">
                Choose Your Language / अपनी भाषा चुनें / तुमची भाषा निवडा / നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Welcome to Krishi Sathi. Select your preferred language to continue.
              </p>
            </div>

            {/* 4 Large Tappable Native Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`py-6 px-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                      isSelected
                        ? 'border-[#1b4332] bg-[#1b4332] text-white shadow-xl scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-[#1b4332] hover:bg-[#1b4332]/5 text-gray-900 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#e9c46a] text-[#1b4332] flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 group-hover:bg-[#1b4332]/10 text-gray-400 group-hover:text-[#1b4332] flex items-center justify-center">
                          <Sprout className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <span className={`text-xl sm:text-2xl font-bold tracking-wide ${lang.scriptFont}`}>
                      {lang.nativeName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="text-[11px] sm:text-xs text-gray-500 font-medium relative z-10 pt-2 border-t border-gray-200">
              💡 You can change your language anytime from the top navigation bar.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
