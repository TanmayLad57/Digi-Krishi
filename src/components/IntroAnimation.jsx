import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MorphText } from './ui/morph-text';

export default function IntroAnimation({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef(null);

  const handleFinish = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  };

  useEffect(() => {
    // Total cycle: 4 words * 1800ms = 7200ms + small buffer before smooth auto-fade
    timerRef.current = setTimeout(() => {
      handleFinish();
    }, 7800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="intro-splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] w-screen h-screen flex flex-col items-center justify-center bg-[#1b4332] overflow-hidden select-none"
        >
          {/* Morphing Wordmark Component */}
          <div className="w-full h-full flex flex-col items-center justify-center">
            <MorphText
              words={['GROW', 'ADVISE', 'PROTECT', 'HARVEST']}
              interval={1800}
              subtext="Digi Krishi — AI Agricultural Advisory"
              fontSize="clamp(2.5rem, 10vw, 7rem)"
              textColor="#faf8f5"
              subtextColor="#e9c46a"
              backgroundColor="#1b4332"
              onComplete={handleFinish}
            />
          </div>

          {/* Subtle Skip button in bottom-right */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30"
          >
            <button
              type="button"
              onClick={handleFinish}
              className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider text-[#faf8f5]/80 hover:text-[#faf8f5] transition-all cursor-pointer shadow-lg"
              aria-label="Skip introduction animation"
            >
              <span>Skip</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#e9c46a] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
