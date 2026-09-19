import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function MorphText({
  words = ['GROW', 'ADVISE', 'PROTECT', 'HARVEST'],
  interval = 1800,
  subtext = 'Digi Krishi — AI Agricultural Advisory',
  fontSize = 'clamp(2.5rem, 10vw, 7rem)',
  textColor = '#faf8f5',
  subtextColor = '#e9c46a',
  backgroundColor = '#1b4332',
  className = '',
  onComplete,
}) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    let textIndex = 0;
    let time = new Date();
    let morph = 0;
    const morphDuration = (interval / 1000) * 0.45;
    const cooldownDuration = (interval / 1000) * 0.55;
    let cooldown = cooldownDuration;
    let animationFrameId;
    let cycleCount = 0;

    const elts = {
      text1: text1Ref.current,
      text2: text2Ref.current,
    };

    if (elts.text1 && elts.text2 && words.length > 0) {
      elts.text1.textContent = words[textIndex % words.length];
      elts.text2.textContent = words[(textIndex + 1) % words.length];
    }

    function setMorph(fraction) {
      if (!elts.text1 || !elts.text2) return;
      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invFraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / invFraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(invFraction, 0.4) * 100}%`;
    }

    function doCooldown() {
      morph = 0;
      if (!elts.text1 || !elts.text2) return;
      elts.text2.style.filter = '';
      elts.text2.style.opacity = '100%';
      elts.text1.style.filter = '';
      elts.text1.style.opacity = '0%';
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphDuration;
      if (fraction > 1) {
        cooldown = cooldownDuration;
        fraction = 1;
      }
      setMorph(fraction);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
          if (elts.text1 && elts.text2) {
            elts.text1.textContent = words[textIndex % words.length];
            elts.text2.textContent = words[(textIndex + 1) % words.length];
          }
          if (textIndex >= words.length) {
            cycleCount++;
            if (cycleCount >= 1 && onComplete) {
              onComplete();
            }
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [words, interval, onComplete]);

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {/* SVG Gooey/Blur Filter for Morph Effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient background glow accents */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#2d6a4f]/30 blur-[120px] pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-[#e9c46a]/15 blur-[80px] pointer-events-none" />

      {/* Morphing Words Container */}
      <div
        className="relative flex items-center justify-center text-center font-serif-display font-black tracking-widest leading-none z-10"
        style={{
          filter: 'url(#threshold)',
          fontSize,
          color: textColor,
          minHeight: '1.2em',
          width: '100%',
        }}
      >
        <span
          ref={text1Ref}
          className="absolute inset-0 flex items-center justify-center"
        />
        <span
          ref={text2Ref}
          className="absolute inset-0 flex items-center justify-center"
        />
      </div>

      {/* Subtext */}
      {subtext && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 sm:mt-8 z-10 text-center px-4"
        >
          <p
            className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em]"
            style={{ color: subtextColor }}
          >
            {subtext}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default MorphText;
