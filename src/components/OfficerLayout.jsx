import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from './OfficerSidebar';

export default function OfficerLayout() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900 font-sans selection:bg-[#1b4332] selection:text-white">
      <OfficerSidebar />
      <main className="lg:pl-72 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
