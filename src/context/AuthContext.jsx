import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

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

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dko-auth-user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error('Failed to parse saved user', e);
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dko-auth-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dko-auth-user');
    }
  }, [currentUser]);

  // Login handler
  const login = (emailOrPhone, password, role = 'farmer') => {
    // Check Farmer Demo
    if (role === 'farmer') {
      if (
        (emailOrPhone === DEMO_FARMER.email || emailOrPhone === DEMO_FARMER.phone || emailOrPhone === 'farmer') &&
        (password === 'farmer123' || password === 'demo')
      ) {
        setCurrentUser(DEMO_FARMER);
        return { success: true, user: DEMO_FARMER };
      }
    }

    // Check Officer Demo
    if (role === 'officer') {
      if (
        (emailOrPhone === DEMO_OFFICER.email || emailOrPhone === DEMO_OFFICER.officerId || emailOrPhone === 'officer') &&
        (password === 'officer123' || password === 'demo')
      ) {
        setCurrentUser(DEMO_OFFICER);
        return { success: true, user: DEMO_OFFICER };
      }
    }

    // Custom Registered User Login fallback simulation
    const mockCustomUser = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Kisan User',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'kisan@example.com',
      phone: emailOrPhone.includes('@') ? '9876543210' : emailOrPhone,
      role: role,
      state: 'Maharashtra',
      district: 'Nagpur',
      crops: ['Cotton', 'Wheat'],
    };

    setCurrentUser(mockCustomUser);
    return { success: true, user: mockCustomUser };
  };

  // Register handler
  const register = (userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      ...userData,
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isFarmer: currentUser?.role === 'farmer',
    isOfficer: currentUser?.role === 'officer',
    login,
    register,
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
