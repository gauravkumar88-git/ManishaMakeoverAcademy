import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiBarChart2, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function StudentAttendance() {
  const [data, setData] = useState({ attendance: [], totalClasses: 0, attended: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/my').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const pct = data.percentage || 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Circular progress */}
          <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140" className="mb-3">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="70" cy="70" r={radius} fill="none" stroke="url(#grad)" strokeWidth="10"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E91E8C" />
                  <stop offset="100%" stopColor="#9C27B0" />
                </linearGradient>
              </defs>
              <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="22" fontWeight="bold">{pct}%</text>
              <text x="70" y="88" textAnchor="middle" fill="#9ca3af" fontSize="10">Attendance</text>
            </svg>
            <p className="text-white font-semibold">Overall Attendance</p>
            <p className="text-gray-400 text-sm mt-1">{data.attended} / {data.totalClasses} classes</p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center mb-3">
              <FiCheckCircle className="text-green-400" size={22} />
            </div>
            <p className="text-3xl font-display font-bold text-white">{data.attended}</p>
            <p className="text-gray-400 text-sm mt-1">Classes Attended</p>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mb-3">
              <FiXCircle className="text-red-400" size={22} />
            </div>
            <p className="text-3xl font-display font-bold text-white">{Math.max(0, data.totalClasses - data.attended)}</p>
            <p className="text-gray-400 text-sm mt-1">Classes Missed</p>
          </div>
        </div>

        {/* Records Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <FiCalendar className="text-pink-400" size={18} /> Attendance Records
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : data.attendance.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FiBarChart2 size={40} className="mx-auto mb-3 opacity-40" />
              <p>No attendance records yet. Join a class to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase">Class</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase">Date</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase">Join Time</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attendance.map((rec, i) => (
                    <motion.tr key={rec._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-t border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 text-white text-sm">{rec.classId?.title || '—'}</td>
                      <td className="px-5 py-4 text-gray-400 text-sm">
                        {rec.classId?.date ? new Date(rec.classId.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm flex items-center gap-1">
                        <FiClock size={13} /> {new Date(rec.joinTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          rec.status === 'present' ? 'text-green-400 bg-green-500/10 border border-green-500/20' :
                          rec.status === 'late' ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' :
                          'text-red-400 bg-red-500/10 border border-red-500/20'
                        }`}>{rec.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
