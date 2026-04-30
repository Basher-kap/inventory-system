import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-[#050B14] text-white p-6 md:p-12 lg:p-20"
      style={{
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace"
      }}
    >
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Overview</h1>
          <p className="text-blue-100/50 text-lg">Lab Inventory Management System</p>
        </div>

        {/* Glassmorphism Logout Button */}
        <button
          onClick={() => navigate('/')}
          style={{ fontFamily: 'inherit' }}
          className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-lg font-medium transition-all cursor-pointer"
        >
          Sign out
        </button>
      </header>

      {/* Large Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">

        {/* Highlighted Primary Card - Harmonized using the Logo's Royal Blue as a soft tint */}
        <div className="bg-gradient-to-br from-[#3852A4]/30 to-transparent backdrop-blur-xl border border-[#3852A4]/40 p-10 rounded-[2.5rem] flex flex-col justify-between h-56 transition-all hover:border-[#3852A4]/60">
          <span className="text-blue-100/70 text-sm font-semibold uppercase tracking-widest">Available Items</span>
          <span className="text-7xl font-bold text-white">89</span>
        </div>

        {/* Standard Glass Cards */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between h-56 transition-all hover:bg-white/10">
          <span className="text-blue-100/50 text-sm font-semibold uppercase tracking-widest">Total Items</span>
          <span className="text-7xl font-bold text-white">142</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between h-56 transition-all hover:bg-white/10">
          <span className="text-blue-100/50 text-sm font-semibold uppercase tracking-widest">Borrowed</span>
          <span className="text-7xl font-bold text-white">45</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-between h-56 transition-all hover:bg-white/10">
          <span className="text-blue-100/50 text-sm font-semibold uppercase tracking-widest">Maintenance</span>
          <span className="text-7xl font-bold text-white">8</span>
        </div>
      </div>

      {/* Large Action Buttons */}
      <h2 className="text-2xl font-semibold mb-8 tracking-tight">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Harmonized Glassmorphism Primary Button (Replaces the loud solid blue) */}
        <button
          onClick={() => navigate('/equipment')}
          style={{ fontFamily: 'inherit' }}
          className="flex items-center justify-start p-10 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-[2rem] h-32 transition-all duration-300 shadow-lg text-2xl font-semibold tracking-tight cursor-pointer"
        >
          Manage Equipment
        </button>

        <button
          style={{ fontFamily: 'inherit' }}
          className="flex items-center justify-start p-10 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-[2rem] h-32 transition-all text-2xl font-semibold tracking-tight cursor-pointer"
        >
          Review Borrow Logs
        </button>

        <button
          style={{ fontFamily: 'inherit' }}
          className="flex items-center justify-start p-10 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-[2rem] h-32 transition-all text-2xl font-semibold tracking-tight cursor-pointer"
        >
          Generate Reports
        </button>

      </div>
    </div>
  );
}