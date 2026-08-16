import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sprout, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginFarmer, loginOfficer } from '../lib/auth';

export default function LoginPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'officer' ? 'officer' : 'farmer';
  const redirectPath = searchParams.get('redirect') || '';

  const [role, setRole] = useState(initialRole);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setEmailOrPhone('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please enter both credentials.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (role === 'farmer') {
        await loginFarmer({ phone: emailOrPhone.trim(), password });
      } else {
        if (!emailOrPhone.includes('@')) {
          throw new Error('Please sign in with your official email address.');
        }
        await loginOfficer({ email: emailOrPhone.trim(), password });
      }

      if (redirectPath) {
        navigate(redirectPath);
      } else if (role === 'officer') {
        navigate('/officer-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              {t('navbar.brandName')}
            </span>
          </Link>
          <h1 className="font-serif-display text-xl font-bold text-gray-900 pt-1">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-xs text-gray-600 font-body">
            {t('auth.loginSub')}
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
            <span>{t('auth.farmerTab')}</span>
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
            <span>{t('auth.officerTab')}</span>
          </button>
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
              {role === 'farmer' ? t('auth.phoneLabel') : 'Official Email'}
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={role === 'farmer' ? '9876543210' : 'officer@demo.com'}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-900 uppercase">{t('auth.passwordLabel')}</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
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
                <span>{t('auth.btnLogin')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link to Register */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-600 font-medium">
          {t('auth.noAccount')}{' '}
          <Link
            to={`/register?role=${role}${redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="font-bold text-[#1b4332] hover:text-[#d97706] underline ml-1"
          >
            {t('auth.btnRegister')}
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
