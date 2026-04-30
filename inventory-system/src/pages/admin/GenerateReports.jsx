import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function GenerateReports() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [reportType, setReportType] = useState('Current Inventory Status');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportRef = useRef(null);
  const reportOptions = ["Current Inventory Status", "Monthly Borrowing History", "Equipment in Maintenance"];

  const [format, setFormat] = useState('CSV (Spreadsheet)');
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const formatRef = useRef(null);
  const formatOptions = ["CSV (Spreadsheet)", "PDF Document"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportRef.current && !reportRef.current.contains(event.target)) setIsReportOpen(false);
      if (formatRef.current && !formatRef.current.contains(event.target)) setIsFormatOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageBg     = isDarkMode ? 'bg-[#050B14] text-white'         : 'bg-slate-50 text-slate-900';
  const backBtn    = isDarkMode ? 'text-white/40 hover:text-white'  : 'text-slate-400 hover:text-slate-900';
  const subText    = isDarkMode ? 'text-blue-100/40'                : 'text-slate-400';
  const cardBg     = isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40';
  const inputBg    = isDarkMode ? 'bg-black/40 border-white/10'     : 'bg-white border-slate-300 text-slate-900';
  const chevron    = isDarkMode ? 'text-white/40'                   : 'text-slate-400';
  const dropdownBg = isDarkMode ? 'bg-black/80 border-white/10'     : 'bg-white border-slate-200 shadow-xl';
  const dropItem   = isDarkMode ? 'text-white/60 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100';
  const dropActive = isDarkMode ? 'text-[#3B82F6] bg-[#3B82F6]/5'  : 'text-[#3852A4] bg-[#3852A4]/5';
  const labelText  = isDarkMode ? 'text-white/30'                   : 'text-slate-400';
  const downloadBtn = isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                 : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800';
  const footerText = isDarkMode ? 'text-white/20'                   : 'text-slate-300';

  const DropdownChevron = ({ isOpen }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3852A4]' : chevron}`}>
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );

  return (
    <div
      className={`h-screen w-full overflow-hidden p-6 md:p-12 lg:p-16 flex flex-col items-center relative transition-colors duration-500 ${pageBg}`}
      style={{ fontFamily: "ui-monospace, monospace" }}
    >
      {/* Back */}
      <button onClick={() => navigate('/dashboard')} className={`self-start text-lg transition-all mb-12 flex items-center gap-2 ${backBtn}`}>
        <span className="text-2xl">←</span> Back to Dashboard
      </button>

      {/* Header */}
      <div className="w-full max-w-6xl mb-12 text-left">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Generate Reports</h1>
        <p className={`text-sm font-bold uppercase tracking-widest ${subText}`}>System Auditing & Exports</p>
      </div>

      {/* Config Card */}
      <div className={`w-full max-w-6xl p-12 backdrop-blur-3xl border rounded-[3rem] shadow-2xl ${cardBg}`}>
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end" onSubmit={(e) => e.preventDefault()}>

          {/* Report Type Dropdown */}
          <div className="lg:col-span-5 relative" ref={reportRef}>
            <label className={`text-xs font-bold uppercase tracking-[0.3em] mb-4 block ${labelText}`}>Report Category</label>
            <div
              onClick={() => setIsReportOpen(!isReportOpen)}
              className={`w-full border rounded-3xl px-8 py-6 text-xl cursor-pointer transition-all flex justify-between items-center ${inputBg} ${isReportOpen ? 'border-[#3852A4] ring-1 ring-[#3852A4]/50' : ''}`}
            >
              <span>{reportType}</span>
              <DropdownChevron isOpen={isReportOpen} />
            </div>
            {isReportOpen && (
              <div className={`absolute top-[calc(100%+10px)] left-0 w-full backdrop-blur-2xl border rounded-3xl overflow-hidden z-[80] shadow-2xl ${dropdownBg}`}>
                {reportOptions.map((opt) => (
                  <div key={opt} onClick={() => { setReportType(opt); setIsReportOpen(false); }}
                    className={`px-8 py-5 text-lg cursor-pointer transition-all ${reportType === opt ? `font-bold ${dropActive}` : dropItem}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Format Dropdown */}
          <div className="lg:col-span-4 relative" ref={formatRef}>
            <label className={`text-xs font-bold uppercase tracking-[0.3em] mb-4 block ${labelText}`}>Export Format</label>
            <div
              onClick={() => setIsFormatOpen(!isFormatOpen)}
              className={`w-full border rounded-3xl px-8 py-6 text-xl cursor-pointer transition-all flex justify-between items-center ${inputBg} ${isFormatOpen ? 'border-[#3852A4] ring-1 ring-[#3852A4]/50' : ''}`}
            >
              <span>{format}</span>
              <DropdownChevron isOpen={isFormatOpen} />
            </div>
            {isFormatOpen && (
              <div className={`absolute top-[calc(100%+10px)] left-0 w-full backdrop-blur-2xl border rounded-3xl overflow-hidden z-[80] shadow-2xl ${dropdownBg}`}>
                {formatOptions.map((opt) => (
                  <div key={opt} onClick={() => { setFormat(opt); setIsFormatOpen(false); }}
                    className={`px-8 py-5 text-lg cursor-pointer transition-all ${format === opt ? `font-bold ${dropActive}` : dropItem}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="lg:col-span-3">
            <button type="submit"
              className={`w-full backdrop-blur-md border py-6 rounded-3xl font-bold text-xl transition-all shadow-lg active:scale-95 cursor-pointer ${downloadBtn}`}>
              Download
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-10">
        <p className={`text-xs font-bold uppercase tracking-[0.4em] ${footerText}`}>
          End of Session Audits Available
        </p>
      </div>
    </div>
  );
}