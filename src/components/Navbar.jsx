import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  LayoutDashboard,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ml', label: 'മലയാളം' }
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    setLangDropdownOpen(false);
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

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('hasSelectedLanguage', 'true');
    setLangDropdownOpen(false);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === (i18n.language || 'en').split('-')[0]) || LANGUAGES[0];

  const navStructure = [
    {
      name: t('navbar.home'),
      key: 'Home',
      path: '/',
      subLinks: [
        { title: t('navbar.heroOverview'), desc: t('navbar.heroOverviewDesc'), path: '/' },
        { title: t('navbar.platformStats'), desc: t('navbar.platformStatsDesc'), path: '/' },
        { title: t('navbar.capabilitiesGrid'), desc: t('navbar.capabilitiesGridDesc'), path: '/' },
      ]
    },
    {
      name: t('navbar.ai'),
      key: 'AI',
      path: '/demo',
      subLinks: [
        { title: t('navbar.textAiTitle'), desc: t('navbar.textAiDesc'), path: '/demo', icon: MessageSquareText },
        { title: t('navbar.voiceTitle'), desc: t('navbar.voiceDesc'), path: '/demo', icon: PlayCircle },
        { title: t('navbar.scanTitle'), desc: t('navbar.scanDesc'), path: '/demo', icon: Scan },
        { title: t('navbar.schemeTitle'), desc: t('navbar.schemeDesc'), path: '/demo', icon: Landmark },
      ]
    },
    {
      name: t('navbar.howItWorks'),
      key: 'HowItWorks',
      path: '/how-it-works',
      subLinks: [
        { title: t('navbar.step1Title'), desc: t('navbar.step1Desc'), path: '/how-it-works', icon: HelpCircle },
        { title: t('navbar.step2Title'), desc: t('navbar.step2Desc'), path: '/how-it-works', icon: Sparkles },
        { title: t('navbar.step3Title'), desc: t('navbar.step3Desc'), path: '/how-it-works', icon: ShieldCheck },
        { title: t('navbar.step4Title'), desc: t('navbar.step4Desc'), path: '/how-it-works', icon: UserCheck },
      ]
    },
    {
      name: t('navbar.whyUs'),
      key: 'WhyUs',
      path: '/why-us',
      subLinks: [
        { title: t('navbar.why1Title'), desc: t('navbar.why1Desc'), path: '/why-us' },
        { title: t('navbar.why2Title'), desc: t('navbar.why2Desc'), path: '/why-us' },
        { title: t('navbar.why3Title'), desc: t('navbar.why3Desc'), path: '/why-us' },
        { title: t('navbar.why4Title'), desc: t('navbar.why4Desc'), path: '/why-us' },
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
                {t('navbar.brandName')}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1b4332]">
                {t('navbar.brandTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
            {navStructure.map((item) => {
              const isActive = location.pathname === item.path;
              const isDropdownOpen = activeDropdown === item.key;

              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.key)}
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
                          {item.name} {t('navbar.sections')}
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

          {/* Desktop Right Action: Language Selector + Auth Badge */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs shadow-sm transition-all cursor-pointer"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-[#1b4332]" />
                <span>{currentLangObj.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-200 p-1.5 z-50 space-y-0.5"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                          currentLangObj.code === lang.code
                            ? 'bg-[#1b4332] text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              /* User Logged In Dropdown */
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
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
                      {currentUser.role === 'officer' ? t('navbar.officerRole') : t('navbar.kisanRole')}
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
                          {currentUser.role === 'officer' ? t('navbar.officerRole') : t('navbar.kisanRole')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={currentUser.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#1b4332]" />
                          <span>{t('navbar.myDashboard')}</span>
                        </Link>

                        <Link
                          to="/demo"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 text-xs font-bold text-gray-800"
                        >
                          <Sparkles className="w-4 h-4 text-[#d97706]" />
                          <span>{t('navbar.aiSimulator')}</span>
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-xs font-bold text-red-700 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>{t('navbar.signOut')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* User Logged Out Buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login?role=farmer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-800 hover:text-[#1b4332] hover:bg-gray-100 border border-gray-300"
                >
                  <User className="w-3.5 h-3.5 text-[#1b4332]" />
                  <span>{t('navbar.signIn')}</span>
                </Link>

                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#e9c46a] font-bold text-xs shadow-md"
                >
                  <span>{t('navbar.getStarted')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Language Selector + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Language Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800"
              >
                <Globe className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>{currentLangObj.label}</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-200 p-1 z-50 space-y-0.5"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                          currentLangObj.code === lang.code
                            ? 'bg-[#1b4332] text-white'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <Link
                to={currentUser.role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'}
                className="w-8 h-8 rounded-full bg-[#1b4332] text-[#e9c46a] font-bold text-xs flex items-center justify-center"
              >
                {currentUser.name.charAt(0)}
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1b4332] text-white">
                {t('navbar.signIn')}
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
              <div key={item.key} className="space-y-1">
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
                  <span>{t('navbar.myDashboard')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-xs font-bold text-red-600"
                >
                  {t('navbar.signOut')}
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1b4332] text-[#e9c46a] font-bold text-sm shadow-md"
                >
                  <span>{t('navbar.signIn')}</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
