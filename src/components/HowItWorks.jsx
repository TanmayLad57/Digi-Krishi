import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Cpu, CheckCircle2, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Farmer Asks a Question',
      description: 'Speak in your local language, type a query, or snap a photo of infected leaves or soil using your smartphone or WhatsApp.',
      icon: HelpCircle,
      badge: 'Multi-Modal Input',
      color: 'bg-[#2d6a4f]',
    },
    {
      number: '02',
      title: 'AI & Knowledge Base Analysis',
      description: 'Our AI engine cross-references your question against verified ICAR research, regional weather forecasts, and historical crop data.',
      icon: Cpu,
      badge: 'Agronomy AI Core',
      color: 'bg-[#d97706]',
    },
    {
      number: '03',
      title: 'Instant Actionable Advice',
      description: 'Receive step-by-step remedies, precise spray dosage, organic alternatives, and spray weather timing in simple language or voice.',
      icon: CheckCircle2,
      badge: '24/7 Response',
      color: 'bg-[#40916c]',
    },
    {
      number: '04',
      title: 'Human Officer Escalation',
      description: 'If the diagnosis has edge-case complexity, it is automatically routed to a local Krishi Vigyan Kendra (KVK) extension officer for verification.',
      icon: UserCheck,
      badge: 'Real Expert Safety Net',
      color: 'bg-[#c8553d]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#faf8f5] dark:bg-[#0c1813] transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2d6a4f]/10 dark:bg-[#74c69d]/20 text-[#2d6a4f] dark:text-[#74c69d] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1b4332] dark:text-[#f3eee7]">
            How Digital Krishi Officer Works
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 font-body">
            From field observation to expert solution in seconds — with human officer escalation for 100% peace of mind.
          </p>
        </div>

        {/* 4-Step Timeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Decorative Connecting Horizontal Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#2d6a4f]/20 dark:bg-[#40916c]/30 -z-0 -translate-y-6" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, margin: '-50px' }}
                className="relative z-10 bg-white dark:bg-[#14271f] p-6 rounded-3xl border border-[#2d6a4f]/15 dark:border-[#40916c]/20 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Header Badge & Number */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif-display text-3xl font-bold text-gray-300 dark:text-gray-700">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d97706] dark:text-[#e9c46a]">
                    {step.badge}
                  </span>

                  {/* Title & Description */}
                  <h3 className="font-serif-display text-xl font-bold text-[#1b4332] dark:text-[#f3eee7]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-body">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector hint for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden pt-4 flex justify-center text-[#2d6a4f] dark:text-[#74c69d]">
                    <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
