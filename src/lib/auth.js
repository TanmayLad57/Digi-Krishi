// ============================================================
// src/lib/auth.js
// Real Supabase authentication for farmers & officers
// ============================================================
import { supabase } from './supabaseClient'

// Farmers log in with phone, but Supabase Auth needs an email.
// We generate a synthetic, invisible-to-user email from the phone number.
const phoneToSyntheticEmail = (phone) => {
  const digitsOnly = phone.replace(/\D/g, '') // strip spaces, +91 etc.
  return `${digitsOnly}@farmer.local`
}

// ------------------------------------------------------------
// FARMER REGISTRATION
// Pass the farmerForm object from RegisterPage.jsx AS-IS:
// { name, phone, email, password, state, district, taluka, village,
//   pinCode, primaryCrop, secondaryCrop, cropStage, irrigationType,
//   crops, landArea }
// ------------------------------------------------------------
export async function registerFarmer(farmerForm) {
  const {
    name,
    phone,
    email,
    password,
    state,
    district,
    taluka,
    village,
    primaryCrop,
    secondaryCrop,
    cropStage,
    irrigationType,
    crops,
    landArea,
  } = farmerForm

  const syntheticEmail = phoneToSyntheticEmail(phone)

  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: syntheticEmail,
    password,
  })
  if (authError) throw authError

  // TEMP DEBUG: remove after diagnosing
  console.log('signUp result — session present?', !!authData.session, authData)
  if (!authData.session) {
    throw new Error('No session after signup — email confirmation may still be required. Check Supabase Auth settings.')
  }

  const userId = authData.user.id

  // 2. Insert profile row
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'farmer',
    full_name: name,
  })
  if (profileError) throw profileError

  // 3. Insert farmer_details row
  const { error: farmerError } = await supabase.from('farmer_details').insert({
    id: userId,
    phone,
    email: email || null,
    state,
    district,
    taluka,
    village: village || null,
    primary_crop: primaryCrop,
    secondary_crop: secondaryCrop || null,
    crop_stage: cropStage,
    irrigation_source: irrigationType,
    land_area_acres: landArea ? Number(landArea) : null,
    additional_crops: crops || [],
  })
  if (farmerError) throw farmerError

  return authData.user
}

// ------------------------------------------------------------
// FARMER LOGIN
// ------------------------------------------------------------
export async function loginFarmer({ phone, password }) {
  const syntheticEmail = phoneToSyntheticEmail(phone)

  const { data, error } = await supabase.auth.signInWithPassword({
    email: syntheticEmail,
    password,
  })
  if (error) throw error

  return data.user
}

// ------------------------------------------------------------
// OFFICER REGISTRATION
// Pass the officerForm object from RegisterPage.jsx AS-IS:
// { name, email, phone, officerId, password, designation, department,
//   state, district, talukasCovered }
// Note: talukasCovered is a comma-separated string in the form —
// converted to a text[] array here before insert.
// ------------------------------------------------------------
export async function registerOfficer(officerForm) {
  const {
    name,
    email,
    officerId,
    password,
    designation,
    department,
    state,
    district,
    talukasCovered,
  } = officerForm

  // 1. Create the auth user (officers use their real email directly)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })
  if (authError) throw authError

  const userId = authData.user.id

  // 2. Insert profile row
  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role: 'officer',
    full_name: name,
  })
  if (profileError) throw profileError

  // 3. Insert officer_details row
  const talukasArray = (talukasCovered || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { error: officerError } = await supabase.from('officer_details').insert({
    id: userId,
    official_email: email,
    employee_id: officerId,
    designation,
    department,
    assigned_state: state,
    assigned_district: district,
    talukas_covered: talukasArray,
  })
  if (officerError) throw officerError

  return authData.user
}

// ------------------------------------------------------------
// OFFICER LOGIN
// MVP: email only. Employee ID is captured at registration for
// verification purposes, but is not (yet) a valid login credential
// since looking it up requires a query before the user is authenticated,
// which RLS blocks. Revisit with a SECURITY DEFINER function if
// Employee ID login becomes a hard requirement later.
// ------------------------------------------------------------
export async function loginOfficer({ email, password }) {
  if (!email.includes('@')) {
    throw new Error('Please sign in with your official email address')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error

  return data.user
}

// ------------------------------------------------------------
// LOGOUT (shared by both roles)
// ------------------------------------------------------------
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ------------------------------------------------------------
// GET CURRENT USER'S ROLE (useful after login, for redirect)
// ------------------------------------------------------------
export async function getCurrentUserRole() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data.role
}
