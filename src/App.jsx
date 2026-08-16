import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { supabase } from './lib/supabaseClient';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OfficerRouteGuard from './components/OfficerRouteGuard';
import OfficerLayout from './components/OfficerLayout';
import LanguageSelectionOverlay from './components/LanguageSelectionOverlay';

import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import HowItWorksPage from './pages/HowItWorksPage';
import WhyUsPage from './pages/WhyUsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboardPage from './pages/FarmerDashboardPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';
import OfficerCasesPage from './pages/OfficerCasesPage';
import OfficerCaseDetailPage from './pages/OfficerCaseDetailPage';

function AnimatedRoutes() {
  const location = useLocation();
  const isOfficerWorkspace = location.pathname.startsWith('/officer-dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hide marketing Navbar & Footer when inside Officer Work Tool Workspace */}
      {!isOfficerWorkspace && <Navbar />}

      <main className="flex-grow" style={{ opacity: 1, visibility: 'visible' }}>
        <div key={location.pathname} style={{ opacity: 1, visibility: 'visible' }}>
          <Routes location={location}>
            {/* Public Marketing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/why-us" element={<WhyUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboardPage />} />

            {/* Protected Agriculture Officer Work Tool Section */}
            <Route element={<OfficerRouteGuard />}>
              <Route path="/officer-dashboard" element={<OfficerLayout />}>
                <Route index element={<OfficerDashboardPage />} />
                <Route path="cases" element={<OfficerCasesPage />} />
                <Route path="cases/:caseId" element={<OfficerCaseDetailPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </main>

      {!isOfficerWorkspace && <Footer />}
    </div>
  );
}

export default function App() {
  console.log('Supabase client:', supabase);

  return (
    <AuthProvider>
      <LanguageSelectionOverlay />
      <AnimatedRoutes />
    </AuthProvider>
  );
}
