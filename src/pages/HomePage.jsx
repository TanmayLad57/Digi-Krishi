import React from 'react';
import Hero from '../components/Hero';
import KeyCapabilities from '../components/KeyCapabilities';
import HowItWorks from '../components/HowItWorks';
import WhyUs from '../components/WhyUs';
import CtaBanner from '../components/CtaBanner';

export default function HomePage() {
  return (
    <div style={{ opacity: 1, visibility: 'visible' }} className="bg-[#faf8f5]">
      <Hero />
      <KeyCapabilities />
      <HowItWorks />
      <WhyUs />
      <CtaBanner />
    </div>
  );
}
