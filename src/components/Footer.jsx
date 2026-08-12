import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Sparkles, Heart, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#132a22] text-gray-300 pt-16 pb-12 border-t border-[#2d6a4f]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-[#e9c46a] shadow-md">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-serif-display text-2xl font-bold text-[#f3eee7]">
                Digital Krishi <span className="text-[#e9c46a]">Officer</span>
              </span>
            </Link>

            <p className="text-sm text-gray-300 font-body leading-relaxed max-w-md">
              An AI-powered agricultural advisory platform designed for Indian farmers. Providing instant crop disease diagnosis, weather micro-climate guidance, government scheme assistance, and human extension officer escalation.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#74c69d] font-semibold bg-[#1c352b] px-3.5 py-2 rounded-xl w-fit border border-[#2d6a4f]/40">
              <Globe className="w-4 h-4 text-[#e9c46a]" />
              <span>Languages Supported: English • हिन्दी • मराठी • ਪੰਜਾਬੀ • తెలుగు</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-display text-base font-bold text-white tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-[#e9c46a] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-[#e9c46a] transition-colors">AI Demo</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#e9c46a] transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-[#e9c46a] transition-colors">Why Us</Link>
              </li>
            </ul>
          </div>

          {/* Data Sources & Attribution */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif-display text-base font-bold text-white tracking-wider">
              Agricultural Data Sources
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e9c46a]" />
                <span>ICAR (Indian Council of Agricultural Research) Database</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e9c46a]" />
                <span>IMD Hyperlocal Weather API Integration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e9c46a]" />
                <span>KVK Extension Officer Escalation Queue</span>
              </li>
            </ul>

            <div className="pt-2">
              <div className="inline-block p-3 rounded-2xl bg-[#1c352b] border border-[#2d6a4f]/50 text-xs text-[#e9c46a] font-semibold">
                Smart India Hackathon Prototype — Farmer Advisory Platform
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2d6a4f]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4 font-medium">
          <p>© {new Date().getFullYear()} Digital Krishi Officer. Built for Smart India Hackathon.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Indian Farmers</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
