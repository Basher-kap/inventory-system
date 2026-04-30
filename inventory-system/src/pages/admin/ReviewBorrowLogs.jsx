import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useTheme } from '../../context/ThemeContext';

export default function ReviewBorrowLogs() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('dateBorrowed', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching logs:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeCount = logs.filter(log => log.status === 'Active').length;

  const pageBg    = isDarkMode ? 'bg-[#050B14] text-white'         : 'bg-slate-50 text-slate-900';
  const backBtn   = isDarkMode ? 'text-white/40 hover:text-white'  : 'text-slate-400 hover:text-slate-900';
  const subText   = isDarkMode ? 'text-blue-100/40'                : 'text-slate-400';
  const statCard  = isDarkMode ? 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                               : 'bg-white border-slate-200 shadow-lg hover:bg-slate-50';
  const statLabel = isDarkMode ? 'text-white/40'                   : 'text-slate-400';
  const tableWrap = isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200';
  const tableHead = isDarkMode ? 'bg-white/5 text-white/20'        : 'bg-slate-50 text-slate-400';
  const emptyText = isDarkMode ? 'text-white/20'                   : 'text-slate-400';

  return (
    <div
      className={`min-h-screen w-full p-6 md:p-12 lg:p-16 flex flex-col items-center overflow-y-auto transition-colors duration-500 ${pageBg}`}
      style={{ fontFamily: "ui-monospace, monospace" }}
    >
      {/* Back */}
      <button onClick={() => navigate('/dashboard')} className={`self-start text-xl transition-all mb-12 flex items-center gap-2 ${backBtn}`}>
        <span className="text-3xl">←</span> Back to Dashboard
      </button>

      {/* Header */}
      <div className="w-full max-w-6xl mb-12 text-left">
        <h1 className="text-6xl font-bold tracking-tight mb-4">Borrow Logs</h1>
        <p className={`text-2xl uppercase tracking-[0.3em] font-black ${subText}`}>Live Activity Feed</p>
      </div>

      {/* Stats */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className={`border p-10 rounded-[2.5rem] flex justify-between items-center transition-all ${statCard}`}>
          <span className={`font-black uppercase tracking-[0.3em] text-xs ${statLabel}`}>Currently Out</span>
          <span className="text-5xl font-bold text-[#3B82F6] tracking-tighter">{activeCount}</span>
        </div>
        <div className={`border p-10 rounded-[2.5rem] flex justify-between items-center transition-all ${statCard}`}>
          <span className={`font-black uppercase tracking-[0.3em] text-xs ${statLabel}`}>Total Records</span>
          <span className="text-5xl font-bold tracking-tighter">{logs.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className={`w-full max-w-6xl border rounded-[3rem] overflow-hidden shadow-2xl ${tableWrap}`}>
        <table className="w-full text-left">
          <thead>
            <tr className={`text-xs font-black uppercase tracking-[0.4em] ${tableHead}`}>
              <th className="px-10 py-10">Log ID</th>
              <th className="px-10 py-10">Borrower Info</th>
              <th className="px-10 py-10">Asset Name</th>
              <th className="px-10 py-10">Timestamp</th>
              <th className="px-10 py-10 text-right">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
            {loading ? (
              <tr>
                <td colSpan="5" className={`p-32 text-center animate-pulse text-xl ${emptyText}`}>Initializing Live Stream...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" className={`p-32 text-center text-xl ${emptyText}`}>No borrowing activity recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className={`transition-all ${isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'}`}>
                  <td className={`px-10 py-10 font-bold tracking-widest text-sm uppercase ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                    {log.id.substring(0, 8)}
                  </td>
                  <td className="px-10 py-10 text-2xl font-bold">
                    {log.studentName}<br/>
                    <span className={`text-sm font-bold tracking-widest uppercase mt-1 block ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
                      ID: {log.studentId}
                    </span>
                  </td>
                  <td className={`px-10 py-10 text-lg ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>{log.itemName}</td>
                  <td className={`px-10 py-10 font-bold text-base ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{log.dateBorrowed}</td>
                  <td className="px-10 py-10 text-right">
                    <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                      log.status === 'Active'   ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                      log.status === 'Returned' ? 'bg-green-500/10 text-green-400' :
                                                  'bg-red-500/10 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}