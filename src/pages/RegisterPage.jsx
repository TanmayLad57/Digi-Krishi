import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, UserCheck, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIA_STATES_DISTRICTS, POPULAR_CROPS } from '../data/locationData';

export default function RegisterPage() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'farmer') {
      const res = register({
        ...farmerForm,
        role: 'farmer',
      });
      if (res.success) {
        navigate(redirectPath || '/farmer-dashboard');
      }
    } else {
      const res = register({
        ...officerForm,
        role: 'officer',
      });
      if (res.success) {
        navigate(redirectPath || '/officer-dashboard');
      }
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
              Digital Krishi <span className="text-[#d97706]">Officer</span>
            </span>
          </Link>
          <h1 className="font-serif-display text-xl font-bold text-gray-900">
            Create Your Free Account
          </h1>
          <p className="text-xs text-gray-600 font-body">
            {role === 'farmer'
              ? 'Get personalized crop advisory & direct extension officer support'
              : 'Access the officer extension portal & review farmer advisory cases'}
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

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold border-b border-gray-200 pb-3 text-gray-500">
          <span className={step === 1 ? 'text-[#1b4332]' : ''}>1. Personal Info</span>
          <span className={step === 2 ? 'text-[#1b4332]' : ''}>2. Location</span>
          <span className={step === 3 ? 'text-[#1b4332]' : ''}>
            {role === 'farmer' ? '3. Crop Context' : '3. Jurisdiction'}
          </span>
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        required
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Email (Optional)</label>
                        <input
                          type="email"
                          value={farmerForm.email}
                          onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                          placeholder="farmer@example.com"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        required
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        required
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Employee / Officer ID *</label>
                        <input
                          type="text"
                          value={officerForm.officerId}
                          onChange={(e) => setOfficerForm({ ...officerForm, officerId: e.target.value })}
                          placeholder="e.g. OFF-1092"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                          required
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        required
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white"
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white"
                        >
                          {availableDistricts.map((dist) => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Taluka / Tehsil *</label>
                        <input
                          type="text"
                          value={farmerForm.taluka}
                          onChange={(e) => setFarmerForm({ ...farmerForm, taluka: e.target.value })}
                          placeholder="e.g. Katol"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-900 uppercase">Village / Area</label>
                        <input
                          type="text"
                          value={farmerForm.village}
                          onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                          placeholder="e.g. Pardi"
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white"
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                        required
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3: ROLE SPECIFIC DETAILS */}
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
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-900 uppercase">
                        Select Primary Crop(s) Grown:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_CROPS.map((crop) => {
                          const isSelected = farmerForm.crops.includes(crop);
                          return (
                            <button
                              key={crop}
                              type="button"
                              onClick={() => handleCropToggle(crop)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
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

                    <div className="space-y-1 pt-2">
                      <label className="block text-xs font-bold text-gray-900 uppercase">Land Area (Acres):</label>
                      <input
                        type="number"
                        value={farmerForm.landArea}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landArea: e.target.value })}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
                      />
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white"
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
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-bold bg-white"
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
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-medium"
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
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md flex items-center gap-2 ml-auto"
              >
                <span>Complete Registration</span>
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
