import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

// Kept for reference/demo-seed purposes only — no longer used for real login logic.
export const DEMO_FARMER = {
  id: 'f-101',
  name: 'Rajesh Patil',
  email: 'farmer@demo.com',
  phone: '9876543210',
  role: 'farmer',
  state: 'Maharashtra',
  district: 'Nagpur',
  taluka: 'Katol',
  village: 'Pardi',
  pinCode: '441302',
  crops: ['Banana', 'Cotton', 'Paddy'],
  landArea: '5',
};

export const DEMO_OFFICER = {
  id: 'o-202',
  name: 'Dr. Sunita Sharma',
  email: 'officer@demo.com',
  phone: '9812345678',
  officerId: 'OFF-1092',
  role: 'officer',
  designation: 'KVK Agronomy Scientist',
  department: 'Krishi Vigyan Kendra, Nagpur',
  state: 'Maharashtra',
  district: 'Nagpur',
  talukasCovered: ['Katol', 'Kalmeshwar', 'Narkhed'],
};

// Fetches profile + role-specific details from Supabase and shapes them
// into the currentUser object the rest of the app already expects.
async function loadUserProfile(supabaseUser) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (profileError || !profile) {
    console.error('Failed to load profile for logged-in user', profileError);
    return null;
  }

  if (profile.role === 'farmer') {
    const { data: details } = await supabase
      .from('farmer_details')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    return {
      id: supabaseUser.id,
      name: profile.full_name,
      role: 'farmer',
      email: supabaseUser.email,
      phone: details?.phone,
      state: details?.state,
      district: details?.district,
      taluka: details?.taluka,
      village: details?.village,
      primaryCrop: details?.primary_crop,
      secondaryCrop: details?.secondary_crop,
      cropStage: details?.crop_stage,
      irrigationType: details?.irrigation_source,
      crops: details?.additional_crops || [],
      landArea: details?.land_area_acres,
    };
  }

  if (profile.role === 'officer') {
    const { data: details } = await supabase
      .from('officer_details')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    return {
      id: supabaseUser.id,
      name: profile.full_name,
      role: 'officer',
      email: supabaseUser.email,
      officerId: details?.employee_id,
      designation: details?.designation,
      department: details?.department,
      state: details?.assigned_state,
      district: details?.assigned_district,
      talukasCovered: details?.talukas_covered || [],
      verified: details?.verified,
    };
  }

  return null;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // On first load, check if a Supabase session already exists
    // (e.g. user refreshed the page while logged in).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadUserProfile(session.user);
        if (isMounted) setCurrentUser(profile);
      }
      if (isMounted) setLoading(false);
    });

    // Keep currentUser in sync with real Supabase auth state going forward
    // (login, logout, token refresh, etc. all flow through here).
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadUserProfile(session.user);
        if (isMounted) setCurrentUser(profile);
      } else {
        if (isMounted) setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Real logout — clears the actual Supabase session.
  // currentUser is cleared automatically via the onAuthStateChange listener above.
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    isFarmer: currentUser?.role === 'farmer',
    isOfficer: currentUser?.role === 'officer',
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
