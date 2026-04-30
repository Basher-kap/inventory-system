import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GenerateReports() {
  const navigate = useNavigate();

  // State for Report Type Dropdown
  const [reportType, setReportType] = useState('Current Inventory Status');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const reportRef = useRef(null);
  const reportOptions = [
    "Current Inventory Status",
    "Monthly Borrowing History",
    "Equipment in Maintenance"
  ];

  // State for Format Dropdown[cite: 26]
  const [format, setFormat] = useState('CSV (Spreadsheet)');
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const formatRef = useRef(null);
  const formatOptions = ["CSV (Spreadsheet)", "PDF Document"];

  // Click-outside listener to close dropdowns[cite: 22, 26]
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportRef.current && !reportRef.current.contains(event.target)) setIsReportOpen(false);
      if (formatRef.current && !formatRef.current.contains(event.target)) setIsFormatOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="h-screen w-full overflow-hidden bg-[#050B14] text-white p-6 md:p-12 lg:p-16 flex flex-col items-center relative"
      style={{ fontFamily: "ui-monospace, monospace" }}
    >

      {/* Navigation Header - Consistent with AddEquipment */}
      <button
        onClick={() => navigate('/dashboard')}
        className="self-start text-lg text-white/40 hover:text-white transition-all mb-12 flex items-center gap-2"
      >
        <span className="text-2xl">←</span> Back to Dashboard
      </button>

      {/* Page Title Section[cite: 22] */}
      <div className="w-full max-w-6xl mb-12 text-left">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Generate Reports</h1>
        <p className="text-xl text-blue-100/40 uppercase tracking-widest text-sm font-bold">
          System Auditing & Exports
        </p>
      </div>

      {/* --- CENTRAL REPORT CONFIGURATION CARD[cite: 21, 22] --- */}
      <div className="w-full max-w-6xl p-12 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end" onSubmit={(e) => e.preventDefault()}>

          {/* Custom Dropdown: Report Type[cite: 26] */}
          <div className="lg:col-span-5 relative" ref={reportRef}>
            <label className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-4 block">Report Category</label>
            <div
              onClick={() => setIsReportOpen(!isReportOpen)}
              className={`w-full bg-black/40 border rounded-3xl px-8 py-6 text-xl cursor-pointer transition-all flex justify-between items-center ${isReportOpen ? 'border-[#3852A4] ring-1 ring-[#3852A4]/50' : 'border-white/10'}`}
            >
              <span className="text-white">{reportType}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isReportOpen ? 'rotate-180 text-[#3852A4]' : 'text-white/40'}`}><path d="M6 9l6 6 6-6"/></svg>
            </div>

            {isReportOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden z-[80] shadow-2xl">
                {reportOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setReportType(opt); setIsReportOpen(false); }}
                    className={`px-8 py-5 text-lg cursor-pointer transition-all hover:bg-white/10 ${reportType === opt ? 'text-[#3B82F6] bg-[#3B82F6]/5 font-bold' : 'text-white/60'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Dropdown: Export Format[cite: 26] */}
          <div className="lg:col-span-4 relative" ref={formatRef}>
            <label className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mb-4 block">Export Format</label>
            <div
              onClick={() => setIsFormatOpen(!isFormatOpen)}
              className={`w-full bg-black/40 border rounded-3xl px-8 py-6 text-xl cursor-pointer transition-all flex justify-between items-center ${isFormatOpen ? 'border-[#3852A4] ring-1 ring-[#3852A4]/50' : 'border-white/10'}`}
            >
              <span className="text-white">{format}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isFormatOpen ? 'rotate-180 text-[#3852A4]' : 'text-white/40'}`}><path d="M6 9l6 6 6-6"/></svg>
            </div>

            {isFormatOpen && (
              <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden z-[80] shadow-2xl">
                {formatOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setFormat(opt); setIsFormatOpen(false); }}
                    className={`px-8 py-5 text-lg cursor-pointer transition-all hover:bg-white/10 ${format === opt ? 'text-[#3B82F6] bg-[#3B82F6]/5 font-bold' : 'text-white/60'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Download Button - Harmonized Glassmorphism[cite: 21, 22] */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white py-6 rounded-3xl font-bold text-xl transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Download
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info[cite: 20] */}
      <div className="mt-auto pb-10">
        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em]">
          End of Session Audits Available
        </p>
      </div>
    </div>
  );
}