import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Lock, UserCheck, ArrowRight, KeyRound, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'officer' ? 'officer' : 'farmer';
  const redirectPath = searchParams.get('redirect') || '';

  const [role, setRole] = useState(initialRole);
  const [emailOrPhone, setEmailOrPhone] = useState(role === 'farmer' ? 'farmer@demo.com' : 'officer@demo.com');
  const [password, setPassword] = useState(role === 'farmer' ? 'farmer123' : 'officer123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Role toggle switch handler
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    if (newRole === 'farmer') {
      setEmailOrPhone('farmer@demo.com');
      setPassword('farmer123');
    } else {
      setEmailOrPhone('officer@demo.com');
      setPassword('officer123');
    }
  };

  // Autofill demo login button
  const handleAutofill = () => {
    setErrorMsg('');
    if (role === 'farmer') {
      setEmailOrPhone('farmer@demo.com');
      setPassword('farmer123');
    } else {
      setEmailOrPhone('officer@demo.com');
      setPassword('officer123');
    }
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please enter both identifier and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = login(emailOrPhone, password, role);
      setIsSubmitting(false);

      if (res.success) {
        if (redirectPath) {
          navigate(redirectPath);
        } else if (res.user.role === 'officer') {
          navigate('/officer-dashboard');
        } else {
          navigate('/farmer-dashboard');
        }
      } else {
        setErrorMsg('Invalid login credentials. Please try demo accounts.');
      }
    }, 400);
  };

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5] flex items-center justify-center min-h-[85vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl space-y-6"
      >
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#e9c46a] flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-serif-display text-2xl font-bold text-[#111827]">
              Digital Krishi <span className="text-[#d97706]">Officer</span>
            </span>
          </Link>
          <h1 className="font-serif-display text-xl font-bold text-gray-900 pt-1">
            Welcome Back — Sign In
          </h1>
          <p className="text-xs text-gray-600 font-body">
            Access personalized AI advice, crop diagnostics, and subsidy tracking.
          </p>
        </div>

        {/* Dual Role Toggle Switch */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => handleRoleChange('farmer')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              role === 'farmer'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-[#e9c46a]" />
            <span>Kisan / Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('officer')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              role === 'officer'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#e9c46a]" />
            <span>Ag-Officer</span>
          </button>
        </div>

        {/* Demo Credentials Alert Box */}
        <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              {role === 'farmer' ? 'Farmer Demo Credentials' : 'Officer Demo Credentials'}
            </span>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#1b4332] text-white hover:bg-[#2d6a4f] transition-all shadow-sm flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3 text-[#e9c46a]" />
              <span>Autofill</span>
            </button>
          </div>

          <div className="text-xs font-mono text-amber-950 font-bold space-y-0.5">
            {role === 'farmer' ? (
              <>
                <div>Email / Phone: <span className="text-[#1b4332]">farmer@demo.com</span> (or 9876543210)</div>
                <div>Password: <span className="text-[#1b4332]">farmer123</span></div>
              </>
            ) : (
              <>
                <div>Official Email / ID: <span className="text-[#1b4332]">officer@demo.com</span> (or OFF-1092)</div>
                <div>Password: <span className="text-[#1b4332]">officer123</span></div>
              </>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-900 uppercase">
              {role === 'farmer' ? 'Mobile Number or Email' : 'Official Email or Employee ID'}
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={role === 'farmer' ? 'e.g. 9876543210 or farmer@demo.com' : 'e.g. officer@demo.com'}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-900 uppercase">Password</label>
              <span className="text-[11px] text-gray-500 font-medium">Demo: {role === 'farmer' ? 'farmer123' : 'officer123'}</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In as {role === 'farmer' ? 'Farmer' : 'Officer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-600 font-medium">
          New to Digital Krishi Officer?{' '}
          <Link
            to={`/register?role=${role}${redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="font-bold text-[#1b4332] hover:text-[#d97706] underline ml-1"
          >
            Create a {role === 'farmer' ? 'Farmer' : 'Officer'} Account
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
