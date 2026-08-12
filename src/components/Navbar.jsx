import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Sparkles,
  ChevronDown,
  MessageSquareText,
  Scan,
  Landmark,
  UserCheck,
  Menu,
  X,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  PlayCircle,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns & mobile menu when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleMouseEnter = (name) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navStructure = [
    {
      name: 'Home',
      path: '/',
      subLinks: [
        { title: 'Hero & Overview', desc: 'Main platform intro', path: '/' },
        { title: 'Platform Stats', desc: '50k+ queries solved', path: '/' },
        { title: 'Capabilities Grid', desc: 'Explore all 5 features', path: '/' },
      ]
    },
    {
      name: 'AI',
      path: '/demo',
      subLinks: [
        { title: 'Ask AI (Text Input)', desc: 'Type custom crop question', path: '/demo', icon: MessageSquareText },
        { title: 'Voice Query (Hindi)', desc: 'Audio input & response', path: '/demo', icon: PlayCircle },
        { title: 'Crop Disease Scanner', desc: 'Photo diagnostic preview', path: '/demo', icon: Scan },
        { title: 'Subsidy Status Checker', desc: 'PM-KISAN verification', path: '/demo', icon: Landmark },
      ]
    },
    {
      name: 'How It Works',
      path: '/how-it-works',
      subLinks: [
        { title: '01. Ask Question', desc: 'Photo, voice, or text', path: '/how-it-works', icon: HelpCircle },
        { title: '02. AI Analysis', desc: 'ICAR research database', path: '/how-it-works', icon: Sparkles },
        { title: '03. Actionable Advice', desc: 'Dosage & spray timing', path: '/how-it-works', icon: ShieldCheck },
        { title: '04. Expert Escalation', desc: 'KVK officer review', path: '/how-it-works', icon: UserCheck },
      ]
    },
    {
      name: 'Why Us',
      path: '/why-us',
      subLinks: [
        { title: 'Instant 24/7 Advice', desc: 'No office queues', path: '/why-us' },
        { title: 'Personalized to Soil', desc: 'District-specific data', path: '/why-us' },
        { title: 'Backed by Real Experts', desc: 'ICAR agronomy dataset', path: '/why-us' },
        { title: 'Native Language', desc: 'Voice-first in Hindi/Marathi', path: '/why-us' },
      ]
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-200'
          : 'bg-[#faf8f5]/80 py-4 border-b border-gray-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] flex items-center justify-center text-white shadow-md group-hover:bg-[#2d6a4f] transition-colors">
              <Sprout className="w-5 h-5 text-[#e9c46a]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#111827] leading-none">
                Digital Krishi <span className="text-[#d97706]">Officer</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1b4332]">
                AI Agricultural Advisory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            {navStructure.map((item) => {
              const isActive = location.pathname === item.path;
              const isDropdownOpen = activeDropdown === item.name;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavLink
                    to={item.path}
                    className={`inline-flex items-center gap-1 px-3.5 py-1.5 text-sm font-semibold rounded-full transition-all ${
                      isActive
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'text-gray-700 hover:text-[#1b4332] hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-[#d97706]' : 'text-gray-400'
                      }`}
                    />
                  </NavLink>

                  {/* Dropdown Menu Popup */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50"
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1 border-b border-gray-100 mb-1">
                          {item.name} Sections
                        </div>
                        {item.subLinks.map((sub, idx) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={idx}
                              to={sub.path}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#faf8f5] transition-colors group"
                            >
                              {SubIcon ? (
                                <div className="w-8 h-8 rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center shrink-0 group-hover:bg-[#1b4332] group-hover:text-white transition-colors">
                                  <SubIcon className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-[#d97706] mt-2 shrink-0" />
                              )}
                              <div>
                                <div className="text-xs font-bold text-gray-900 group-hover:text-[#1b4332]">
                                  {sub.title}
                                </div>
                                <div className="text-[11px] text-gray-600">
                                  {sub.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Action: Auth User Badge or Sign In Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              /* User Logged In Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-gray-300 hover:border-[#1b4332] shadow-sm transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1b4332] text-[#e9c46a] font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold text-gray-900 truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-[#d97706]">
                      {currentUser.role === 'officer' ? 'Ag-Officer' : 'Kisan'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50 space-y-2"
                    >
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="text-xs font-bold text-gray-900">{currentUser.name}</div>
                        <div className="text-[11px] text-gray-500">{currentUser.email || currentUser.phone}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {currentUser.role === 'officer' ? 'Extension Officer' : 'Kisan Farmer'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={currentUser.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#1b4332]" />
                          <span>My Dashboard</span>
                        </Link>

                        <Link
                          to="/demo"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-800"
                        >
                          <Sparkles className="w-4 h-4 text-[#d97706]" />
                          <span>AI Advisory Simulator</span>
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-xs font-bold text-red-700 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* User Logged Out Button */
              <div className="flex items-center gap-2">
                <Link
                  to="/login?role=farmer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-800 hover:text-[#1b4332] hover:bg-gray-100 border border-gray-300"
                >
                  <User className="w-3.5 h-3.5 text-[#1b4332]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#e9c46a] font-bold text-xs shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link
                to={currentUser.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'}
                className="w-8 h-8 rounded-full bg-[#1b4332] text-[#e9c46a] font-bold text-xs flex items-center justify-center"
              >
                {currentUser.name.charAt(0)}
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1b4332] text-white">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-gray-300 text-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-xl"
          >
            {navStructure.map((item) => (
              <div key={item.name} className="space-y-1">
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-xl font-bold text-sm ${
                    location.pathname === item.path
                      ? 'bg-[#1b4332] text-white'
                      : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}

            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  to={currentUser.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1b4332] text-white font-bold text-sm"
                >
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-xs font-bold text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1b4332] text-[#e9c46a] font-bold text-sm shadow-md"
                >
                  <span>Sign In / Create Account</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
