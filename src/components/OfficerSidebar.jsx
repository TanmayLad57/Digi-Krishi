import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  ClipboardList,
  MapPin,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OfficerSidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      name: 'Overview',
      path: '/officer-dashboard',
      icon: LayoutDashboard,
      desc: 'Metrics & recent cases'
    },
    {
      name: 'Escalated Cases',
      path: '/officer-dashboard/cases',
      icon: ClipboardList,
      badge: 'Queue',
      desc: 'Filter & respond to cases'
    },
    {
      name: 'Back to Site',
      path: '/',
      icon: Sprout,
      desc: 'Landing page preview'
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#132a22] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link to="/officer-dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] text-[#e9c46a] flex items-center justify-center font-bold">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-serif-display text-lg font-bold text-[#f3eee7]">
            Krishi <span className="text-[#e9c46a]">Sathi</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#1c352b] text-gray-200"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="w-72 bg-[#132a22] text-gray-200 h-full p-6 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Officer Profile Badge */}
            <div className="p-4 rounded-2xl bg-[#1c352b] border border-[#2d6a4f]/40 space-y-1">
              <div className="flex items-center gap-2 text-[#e9c46a] text-xs font-bold uppercase">
                <UserCheck className="w-4 h-4" />
                <span>KVK Extension Officer</span>
              </div>
              <div className="font-serif-display text-lg font-bold text-white">{currentUser?.name || 'Dr. Sunita Sharma'}</div>
              <div className="text-xs text-gray-300">{currentUser?.designation || 'KVK Agronomy Scientist'}</div>
              <div className="text-[11px] text-[#74c69d] font-semibold flex items-center gap-1 pt-1">
                <MapPin className="w-3 h-3" />
                <span>{currentUser?.district || 'Nagpur'} District</span>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive ? 'bg-[#2d6a4f] text-white shadow-md' : 'text-gray-300 hover:bg-[#1c352b]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#e9c46a]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/60 text-red-300 border border-red-800/40 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#132a22] text-gray-200 fixed top-0 bottom-0 left-0 z-40 border-r border-[#2d6a4f]/30 shadow-xl">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2d6a4f]/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-[#e9c46a] shadow-md shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-display text-xl font-bold text-[#f3eee7] leading-none block">
              Krishi <span className="text-[#e9c46a]">Sathi</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#74c69d]">
              Work Tool Portal
            </span>
          </div>
        </div>

        {/* Officer Profile Badge */}
        <div className="p-5">
          <div className="p-4 rounded-2xl bg-[#1c352b] border border-[#2d6a4f]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#e9c46a] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Officer
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div>
              <div className="font-serif-display text-lg font-bold text-white leading-snug">
                {currentUser?.name || 'Dr. Sunita Sharma'}
              </div>
              <div className="text-xs text-gray-300">
                {currentUser?.designation || 'KVK Agronomy Scientist'}
              </div>
            </div>

            <div className="text-[11px] text-[#74c69d] font-semibold flex items-center gap-1.5 pt-1 border-t border-[#2d6a4f]/40">
              <MapPin className="w-3.5 h-3.5 text-[#e9c46a]" />
              <span>{currentUser?.district || 'Nagpur'} District ({currentUser?.talukasCovered?.join(', ') || 'Katol, Kalmeshwar'})</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1">
            Officer Work Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/officer-dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-[#2d6a4f] text-white shadow-md border border-[#40916c]/40'
                    : 'text-gray-300 hover:bg-[#1c352b] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e9c46a]' : 'text-gray-400 group-hover:text-[#e9c46a]'}`} />
                  <div>
                    <span className="block leading-tight">{item.name}</span>
                    <span className="text-[10px] font-normal text-gray-400 block">{item.desc}</span>
                  </div>
                </div>

                {item.badge ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d97706] text-white">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#e9c46a]' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Officer Footer */}
        <div className="p-4 border-t border-[#2d6a4f]/30 space-y-2">
          <div className="text-[11px] text-gray-400 px-2 font-medium">
            Emergency Helpline: <span className="text-white font-mono">1800-180-1551</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1c352b] hover:bg-red-950/80 text-gray-300 hover:text-red-200 border border-[#2d6a4f]/40 hover:border-red-800/40 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
}
