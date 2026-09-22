import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Droplets, Layers, LoaderCircle, Save, ShieldCheck, Sprout, UserCog } from 'lucide-react';
import { POPULAR_CROPS } from '../data/locationData';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const inputClass = 'w-full px-4 py-3 rounded-2xl border-2 border-gray-300 focus:border-[#1b4332] focus:outline-none text-sm font-semibold text-gray-900 bg-white shadow-sm';
const disabledInputClass = 'w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-500 bg-gray-100 cursor-not-allowed';
const cropStages = ['Sowing / Germination Stage', 'Vegetative Growth Stage', 'Flowering & Pod/Fruit Formation', 'Pre-Harvest / Ripening Stage', 'Post-Harvest / Land Prep'];
const irrigationSources = ['Drip Irrigation System', 'Monsoon / Rainfed', 'Canal / River Water', 'Borewell / Tube Well', 'Sprinkler System'];
const designations = ['Agriculture Officer', 'Assistant Director of Agriculture', 'KVK Agronomy Scientist', 'District Extension Lead'];

const Field = ({ label, children }) => <div className="space-y-1"><label className="block text-xs font-bold text-gray-900 uppercase">{label}</label>{children}</div>;

export default function EditProfilePage() {
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
      const { data: profile, error: loadError } = await supabase.from('profiles').select('id, role, full_name, farmer_details(*), officer_details(*)').eq('id', user.id).single();
      if (!mounted) return;
      if (loadError || !profile) {
        setError(loadError?.message || 'Unable to load your profile.');
      } else if (profile.role === 'farmer') {
        const details = Array.isArray(profile.farmer_details) ? profile.farmer_details[0] : profile.farmer_details;
        setRole('farmer');
        setFarmerForm({ fullName: profile.full_name || '', phone: details?.phone || '', state: details?.state || '', district: details?.district || '', taluka: details?.taluka || '', village: details?.village || '', primaryCrop: details?.primary_crop || '', secondaryCrop: details?.secondary_crop || '', cropStage: details?.crop_stage || '', irrigationSource: details?.irrigation_source || '', landArea: details?.land_area_acres ?? '', additionalCrops: details?.additional_crops || [] });
      } else if (profile.role === 'officer') {
        const details = Array.isArray(profile.officer_details) ? profile.officer_details[0] : profile.officer_details;
        setRole('officer');
        setOfficerForm({ fullName: profile.full_name || '', officialEmail: details?.official_email || user.email || '', employeeId: details?.employee_id || '', state: details?.assigned_state || '', district: details?.assigned_district || '', designation: details?.designation || '', talukasCovered: (details?.talukas_covered || []).join(', ') });
      } else setError('This account does not have a supported profile role.');
      setLoading(false);
    };
    loadProfile();
    return () => { mounted = false; };
  }, [navigate]);

  const toggleCrop = (crop) => setFarmerForm((previous) => ({ ...previous, additionalCrops: previous.additionalCrops.includes(crop) ? previous.additionalCrops.filter((item) => item !== crop) : [...previous.additionalCrops, crop] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); setMessage(''); setSaving(true);
    try {
      const userId = currentUser?.id || (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Please sign in again to update your profile.');
      if (role === 'farmer') {
        const { error: profileError } = await supabase.from('profiles').update({ full_name: farmerForm.fullName.trim() }).eq('id', userId);
        if (profileError) throw profileError;
        const { error: detailsError } = await supabase.from('farmer_details').update({ village: farmerForm.village.trim() || null, primary_crop: farmerForm.primaryCrop || null, secondary_crop: farmerForm.secondaryCrop || null, crop_stage: farmerForm.cropStage || null, irrigation_source: farmerForm.irrigationSource || null, land_area_acres: farmerForm.landArea === '' ? null : Number(farmerForm.landArea), additional_crops: farmerForm.additionalCrops }).eq('id', userId);
        if (detailsError) throw detailsError;
      } else {
        const { error: profileError } = await supabase.from('profiles').update({ full_name: officerForm.fullName.trim() }).eq('id', userId);
        if (profileError) throw profileError;
        const talukasCovered = officerForm.talukasCovered.split(',').map((taluka) => taluka.trim()).filter(Boolean);
        const { error: detailsError } = await supabase.from('officer_details').update({ designation: officerForm.designation || null, talukas_covered: talukasCovered }).eq('id', userId);
        if (detailsError) throw detailsError;
      }
      await refreshProfile();
      setMessage('Profile updated successfully. Redirecting to your dashboard...');
      window.setTimeout(() => navigate(role === 'officer' ? '/officer-dashboard' : '/farmer-dashboard'), 900);
    } catch (saveError) { setError(saveError.message || 'Unable to update your profile.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="pt-28 min-h-[70vh] flex items-center justify-center"><LoaderCircle className="w-8 h-8 text-[#1b4332] animate-spin" /></div>;
  if (error && !farmerForm && !officerForm) return <div className="pt-28 min-h-[70vh] flex justify-center px-4"><p className="p-4 rounded-2xl bg-red-50 text-red-800 font-semibold">{error}</p></div>;

  const isFarmer = role === 'farmer';
  const form = isFarmer ? farmerForm : officerForm;
  return <div className="pt-28 pb-20 bg-[#faf8f5] flex items-center justify-center min-h-[90vh] px-4"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl bg-white rounded-3xl p-4 sm:p-8 border-2 border-gray-200 shadow-xl space-y-6">
    <div className="text-center space-y-2"><div className="w-12 h-12 mx-auto rounded-2xl bg-[#1b4332] text-[#e9c46a] flex items-center justify-center shadow-md"><UserCog className="w-6 h-6" /></div><h1 className="font-serif-display text-xl font-bold text-gray-900">Edit Profile</h1><p className="text-xs text-gray-600">Keep your farm or service details up to date.</p></div>
    <form onSubmit={handleSubmit} className="space-y-5">{isFarmer ? <><section className="space-y-4"><h2 className="text-xs font-bold uppercase text-[#1b4332] border-b border-gray-200 pb-2">Farm Details</h2><Field label="Full Name"><input required value={form.fullName} onChange={(e) => setFarmerForm({ ...form, fullName: e.target.value })} className={inputClass} /></Field><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Village / Area"><input value={form.village} onChange={(e) => setFarmerForm({ ...form, village: e.target.value })} className={inputClass} /></Field><Field label="Land Area (Acres)"><input type="number" min="0" step="0.01" value={form.landArea} onChange={(e) => setFarmerForm({ ...form, landArea: e.target.value })} className={inputClass} /></Field></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Primary Crop"><select value={form.primaryCrop} onChange={(e) => setFarmerForm({ ...form, primaryCrop: e.target.value })} className={inputClass}><option value="">Select Primary Crop</option>{POPULAR_CROPS.map((crop) => <option key={crop}>{crop}</option>)}</select></Field><Field label="Secondary Crop"><select value={form.secondaryCrop} onChange={(e) => setFarmerForm({ ...form, secondaryCrop: e.target.value })} className={inputClass}><option value="">None / Select Crop</option><option value="None">None (Single Crop)</option>{POPULAR_CROPS.map((crop) => <option key={crop}>{crop}</option>)}</select></Field></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Crop Stage"><select value={form.cropStage} onChange={(e) => setFarmerForm({ ...form, cropStage: e.target.value })} className={inputClass}><option value="">Select Crop Stage</option>{cropStages.map((stage) => <option key={stage}>{stage}</option>)}</select></Field><Field label="Irrigation Source"><select value={form.irrigationSource} onChange={(e) => setFarmerForm({ ...form, irrigationSource: e.target.value })} className={inputClass}><option value="">Select Irrigation Source</option>{irrigationSources.map((source) => <option key={source}>{source}</option>)}</select></Field></div><div className="space-y-2"><label className="block text-xs font-bold uppercase text-gray-700">Additional Crops</label><div className="flex flex-wrap gap-1.5">{POPULAR_CROPS.map((crop) => { const selected = form.additionalCrops.includes(crop); return <button type="button" key={crop} onClick={() => toggleCrop(crop)} className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selected ? 'bg-[#1b4332] text-white border-[#1b4332]' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{crop} {selected ? '✓' : '+'}</button>; })}</div></div></section><ReadOnlySection fields={[['Phone (Login ID)', form.phone], ['State', form.state], ['District', form.district], ['Taluka', form.taluka]]} /></> : <><section className="space-y-4"><h2 className="text-xs font-bold uppercase text-[#1b4332] border-b border-gray-200 pb-2">Officer Details</h2><Field label="Full Name"><input required value={form.fullName} onChange={(e) => setOfficerForm({ ...form, fullName: e.target.value })} className={inputClass} /></Field><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Designation"><select value={form.designation} onChange={(e) => setOfficerForm({ ...form, designation: e.target.value })} className={inputClass}><option value="">Select Designation</option>{designations.map((designation) => <option key={designation}>{designation}</option>)}</select></Field><Field label="Talukas Covered"><input value={form.talukasCovered} onChange={(e) => setOfficerForm({ ...form, talukasCovered: e.target.value })} placeholder="Katol, Kalmeshwar" className={inputClass} /></Field></div></section><ReadOnlySection fields={[['Official Email (Login ID)', form.officialEmail], ['Employee ID', form.employeeId], ['Assigned State', form.state], ['Assigned District', form.district]]} /><div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" />Identity and assigned jurisdiction are managed by your administrator.</div></>}{error && <p className="p-3 rounded-xl bg-red-50 text-xs font-bold text-red-800">{error}</p>}{message && <p className="p-3 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-800 flex gap-2"><CheckCircle2 className="w-4 h-4" />{message}</p>}<button disabled={saving} className="w-full py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] disabled:bg-gray-300 text-white font-bold text-sm shadow-md flex justify-center gap-2"><Save className="w-4 h-4 text-[#e9c46a]" />{saving ? 'Saving changes...' : 'Save Changes'}</button></form>
  </motion.div></div>;
}

function ReadOnlySection({ fields }) { return <section className="space-y-4"><h2 className="text-xs font-bold uppercase text-gray-500 border-b border-gray-200 pb-2">Identity and Jurisdiction</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{fields.map(([label, value]) => <Field key={label} label={label}><input disabled value={value} className={disabledInputClass} /></Field>)}</div></section>; }
