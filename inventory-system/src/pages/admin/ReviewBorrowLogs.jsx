import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDoc, limit } from 'firebase/firestore';
import { Html5Qrcode } from 'html5-qrcode';
import { db } from '../../firebase/firebase.config';
import { useTheme } from '../../context/ThemeContext';

// REDESIGNED: Custom Core Scanner Modal (Instant Camera, No Clunky UI)
const ScannerModal = ({ isDarkMode, onClose, onScanSuccess }) => {
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    // We use the core Html5Qrcode class instead of Html5QrcodeScanner
    // to completely bypass the library's default ugly UI.
    const html5QrCode = new Html5Qrcode("qr-reader");

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // Prefer back camera on mobile/tablets
          {
            fps: 15, // Higher frame rate for faster scanning
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            // Stop camera instantly on success to prevent multiple fires
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
            }).catch(console.error);
          },
          () => {
            // Ignore frame-by-frame background parse errors
          }
        );
      } catch (err) {
        console.error("Camera initialization failed:", err);
        setCameraError("Camera access denied or device not found. Please check browser permissions.");
      }
    };

    startScanner();

    // Cleanup: Ensure camera turns off when modal is closed
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" onClick={onClose}></div>
      <div className={`relative w-full max-w-md p-6 sm:p-10 backdrop-blur-3xl border rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-white/10 to-[#050B14] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>

        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold tracking-normal">Scan Asset</h3>
          <button onClick={onClose} className={`text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
            Close
          </button>
        </div>

        {cameraError ? (
          <div className="w-full p-8 text-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-500 font-bold text-sm">
            {cameraError}
          </div>
        ) : (
          <div className={`w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-all ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            <div id="qr-reader" className="w-full flex items-center justify-center min-h-[250px] [&>video]:object-cover [&>video]:rounded-2xl sm:[&>video]:rounded-3xl"></div>
          </div>
        )}

        <p className={`mt-8 text-center text-[10px] sm:text-xs tracking-widest uppercase font-bold ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
          Hold item up to the camera
        </p>
      </div>
    </div>
  );
};

export default function ReviewBorrowLogs() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: '', type: 'default' });
  const [returnModal, setReturnModal] = useState({ show: false, log: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, logId: null });
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const LOG_LIMIT = 300;

  const showToast = (message, type = 'default') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'default' }), 3000);
  };

  const formatLogDate = (log) => {
    if (log?.dateBorrowedAt?.toDate) {
      return log.dateBorrowedAt.toDate().toLocaleString();
    }
    return log?.dateBorrowed || 'N/A';
  };

  const checkIsOverdue = (expectedReturnStr) => {
    if (!expectedReturnStr || expectedReturnStr === 'N/A') return false;

    const expectedDate = new Date(expectedReturnStr);
    if (isNaN(expectedDate.getTime())) return false;

    expectedDate.setHours(23, 59, 59, 999);
    const now = new Date();
    return now > expectedDate;
  };

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('dateBorrowedAt', 'desc'), limit(LOG_LIMIT));
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

  const handleScanSuccess = (decodedText) => {
    setIsScannerOpen(false);

    try {
      const urlParts = decodedText.split('/');
      const equipmentId = urlParts[urlParts.length - 1];

      const activeLogsForEquipment = logs.filter(l => l.equipmentId === equipmentId && l.status === 'Active');

      if (activeLogsForEquipment.length === 1) {
        initiateReturn(activeLogsForEquipment[0]);
      } else if (activeLogsForEquipment.length > 1) {
        showToast(`Found ${activeLogsForEquipment.length} active logs for this bulk item. Please select the correct student manually.`, 'default');
      } else {
        showToast("No active borrow log found for this scanned item.", "delete");
      }
    } catch (err) {
      console.error("QR Parse Error:", err);
      showToast("Invalid QR Code format.", "delete");
    }
  };

  const initiateReturn = (log) => {
    setReturnModal({ show: true, log });
  };

  const confirmReturn = async () => {
    const { log } = returnModal;
    if (!log || !log.id) return;

    try {
      await updateDoc(doc(db, 'logs', log.id), {
        status: 'Returned',
        dateReturned: new Date().toLocaleString()
      });

      if (log.equipmentId) {
        const eqRef = doc(db, 'equipment', log.equipmentId);
        const eqSnap = await getDoc(eqRef);

        if (eqSnap.exists()) {
          const eqData = eqSnap.data();

          if (eqData.trackingType === 'bulk') {
            const restoredQty = (eqData.availableQuantity || 0) + (log.quantityBorrowed || 1);
            await updateDoc(eqRef, {
              availableQuantity: restoredQty,
              status: 'available'
            });
          } else {
            await updateDoc(eqRef, {
              status: 'available'
            });
          }
        }
      }

      setReturnModal({ show: false, log: null });
      showToast("Return processed successfully.");
    } catch (error) {
      console.error("Error processing return:", error);
      showToast("Error processing return.", 'delete');
      setReturnModal({ show: false, log: null });
    }
  };

  const initiateDelete = (logId) => {
    setDeleteModal({ show: true, logId });
  };

  const confirmDelete = async () => {
    const { logId } = deleteModal;
    if (!logId) return;
    try {
      await deleteDoc(doc(db, 'logs', logId));
      showToast("Log entry deleted permanently.", 'delete');
      setDeleteModal({ show: false, logId: null });
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Error deleting log.", 'delete');
      setDeleteModal({ show: false, logId: null });
    }
  };

  const activeCount = logs.filter(log => log.status === 'Active').length;
  const overdueCount = logs.filter(log => log.status === 'Active' && checkIsOverdue(log.expectedReturn)).length;

  const getToastStyle = () => {
    if (toast.type === 'delete') {
      return isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600';
    }
    return isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-900 border-slate-800 text-white';
  };

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 md:p-12 lg:p-16 flex flex-col items-center overflow-y-auto transition-colors duration-500 relative ${isDarkMode ? 'bg-[#050B14] text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: "'Google Sans', 'Product Sans', 'Segoe UI', system-ui, sans-serif" }}>

      <div className={`fixed bottom-4 sm:bottom-10 right-4 sm:right-10 z-[60] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-2xl border shadow-2xl transition-colors duration-300 flex items-center gap-3 ${getToastStyle()}`}>
          {toast.type === 'delete' && (
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mr-2">Error</span>
          )}
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase opacity-90">{toast.message}</span>
        </div>
      </div>

      {isScannerOpen && (
        <ScannerModal
          isDarkMode={isDarkMode}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {returnModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setReturnModal({ show: false, log: null })}></div>
          <div className={`relative w-full max-w-md p-6 sm:p-10 backdrop-blur-3xl border rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center ${isDarkMode ? 'bg-gradient-to-br from-white/10 to-[#050B14] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Confirm Return</h3>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>Verify that the equipment has been physically returned and inspected.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => setReturnModal({ show: false, log: null })} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border transition-all font-bold cursor-pointer ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={confirmReturn} className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#3852A4] text-white font-bold hover:bg-[#2e438a] transition-all cursor-pointer shadow-lg active:scale-95">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setDeleteModal({ show: false, logId: null })}></div>
          <div className={`relative w-full max-w-md p-6 sm:p-10 backdrop-blur-3xl border rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl text-center ${isDarkMode ? 'bg-gradient-to-br from-white/10 to-[#050B14] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Confirm Deletion</h3>
            <p className={`mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>This action is permanent.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => setDeleteModal({ show: false, logId: null })} className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl border transition-all font-bold cursor-pointer ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}>Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-bold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/dashboard')} className={`self-start text-base sm:text-xl transition-all mb-8 sm:mb-12 flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
        <span className="text-xl sm:text-3xl">←</span> Back to Dashboard
      </button>

      <div className="w-full max-w-7xl mb-8 sm:mb-12 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-normal mb-2 sm:mb-4">Borrow Logs</h1>
          <p className={`text-base sm:text-xl md:text-2xl uppercase tracking-wide font-bold ${isDarkMode ? 'text-blue-100/40' : 'text-slate-400'}`}>
            Live Activity Feed
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {overdueCount > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3.5 rounded-[1.25rem] animate-pulse whitespace-nowrap text-center">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wide">⚠️ {overdueCount} Overdue Item{overdueCount > 1 ? 's' : ''}</span>
            </div>
          )}

          {/* REDESIGNED: High Contrast Scan Button (No Icons, Sleek Typography) */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className={`px-8 py-3.5 rounded-[1.25rem] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all shadow-lg active:scale-95 text-center cursor-pointer border
              ${isDarkMode
                ? 'bg-white text-[#050B14] border-transparent hover:bg-slate-200'
                : 'bg-slate-900 text-white border-transparent hover:bg-slate-800'}`}
          >
            Scan to Return
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10">
        <div className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] flex justify-between items-center border transition-all ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
          <span className={`font-bold uppercase tracking-wide text-xs sm:text-sm ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Currently Out</span>
          <span className="text-4xl sm:text-5xl font-bold text-[#3B82F6] tracking-normal truncate">{activeCount}</span>
        </div>
        <div className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] flex justify-between items-center border transition-all ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
          <span className={`font-bold uppercase tracking-wide text-xs sm:text-sm ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Recent Records</span>
          <span className="text-4xl sm:text-5xl font-bold tracking-normal truncate">{logs.length}</span>
        </div>
      </div>

      <div className={`w-full max-w-7xl border rounded-[2rem] sm:rounded-[3rem] overflow-hidden transition-all ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/50'}`}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[900px]">
            <thead className={isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-50 text-slate-400'}>
              <tr className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                <th className="px-6 sm:px-8 py-6 sm:py-10 whitespace-nowrap">Borrower Info</th>
                <th className="px-6 sm:px-8 py-6 sm:py-10 whitespace-nowrap">Asset Name</th>
                <th className="px-6 sm:px-8 py-6 sm:py-10 whitespace-nowrap">Checked Out</th>
                <th className="px-6 sm:px-8 py-6 sm:py-10 text-center whitespace-nowrap">Status</th>
                <th className="px-6 sm:px-8 py-6 sm:py-10 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
              {loading ? (
                <tr><td colSpan="5" className="p-16 sm:p-32 text-center opacity-50 animate-pulse text-base sm:text-xl">Initializing Live Stream...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="p-16 sm:p-32 text-center opacity-50 text-base sm:text-xl">No borrowing activity recorded yet.</td></tr>
              ) : (
                logs.map((log) => {
                  const isOverdue = log.status === 'Active' && checkIsOverdue(log.expectedReturn);

                  return (
                    <tr key={log.id} className={`transition-all ${isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50'} ${isOverdue && isDarkMode ? 'bg-red-500/[0.02]' : isOverdue && !isDarkMode ? 'bg-red-50/50' : ''}`}>

                      <td className="px-6 sm:px-8 py-6 sm:py-8 whitespace-nowrap">
                        <span className="text-xl sm:text-2xl font-bold block mb-1">{log.borrowerName || log.studentName}</span>
                        <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase flex items-center gap-2 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                          {log.borrowerRole || 'Student'} • ID: {log.borrowerId || log.studentId}
                        </span>
                      </td>

                      <td className="px-6 sm:px-8 py-6 sm:py-8 text-lg sm:text-xl font-medium whitespace-nowrap">
                        {log.quantityBorrowed > 1 && <span className="font-bold text-[#3852A4] mr-2">{log.quantityBorrowed}x</span>}
                        {log.itemName}
                      </td>

                      <td className="px-6 sm:px-8 py-6 sm:py-8 whitespace-nowrap">
                        <span className={`block font-bold text-xs sm:text-sm mb-1 ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>{formatLogDate(log)}</span>
                        <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${isOverdue ? 'text-red-500' : isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
                          Due: {log.expectedReturn || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 sm:px-8 py-6 sm:py-8 text-center whitespace-nowrap">
                        <span className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-colors ${
                          isOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.15)]' :
                          log.status === 'Active' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                          log.status === 'Returned' ? 'bg-slate-500/20 text-slate-400' :
                          'bg-orange-500/10 text-orange-500'
                        }`}>
                          {isOverdue ? 'Overdue' : log.status}
                        </span>
                      </td>

                      <td className="px-6 sm:px-8 py-6 sm:py-8 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-4">
                          {log.status === 'Active' ? (
                            <button
                              onClick={() => initiateReturn(log)}
                              className={`px-6 py-2.5 rounded-full font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all shadow-sm active:scale-95 cursor-pointer border
                                ${isOverdue
                                  ? 'bg-red-500 text-white border-red-600 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                  : isDarkMode
                                    ? 'bg-white/[0.05] border-white/10 text-white hover:bg-white/10'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              Receive
                            </button>
                          ) : (
                            <div className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                              Returned <br/> {log.dateReturned?.split(',')[0]}
                            </div>
                          )}

                          <button
                            onClick={() => initiateDelete(log.id)}
                            className={`text-[10px] font-bold uppercase tracking-widest p-2 sm:p-2.5 rounded-full transition-all opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-500'}`}
                            title="Delete Log"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}