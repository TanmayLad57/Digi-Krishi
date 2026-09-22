import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, LoaderCircle, Save, ShieldCheck, UserCog } from 'lucide-react';
import { POPULAR_CROPS } from '../data/locationData';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const inputClass = 'w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white shadow-sm';
const disabledInputClass = 'w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-500 bg-gray-100 cursor-not-allowed';
const cropStages = ['Sowing / Germination Stage', 'Vegetative Growth Stage', 'Flowering & Pod/Fruit Formation', 'Pre-Harvest / Ripening Stage', 'Post-Harvest / Land Prep'];
const irrigationSources = ['Drip Irrigation System', 'Monsoon / Rainfed', 'Canal / River Water', 'Borewell / Tube Well', 'Sprinkler System'];
const designations = ['Agriculture Officer', 'Assistant Director of Agriculture', 'KVK Agronomy Scientist', 'District Extension Lead'];

const Field = ({ label, children }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-gray-900 uppercase">{label}</label>
    {children}
  </div>
);

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, refreshProfile } = useAuth();
  const [role, setRole] = useState('');
  const [farmerForm, setFarmerForm] = useState(null);
  const [officerForm, setOfficerForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/login');
      const { data: profile, error: loadError } = await supabase
        .from('profiles')
        .select('id, role, full_name, farmer_details(*), officer_details(*)')
        .eq('id', user.id)
        .single();

      if (!mounted) return;
      if (loadError || !profile) {
        setError(loadError?.message || t('editProfile.loadError'));
      } else if (profile.role === 'farmer') {
        const details = Array.isArray(profile.farmer_details) ? profile.farmer_details[0] : profile.farmer_details;
        setRole('farmer');
        setFarmerForm({
          fullName: profile.full_name || '',
          phone: details?.phone || '',
          state: details?.state || '',
          district: details?.district || '',
          taluka: details?.taluka || '',
          village: details?.village || '',
          pincode: details?.pincode || details?.pin_code || details?.pinCode || '',
          primaryCrop: details?.primary_crop || '',
          secondaryCrop: details?.secondary_crop || '',
          cropStage: details?.crop_stage || '',
          irrigationSource: details?.irrigation_source || '',
          landArea: details?.land_area_acres ?? '',
          additionalCrops: details?.additional_crops || []
        });
      } else if (profile.role === 'officer') {
        const details = Array.isArray(profile.officer_details) ? profile.officer_details[0] : profile.officer_details;
        setRole('officer');
        setOfficerForm({
          fullName: profile.full_name || '',
          officialEmail: details?.official_email || user.email || '',
          employeeId: details?.employee_id || '',
          state: details?.assigned_state || '',
          district: details?.assigned_district || '',
          designation: details?.designation || '',
          talukasCovered: (details?.talukas_covered || []).join(', ')
        });
      } else {
        setError(t('editProfile.unsupportedRole'));
      }
      setLoading(false);
    };
    loadProfile();
    return () => { mounted = false; };
  }, [navigate, t]);

  const toggleCrop = (crop) => {
    setFarmerForm((previous) => ({
      ...previous,
      additionalCrops: previous.additionalCrops.includes(crop)
        ? previous.additionalCrops.filter((item) => item !== crop)
        : [...previous.additionalCrops, crop]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const userId = currentUser?.id || (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error(t('editProfile.signInAgain'));
      if (role === 'farmer') {
        // Pincode validation: if non-empty, must be exactly 6 digits
        const pinVal = (farmerForm.pincode || '').toString().trim();
        if (pinVal && !/^\d{6}$/.test(pinVal)) {
          throw new Error(t('register.validationPincode'));
        }
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: farmerForm.fullName.trim() })
          .eq('id', userId);
        if (profileError) throw profileError;

        const { error: detailsError } = await supabase
          .from('farmer_details')
          .update({
            village: farmerForm.village.trim() || null,
            pincode: (farmerForm.pincode || '').toString().trim() || null,
            primary_crop: farmerForm.primaryCrop || null,
            secondary_crop: farmerForm.secondaryCrop || null,
            crop_stage: farmerForm.cropStage || null,
            irrigation_source: farmerForm.irrigationSource || null,
            land_area_acres: farmerForm.landArea === '' ? null : Number(farmerForm.landArea),
            additional_crops: farmerForm.additionalCrops
          })
          .eq('id', userId);
        if (detailsError) throw detailsError;
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: officerForm.fullName.trim() })
          .eq('id', userId);
        if (profileError) throw profileError;

        const talukasCovered = officerForm.talukasCovered
          .split(',')
          .map((taluka) => taluka.trim())
          .filter(Boolean);

        const { error: detailsError } = await supabase
          .from('officer_details')
          .update({
            designation: officerForm.designation || null,
            talukas_covered: talukasCovered
          })
          .eq('id', userId);
        if (detailsError) throw detailsError;
      }
      await refreshProfile();
      setMessage(t('editProfile.successMessage'));
      window.setTimeout(() => navigate(role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'), 900);
    } catch (saveError) {
      setError(saveError.message || t('editProfile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 min-h-[70vh] flex items-center justify-center">
        <LoaderCircle className="w-8 h-8 text-[#1b4332] animate-spin" />
      </div>
    );
  }

  if (error && !farmerForm && !officerForm) {
    return (
      <div className="pt-28 min-h-[70vh] flex justify-center px-4">
        <p className="p-4 rounded-2xl bg-red-50 text-red-800 font-semibold">{error}</p>
      </div>
    );
  }

  const isFarmer = role === 'farmer';
  const form = isFarmer ? farmerForm : officerForm;

  return (
    <div className="pt-28 pb-20 bg-[#faf8f5] flex items-center justify-center min-h-[90vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-8 border-2 border-gray-200 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1b4332] text-[#e9c46a] flex items-center justify-center shadow-md">
            <UserCog className="w-6 h-6" />
          </div>
          <h1 className="font-serif-display text-xl font-bold text-gray-900">
            {t('editProfile.title')}
          </h1>
          <p className="text-xs text-gray-600">
            {t('editProfile.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isFarmer ? (
            <>
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase text-[#1b4332] border-b border-gray-200 pb-2">
                  {t('editProfile.farmDetails')}
                </h2>

                <Field label={t('editProfile.fullName')}>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setFarmerForm({ ...form, fullName: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t('editProfile.village')}>
                    <input
                      value={form.village}
                      onChange={(e) => setFarmerForm({ ...form, village: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label={t('editProfile.pincode')}>
                    <input
                      value={form.pincode}
                      onChange={(e) => setFarmerForm({ ...form, pincode: e.target.value })}
                      placeholder={t('editProfile.pincodePlaceholder')}
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none text-sm font-semibold text-gray-900 bg-white shadow-sm ${
                        form.pincode && !/^\d{6}$/.test(form.pincode)
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#1b4332]'
                      }`}
                    />
                    {form.pincode && !/^\d{6}$/.test(form.pincode) && (
                      <p className="text-xs font-semibold text-red-600 mt-1">{t('register.validationPincode')}</p>
                    )}
                  </Field>
                </div>

                <Field label={t('editProfile.landArea')}>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.landArea}
                    onChange={(e) => setFarmerForm({ ...form, landArea: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t('editProfile.primaryCrop')}>
                    <select
                      value={form.primaryCrop}
                      onChange={(e) => setFarmerForm({ ...form, primaryCrop: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t('editProfile.selectPrimaryCrop')}</option>
                      {POPULAR_CROPS.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t('editProfile.secondaryCrop')}>
                    <select
                      value={form.secondaryCrop}
                      onChange={(e) => setFarmerForm({ ...form, secondaryCrop: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t('editProfile.noneSelectCrop')}</option>
                      <option value="None">{t('editProfile.noneSingleCrop')}</option>
                      {POPULAR_CROPS.map((crop) => (
                        <option key={crop} value={crop}>{crop}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t('editProfile.cropStage')}>
                    <select
                      value={form.cropStage}
                      onChange={(e) => setFarmerForm({ ...form, cropStage: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t('editProfile.selectCropStage')}</option>
                      {cropStages.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t('editProfile.irrigationSource')}>
                    <select
                      value={form.irrigationSource}
                      onChange={(e) => setFarmerForm({ ...form, irrigationSource: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t('editProfile.selectIrrigationSource')}</option>
                      {irrigationSources.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-gray-700">
                    {t('editProfile.additionalCrops')}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_CROPS.map((crop) => {
                      const selected = form.additionalCrops.includes(crop);
                      return (
                        <button
                          type="button"
                          key={crop}
                          onClick={() => toggleCrop(crop)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                            selected
                              ? 'bg-[#1b4332] text-white border-[#1b4332]'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {crop} {selected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <ReadOnlySection
                title={t('editProfile.identityJurisdiction')}
                fields={[
                  [t('editProfile.phoneLoginId'), form.phone],
                  [t('editProfile.state'), form.state],
                  [t('editProfile.district'), form.district],
                  [t('editProfile.taluka'), form.taluka]
                ]}
              />
            </>
          ) : (
            <>
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase text-[#1b4332] border-b border-gray-200 pb-2">
                  {t('editProfile.officerDetails')}
                </h2>

                <Field label={t('editProfile.fullName')}>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setOfficerForm({ ...form, fullName: e.target.value })}
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t('editProfile.designation')}>
                    <select
                      value={form.designation}
                      onChange={(e) => setOfficerForm({ ...form, designation: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{t('editProfile.selectDesignation')}</option>
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>{designation}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t('editProfile.talukasCovered')}>
                    <input
                      value={form.talukasCovered}
                      onChange={(e) => setOfficerForm({ ...form, talukasCovered: e.target.value })}
                      placeholder={t('editProfile.talukasCoveredPlaceholder')}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </section>

              <ReadOnlySection
                title={t('editProfile.identityJurisdiction')}
                fields={[
                  [t('editProfile.officialEmail'), form.officialEmail],
                  [t('editProfile.employeeId'), form.employeeId],
                  [t('editProfile.assignedState'), form.state],
                  [t('editProfile.assignedDistrict'), form.district]
                ]}
              />

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {t('editProfile.officerNote')}
              </div>
            </>
          )}

          {error && (
            <p className="p-3 rounded-xl bg-red-50 text-xs font-bold text-red-800">
              {error}
            </p>
          )}

          {message && (
            <p className="p-3 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-800 flex gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {message}
            </p>
          )}

          <button
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:bg-gray-300 text-white font-bold text-sm shadow-md flex justify-center gap-2 items-center cursor-pointer disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 text-[#e9c46a]" />
            {saving ? t('editProfile.savingChanges') : t('editProfile.saveChanges')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ReadOnlySection({ title, fields }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold uppercase text-gray-500 border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(([label, value]) => (
          <Field key={label} label={label}>
            <input disabled value={value || ''} className={disabledInputClass} />
          </Field>
        ))}
      </div>
    </section>
  );
}
