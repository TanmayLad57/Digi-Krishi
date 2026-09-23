import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, UserCheck, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Droplets, Calendar, Layers } from 'lucide-react';
import { INDIA_STATES_DISTRICTS, POPULAR_CROPS } from '../data/locationData';
import { registerFarmer, registerOfficer } from '../lib/auth';

import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'officer' ? 'officer' : 'farmer';
  const redirectPath = searchParams.get('redirect') || '';

  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1); // 1: Personal, 2: Location, 3: Crop/Officer details

  // Farmer Form State - starts genuinely empty so farmer actively chooses
  const [farmerForm, setFarmerForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    state: 'Maharashtra',
    district: 'Nagpur',
    taluka: '',
    village: '',
    pinCode: '',
    primaryCrop: '',
    secondaryCrop: '',
    cropStage: '',
    irrigationType: '',
    crops: [],
    landArea: '',
  });

  // Officer Form State
  const [officerForm, setOfficerForm] = useState({
    name: '',
    email: '',
    phone: '',
    officerId: '',
    password: '',
    designation: '',
    department: '',
    state: 'Maharashtra',
    district: 'Nagpur',
    talukasCovered: '',
  });

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Selected State's districts list
  const availableDistricts = INDIA_STATES_DISTRICTS[farmerForm.state] || INDIA_STATES_DISTRICTS['Maharashtra'];
  const officerDistricts = INDIA_STATES_DISTRICTS[officerForm.state] || INDIA_STATES_DISTRICTS['Maharashtra'];

  // Toggle crop chip selection
  const handleCropToggle = (cropName) => {
    setFarmerForm((prev) => {
      const exists = prev.crops.includes(cropName);
      return {
        ...prev,
        crops: exists
          ? prev.crops.filter((c) => c !== cropName)
          : [...prev.crops, cropName],
      };
    });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setSubmitError('');
    setStep(1);
  };

  const validateStep = (currentStep) => {
    if (role === 'farmer') {
      if (currentStep === 1) {
        if (!farmerForm.name.trim()) return t('register.validationName');
        if (!farmerForm.phone.trim()) return t('register.validationPhone');
        if (!farmerForm.password) return t('register.validationPassword');
      } else if (currentStep === 2) {
        if (!farmerForm.state) return t('register.validationState');
        if (!farmerForm.district) return t('register.validationDistrict');
        // Pincode: if non-empty, must be exactly 6 digits
        const pinVal = (farmerForm.pinCode || '').trim();
        if (pinVal && !/^\d{6}$/.test(pinVal)) return t('register.validationPincode');
      } else if (currentStep === 3) {
        if (!farmerForm.primaryCrop) return t('register.validationPrimaryCrop');
        if (!farmerForm.cropStage) return t('register.validationCropStage');
        if (!farmerForm.irrigationType) return t('register.validationIrrigation');
      }
    } else {
      if (currentStep === 1) {
        if (!officerForm.name.trim()) return t('register.validationName');
        if (!officerForm.email.trim()) return t('register.validationOfficerEmail');
        if (!officerForm.officerId.trim()) return t('register.validationEmployeeId');
        if (!officerForm.password) return t('register.validationPassword');
      } else if (currentStep === 2) {
        if (!officerForm.state) return t('register.validationAssignedState');
        if (!officerForm.district) return t('register.validationAssignedDistrict');
      } else if (currentStep === 3) {
        if (!officerForm.designation) return t('register.validationDesignation');
        if (!officerForm.department.trim()) return t('register.validationDepartment');
      }
    }
    return '';
  };

  const handleNextStep = () => {
    setSubmitError('');
    const error = validateStep(step);
    if (error) {
      setSubmitError(error);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goToStep = (targetStep) => {
    setSubmitError('');
    if (targetStep > step) {
      for (let s = step; s < targetStep; s++) {
        const error = validateStep(s);
        if (error) {
          setSubmitError(error);
          return;
        }
      }
    }
    setStep(targetStep);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 3) {
        handleNextStep();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Ensure form is on the final step before submission
    if (step < 3) {
      handleNextStep();
      return;
    }

    const error = validateStep(3);
    if (error) {
      setSubmitError(error);
      return;
    }

    setSubmitting(true);
    try {
      if (role === 'farmer') {
        await registerFarmer(farmerForm);
        navigate(redirectPath || '/farmer-dashboard');
      } else {
        await registerOfficer(officerForm);
        navigate(redirectPath || '/officer-dashboard');
      }
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5] flex items-center justify-center min-h-[90vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-8 border-2 border-gray-200 shadow-xl space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center group">
            <img
              src="/images/logo.png"
              alt="Digi Krishi"
              className="h-16 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="font-serif-display text-xl font-bold text-gray-900">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-xs text-gray-600 font-body">
            {t('auth.registerSub')}
          </p>
        </div>

        {/* Dual Role Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => handleRoleChange('farmer')}
            className={`py-2.5 px-2 sm:px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
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
            className={`py-2.5 px-2 sm:px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              role === 'officer'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#e9c46a]" />
            <span>Ag-Officer</span>
          </button>
        </div>

        {/* Interactive Stepper Navigation Bar */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all ${
              step === 1
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step === 1 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>1</span>
            <span className="truncate">{t('register.stepPersonal')}</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all ${
              step === 2
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step === 2 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>2</span>
            <span className="truncate">{t('register.stepLocation')}</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all ${
              step === 3
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step === 3 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>3</span>
            <span className="truncate">{role === 'farmer' ? t('register.stepCrops') : t('register.stepDetails')}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {role === 'farmer' ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.farmerFullName')}</label>
                      <input
                        type="text"
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                        placeholder={t('register.farmerFullNamePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.farmerPhone')}</label>
                        <input
                          type="tel"
                          value={farmerForm.phone}
                          onChange={(e) => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                          placeholder={t('register.farmerPhonePlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.farmerEmail')}</label>
                        <input
                          type="email"
                          value={farmerForm.email}
                          onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                          placeholder={t('register.farmerEmailPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.farmerPassword')}</label>
                      <input
                        type="password"
                        value={farmerForm.password}
                        onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                        placeholder={t('register.farmerPasswordPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.officerFullName')}</label>
                      <input
                        type="text"
                        value={officerForm.name}
                        onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                        placeholder={t('register.officerFullNamePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.officerEmail')}</label>
                        <input
                          type="email"
                          value={officerForm.email}
                          onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                          placeholder={t('register.officerEmailPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.officerEmployeeId')}</label>
                        <input
                          type="text"
                          value={officerForm.officerId}
                          onChange={(e) => setOfficerForm({ ...officerForm, officerId: e.target.value })}
                          placeholder={t('register.officerEmployeeIdPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.officerPassword')}</label>
                      <input
                        type="password"
                        value={officerForm.password}
                        onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                        placeholder={t('register.officerPasswordPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 2: LOCATION DETAILS */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {role === 'farmer' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.stateLabel')}</label>
                        <select
                          value={farmerForm.state}
                          onChange={(e) =>
                            setFarmerForm({
                              ...farmerForm,
                              state: e.target.value,
                              district: INDIA_STATES_DISTRICTS[e.target.value]?.[0] || '',
                            })
                          }
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {Object.keys(INDIA_STATES_DISTRICTS).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.districtLabel')}</label>
                        <select
                          value={farmerForm.district}
                          onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {availableDistricts.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.talukaLabel')}</label>
                        <input
                          type="text"
                          value={farmerForm.taluka}
                          onChange={(e) => setFarmerForm({ ...farmerForm, taluka: e.target.value })}
                          placeholder={t('register.talukaPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.villageLabel')}</label>
                        <input
                          type="text"
                          value={farmerForm.village}
                          onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                          placeholder={t('register.villagePlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">
                        {t('auth.pinCodeLabel')}
                      </label>
                      <input
                        type="text"
                        value={farmerForm.pinCode}
                        onChange={(e) => setFarmerForm({ ...farmerForm, pinCode: e.target.value })}
                        placeholder={t('auth.pinCodePlaceholder')}
                        maxLength={6}
                        className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm ${
                          farmerForm.pinCode && !/^\d{6}$/.test(farmerForm.pinCode)
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-300 focus:border-[#1b4332]'
                        }`}
                      />
                      {farmerForm.pinCode && !/^\d{6}$/.test(farmerForm.pinCode) && (
                        <p className="text-xs font-semibold text-red-600 mt-1">{t('register.validationPincode')}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.assignedState')}</label>
                        <select
                          value={officerForm.state}
                          onChange={(e) => setOfficerForm({ ...officerForm, state: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {Object.keys(INDIA_STATES_DISTRICTS).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.assignedDistrict')}</label>
                        <select
                          value={officerForm.district}
                          onChange={(e) => setOfficerForm({ ...officerForm, district: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {officerDistricts.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.talukasCovered')}</label>
                      <input
                        type="text"
                        value={officerForm.talukasCovered}
                        onChange={(e) => setOfficerForm({ ...officerForm, talukasCovered: e.target.value })}
                        placeholder={t('register.talukasCoveredPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d97706] shrink-0" />
                      <span>{t('register.officerVerifyNote')}</span>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3: ROLE SPECIFIC DETAILS (CROP CONTEXT DROPDOWNS FOR FARMERS) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {role === 'farmer' ? (
                  <>
                    {/* Primary & Secondary Crop Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Sprout className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>{t('register.primaryCrop')}</span>
                        </label>
                        <select
                          value={farmerForm.primaryCrop}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFarmerForm((prev) => ({
                              ...prev,
                              primaryCrop: selected,
                              crops: selected ? Array.from(new Set([selected, ...prev.crops])) : prev.crops,
                            }));
                          }}
                          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white shadow-sm ${
                            farmerForm.primaryCrop ? 'text-gray-900' : 'text-gray-400 font-semibold'
                          }`}
                        >
                          <option value="" disabled>{t('register.selectPrimaryCrop')}</option>
                          {POPULAR_CROPS.map((crop) => (
                            <option key={crop} value={crop} className="text-gray-900 font-bold">
                              {crop}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#d97706]" />
                          <span>{t('register.secondaryCrop')}</span>
                        </label>
                        <select
                          value={farmerForm.secondaryCrop}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFarmerForm((prev) => ({
                              ...prev,
                              secondaryCrop: selected,
                              crops: selected && selected !== 'None' ? Array.from(new Set([...prev.crops, selected])) : prev.crops,
                            }));
                          }}
                          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white shadow-sm ${
                            farmerForm.secondaryCrop ? 'text-gray-900' : 'text-gray-400 font-semibold'
                          }`}
                        >
                          <option value="" disabled>{t('register.selectSecondaryCrop')}</option>
                          <option value="None" className="text-gray-900 font-bold">{t('register.noneSecondaryCrop')}</option>
                          {POPULAR_CROPS.map((crop) => (
                            <option key={crop} value={crop} className="text-gray-900 font-bold">
                              {crop}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Crop Growth Stage & Irrigation Type Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#1b4332]" />
                          <span>{t('register.cropStage')}</span>
                        </label>
                        <select
                          value={farmerForm.cropStage}
                          onChange={(e) => setFarmerForm({ ...farmerForm, cropStage: e.target.value })}
                          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white shadow-sm ${
                            farmerForm.cropStage ? 'text-gray-900' : 'text-gray-400 font-semibold'
                          }`}
                        >
                          <option value="" disabled>{t('register.selectCropStage')}</option>
                          <option value="Sowing / Germination Stage" className="text-gray-900 font-bold">Sowing / Germination Stage</option>
                          <option value="Vegetative Growth Stage" className="text-gray-900 font-bold">Vegetative Growth Stage</option>
                          <option value="Flowering & Pod/Fruit Formation" className="text-gray-900 font-bold">Flowering &amp; Pod Formation</option>
                          <option value="Pre-Harvest / Ripening Stage" className="text-gray-900 font-bold">Pre-Harvest / Ripening Stage</option>
                          <option value="Post-Harvest / Land Prep" className="text-gray-900 font-bold">Post-Harvest / Land Prep</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-blue-600" />
                          <span>{t('register.irrigationSource')}</span>
                        </label>
                        <select
                          value={farmerForm.irrigationType}
                          onChange={(e) => setFarmerForm({ ...farmerForm, irrigationType: e.target.value })}
                          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white shadow-sm ${
                            farmerForm.irrigationType ? 'text-gray-900' : 'text-gray-400 font-semibold'
                          }`}
                        >
                          <option value="" disabled>{t('register.selectIrrigationSource')}</option>
                          <option value="Drip Irrigation System" className="text-gray-900 font-bold">Drip Irrigation System</option>
                          <option value="Monsoon / Rainfed" className="text-gray-900 font-bold">Monsoon / Rainfed</option>
                          <option value="Canal / River Water" className="text-gray-900 font-bold">Canal / River Water</option>
                          <option value="Borewell / Tube Well" className="text-gray-900 font-bold">Borewell / Tube Well</option>
                          <option value="Sprinkler System" className="text-gray-900 font-bold">Sprinkler System</option>
                        </select>
                      </div>
                    </div>

                    {/* Total Landholding Field */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.landArea')}</label>
                      <input
                        type="number"
                        value={farmerForm.landArea}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landArea: e.target.value })}
                        placeholder={t('register.landAreaPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    {/* Quick Selection Tags */}
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase">
                        {t('register.additionalCrops')}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_CROPS.map((crop) => {
                          const isSelected = farmerForm.crops.includes(crop);
                          return (
                            <button
                              key={crop}
                              type="button"
                              onClick={() => handleCropToggle(crop)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                              }`}
                            >
                              {crop} {isSelected ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.designation')}</label>
                        <select
                          value={officerForm.designation}
                          onChange={(e) => setOfficerForm({ ...officerForm, designation: e.target.value })}
                          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white shadow-sm ${
                            officerForm.designation ? 'text-gray-900' : 'text-gray-400 font-semibold'
                          }`}
                        >
                          <option value="" disabled>{t('register.selectDesignation')}</option>
                          <option value="Agriculture Officer" className="text-gray-900 font-bold">Agriculture Officer</option>
                          <option value="Assistant Director of Agriculture" className="text-gray-900 font-bold">Assistant Director of Agriculture</option>
                          <option value="KVK Agronomy Scientist" className="text-gray-900 font-bold">KVK Agronomy Scientist</option>
                          <option value="District Extension Lead" className="text-gray-900 font-bold">District Extension Lead</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.department')}</label>
                        <input
                          type="text"
                          value={officerForm.department}
                          onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })}
                          placeholder={t('register.departmentPlaceholder')}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.assignedState')}</label>
                        <select
                          value={officerForm.state}
                          onChange={(e) => setOfficerForm({ ...officerForm, state: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {Object.keys(INDIA_STATES_DISTRICTS).map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.assignedDistrict')}</label>
                        <select
                          value={officerForm.district}
                          onChange={(e) => setOfficerForm({ ...officerForm, district: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {officerDistricts.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">{t('register.talukasCovered')}</label>
                      <input
                        type="text"
                        value={officerForm.talukasCovered}
                        onChange={(e) => setOfficerForm({ ...officerForm, talukasCovered: e.target.value })}
                        placeholder={t('register.talukasCoveredPlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d97706] shrink-0" />
                      <span>{t('register.officerVerifyNote')}</span>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              {submitError}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitError('');
                  setStep(step - 1);
                }}
                className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('register.back')}</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center gap-1 shadow-sm ml-auto"
              >
                <span>
                  {step === 1
                    ? t('register.nextStepLocation')
                    : role === 'farmer'
                    ? t('register.nextStepCrops')
                    : t('register.nextStepJurisdiction')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center gap-2 ml-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? t('register.creatingAccount') : t('register.completeRegistration')}</span>
                <CheckCircle2 className="w-4 h-4 text-[#e9c46a]" />
              </button>
            )}
          </div>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-600 font-medium">
          {t('register.alreadyRegistered')}{' '}
          <Link
            to={`/login?role=${role}${redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="font-bold text-[#1b4332] hover:text-[#d97706] underline ml-1"
          >
            {t('register.signIn')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
