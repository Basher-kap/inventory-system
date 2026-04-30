import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

export default function ReviewBorrowLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for the 'logs' collection
  useEffect(() => {
    // We order by date so the newest activity stays at the top
    const q = query(collection(db, 'logs'), orderBy('dateBorrowed', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate live numbers for the header
  const activeCount = logs.filter(log => log.status === 'Active').length;

  return (
    <div
      className="min-h-screen w-full bg-[#050B14] text-white p-6 md:p-12 lg:p-16 flex flex-col items-center overflow-y-auto"
      style={{ fontFamily: "ui-monospace, monospace" }}
    >

      {/* Back Navigation[cite: 22] */}
      <button
        onClick={() => navigate('/dashboard')}
        className="self-start text-lg text-white/40 hover:text-white transition-all mb-12 flex items-center gap-2"
      >
        <span className="text-2xl">←</span> Back to Dashboard
      </button>

      {/* Page Header[cite: 19, 22] */}
      <div className="w-full max-w-6xl mb-12 text-left">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Borrow Logs</h1>
        <p className="text-xl text-blue-100/40 uppercase tracking-widest text-sm font-bold">
          Live Activity Feed
        </p>
      </div>

      {/* --- LIVE STATS BAR --- */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] flex justify-between items-center">
          <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Currently Out</span>
          <span className="text-4xl font-bold text-[#3B82F6]">{activeCount}</span>
        </div>
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] flex justify-between items-center">
          <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Total Records</span>
          <span className="text-4xl font-bold">{logs.length}</span>
        </div>
      </div>

      {/* --- LOGS TABLE[cite: 22, 23] --- */}
      <div className="w-full max-w-6xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] bg-white/5">
              <th className="px-10 py-8">Log ID</th>
              <th className="px-10 py-8">Borrower Info</th>
              <th className="px-10 py-8">Asset Name</th>
              <th className="px-10 py-8">Timestamp</th>
              <th className="px-10 py-8 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-white/20 animate-pulse">Initializing Live Stream...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-white/20">No borrowing activity recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.03] transition-all">
                  <td className="px-10 py-8 text-white/40 font-medium tracking-wider text-xs">
                    {log.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-10 py-8 text-xl font-bold">
                    {log.studentName} <br/>
                    <span className="text-xs text-white/30 font-normal tracking-normal">{log.studentId}</span>
                  </td>
                  <td className="px-10 py-8 text-white/80">
                    {log.itemName}
                  </td>
                  <td className="px-10 py-8 text-white/40 font-medium text-sm">
                    {log.dateBorrowed}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      log.status === 'Active' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
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