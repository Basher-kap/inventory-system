import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase.config';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [stats, setStats] = useState({ available: 0, total: 0, borrowed: 0, maintenance: 0 });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const equipmentRef = collection(db, 'equipment');
    const unsubscribe = onSnapshot(equipmentRef, (snapshot) => {
      let availableCount = 0, borrowedCount = 0, maintenanceCount = 0;
      snapshot.forEach((doc) => {
        const item = doc.data();
        if (item.status === 'available') availableCount++;
        if (item.status === 'borrowed') borrowedCount++;
        if (item.status === 'maintenance') maintenanceCount++;
      });
      setStats({ available: availableCount, total: snapshot.size, borrowed: borrowedCount, maintenance: maintenanceCount });
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={`min-h-screen md:h-screen w-full overflow-y-auto md:overflow-hidden flex flex-col p-4 sm:p-6 md:p-10 lg:p-14 transition-colors duration-500 relative ${isDarkMode ? 'bg-[#050B14] text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: "ui-monospace, monospace" }}>

      {/* SIGN OUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" onClick={() => setShowLogoutModal(false)}></div>
          <div className={`relative w-full max-w-md p-6 sm:p-10 border rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center ${isDarkMode ? 'bg-[#050B14] border-white/10 shadow-black' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Confirm Sign Out</h3>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>End your current session? You will need to re-authenticate to manage assets.</p>
            <div className="flex gap-3 sm:gap-4">
              <button onClick={() => setShowLogoutModal(false)} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border font-bold transition-all cursor-pointer ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}>Cancel</button>
              <button onClick={handleLogout} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'}`}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1 sm:mb-2">Overview</h1>
          <p className={`text-xs sm:text-sm md:text-lg uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Lab Inventory System</p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
          <button onClick={toggleTheme} className={`p-2.5 sm:p-3 rounded-full border transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}>
            {isDarkMode ? (
              <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="18" height="18" sm:width="20" sm:height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          <button onClick={() => setShowLogoutModal(true)} className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border text-sm sm:text-base font-semibold transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
            Sign out
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 flex-1 min-h-0">
        {[
          { label: 'Available', val: stats.available, hero: true },
          { label: 'Total', val: stats.total },
          { label: 'Borrowed', val: stats.borrowed },
          { label: 'Maintenance', val: stats.maintenance }
        ].map((stat, i) => (
          <div key={i} className={`p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] flex flex-col justify-between border transition-all ${isDarkMode ? (stat.hero ? 'bg-gradient-to-br from-[#3852A4]/20 to-transparent border-white/10' : 'bg-white/5 border-white/10') : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
            <span className={`text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{stat.label}</span>
            <span className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter mt-4 sm:mt-0">{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Management Footer Controls */}
      <div className="mt-8 sm:mt-12 pb-4 sm:pb-0">
        <h2 className={`text-xs sm:text-sm font-black uppercase tracking-[0.4em] mb-4 sm:mb-8 ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>Controls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {['equipment', 'logs', 'reports'].map((path) => (
            <button key={path} onClick={() => navigate(`/${path}`)} className={`py-5 sm:py-7 rounded-2xl sm:rounded-[2rem] text-lg sm:text-xl font-bold border transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-[#3852A4]/30' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-lg shadow-slate-200/50'}`}>
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}