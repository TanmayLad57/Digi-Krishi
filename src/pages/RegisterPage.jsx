import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, UserCheck, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Droplets, Calendar, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

  // Farmer Form State
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
    primaryCrop: 'Paddy (Rice)',
    secondaryCrop: 'Cotton',
    cropStage: 'Vegetative Growth Stage',
    irrigationType: 'Drip Irrigation System',
    crops: ['Paddy (Rice)', 'Cotton'],
    landArea: '4',
  });

  // Officer Form State
  const [officerForm, setOfficerForm] = useState({
    name: '',
    email: '',
    phone: '',
    officerId: '',
    password: '',
    designation: 'KVK Agronomy Scientist',
    department: 'Krishi Vigyan Kendra, Nagpur',
    state: 'Maharashtra',
    district: 'Nagpur',
    talukasCovered: 'Katol, Kalmeshwar',
  });

  const { register } = useAuth();
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
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
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
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-xl space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#e9c46a] flex items-center justify-center shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-serif-display text-2xl font-bold text-[#111827]">
              {t('navbar.brandName')}
            </span>
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
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              role === 'farmer'
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-[#e9c46a]" />
            <span>Kisan / Farmer Account</span>
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
            <span>Ag-Officer Account</span>
          </button>
        </div>

        {/* Interactive Stepper Navigation Bar */}
        <div className="grid grid-cols-3 gap-2 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-xs transition-all ${
              step === 1
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>1</span>
            <span className="truncate">Personal Info</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-xs transition-all ${
              step === 2
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>2</span>
            <span className="truncate">Location</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-xs transition-all ${
              step === 3
                ? 'bg-[#1b4332] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-800'}`}>3</span>
            <span className="truncate">{role === 'farmer' ? 'Crop Context' : 'Jurisdiction'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      <label className="block text-xs font-bold text-gray-900 uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Phone Number (Primary ID) *</label>
                        <input
                          type="tel"
                          value={farmerForm.phone}
                          onChange={(e) => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Email (Optional)</label>
                        <input
                          type="email"
                          value={farmerForm.email}
                          onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                          placeholder="farmer@example.com"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Set Password *</label>
                      <input
                        type="password"
                        value={farmerForm.password}
                        onChange={(e) => setFarmerForm({ ...farmerForm, password: e.target.value })}
                        placeholder="Create password"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Officer Full Name *</label>
                      <input
                        type="text"
                        value={officerForm.name}
                        onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                        placeholder="e.g. Dr. Sunita Sharma"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Official Email (Primary ID) *</label>
                        <input
                          type="email"
                          value={officerForm.email}
                          onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                          placeholder="officer@kvk.gov.in"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Employee / Officer ID *</label>
                        <input
                          type="text"
                          value={officerForm.officerId}
                          onChange={(e) => setOfficerForm({ ...officerForm, officerId: e.target.value })}
                          placeholder="e.g. OFF-1092"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Set Password *</label>
                      <input
                        type="password"
                        value={officerForm.password}
                        onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })}
                        placeholder="Create password"
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
                        <label className="block text-xs font-bold text-gray-900 uppercase">State *</label>
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
                        <label className="block text-xs font-bold text-gray-900 uppercase">District *</label>
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
                        <label className="block text-xs font-bold text-gray-900 uppercase">Taluka / Tehsil</label>
                        <input
                          type="text"
                          value={farmerForm.taluka}
                          onChange={(e) => setFarmerForm({ ...farmerForm, taluka: e.target.value })}
                          placeholder="e.g. Katol"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Village / Area</label>
                        <input
                          type="text"
                          value={farmerForm.village}
                          onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                          placeholder="e.g. Pardi"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Designation *</label>
                      <select
                        value={officerForm.designation}
                        onChange={(e) => setOfficerForm({ ...officerForm, designation: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                      >
                        <option value="Agriculture Officer">Agriculture Officer</option>
                        <option value="Assistant Director of Agriculture">Assistant Director of Agriculture</option>
                        <option value="KVK Agronomy Scientist">KVK Agronomy Scientist</option>
                        <option value="District Extension Lead">District Extension Lead</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Department / KVK Name *</label>
                      <input
                        type="text"
                        value={officerForm.department}
                        onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })}
                        placeholder="e.g. Krishi Vigyan Kendra, Nagpur"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
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
                          <span>Primary Crop *</span>
                        </label>
                        <select
                          value={farmerForm.primaryCrop}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFarmerForm((prev) => ({
                              ...prev,
                              primaryCrop: selected,
                              crops: Array.from(new Set([selected, ...prev.crops])),
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          {POPULAR_CROPS.map((crop) => (
                            <option key={crop} value={crop}>
                              {crop}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#d97706]" />
                          <span>Secondary / Intercrop</span>
                        </label>
                        <select
                          value={farmerForm.secondaryCrop}
                          onChange={(e) => {
                            const selected = e.target.value;
                            setFarmerForm((prev) => ({
                              ...prev,
                              secondaryCrop: selected,
                              crops: selected !== 'None' ? Array.from(new Set([...prev.crops, selected])) : prev.crops,
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          <option value="None">None (Single Crop)</option>
                          {POPULAR_CROPS.map((crop) => (
                            <option key={crop} value={crop}>
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
                          <span>Crop Stage *</span>
                        </label>
                        <select
                          value={farmerForm.cropStage}
                          onChange={(e) => setFarmerForm({ ...farmerForm, cropStage: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          <option value="Sowing / Germination Stage">Sowing / Germination Stage</option>
                          <option value="Vegetative Growth Stage">Vegetative Growth Stage</option>
                          <option value="Flowering & Pod/Fruit Formation">Flowering & Pod Formation</option>
                          <option value="Pre-Harvest / Ripening Stage">Pre-Harvest / Ripening Stage</option>
                          <option value="Post-Harvest / Land Prep">Post-Harvest / Land Prep</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-blue-600" />
                          <span>Irrigation Source *</span>
                        </label>
                        <select
                          value={farmerForm.irrigationType}
                          onChange={(e) => setFarmerForm({ ...farmerForm, irrigationType: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold text-gray-900 bg-white shadow-sm"
                        >
                          <option value="Drip Irrigation System">Drip Irrigation System</option>
                          <option value="Monsoon / Rainfed">Monsoon / Rainfed</option>
                          <option value="Canal / River Water">Canal / River Water</option>
                          <option value="Borewell / Tube Well">Borewell / Tube Well</option>
                          <option value="Sprinkler System">Sprinkler System</option>
                        </select>
                      </div>
                    </div>

                    {/* Total Landholding Field */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Land Area (Acres):</label>
                      <input
                        type="number"
                        value={farmerForm.landArea}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landArea: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    {/* Quick Selection Tags */}
                    <div className="space-y-2 pt-1 border-t border-gray-100">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase">
                        Select Any Additional Crops Grown:
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
                        <label className="block text-xs font-bold text-gray-900 uppercase">Assigned State *</label>
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
                        <label className="block text-xs font-bold text-gray-900 uppercase">Assigned District *</label>
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
                      <label className="block text-xs font-bold text-gray-900 uppercase">Talukas Covered (Comma Separated):</label>
                      <input
                        type="text"
                        value={officerForm.talukasCovered}
                        onChange={(e) => setOfficerForm({ ...officerForm, talukasCovered: e.target.value })}
                        placeholder="e.g. Katol, Kalmeshwar, Narkhed"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 shadow-sm"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#d97706] shrink-0" />
                      <span>Note: Officer accounts undergo verification (simulated for demo).</span>
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
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center gap-1 shadow-sm ml-auto"
              >
                <span>Next Step ({step === 1 ? 'Location' : role === 'farmer' ? 'Crop Context' : 'Jurisdiction'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center gap-2 ml-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
                <CheckCircle2 className="w-4 h-4 text-[#e9c46a]" />
              </button>
            )}
          </div>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-600 font-medium">
          Already registered?{' '}
          <Link
            to={`/login?role=${role}${redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="font-bold text-[#1b4332] hover:text-[#d97706] underline ml-1"
          >
            Sign In to Your Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
