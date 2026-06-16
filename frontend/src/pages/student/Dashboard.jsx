import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  FiCalendar, FiBook, FiAward, FiTrendingUp, FiClock,
  FiPlay, FiDownload, FiArrowRight, FiBell, FiCheckCircle
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-5 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-4 translate-x-4`}
      style={{ background: color }} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export default function StudentDashboard() {
  const { user } = useSelector(s => s.auth);
  const [data, setData] = useState({ classes: [], notes: [], attendance: null, notifications: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clsRes, notesRes, attRes, notifRes] = await Promise.all([
          api.get('/classes?status=upcoming&limit=3'),
          api.get('/notes?limit=3').catch(() => ({ data: { notes: [] } })),
          api.get('/attendance/my').catch(() => ({ data: { attended: 0, totalClasses: 0, percentage: 0 } })),
          api.get('/notifications').catch(() => ({ data: { notifications: [] } })),
        ]);
        setData({
          classes: clsRes.data.classes || [],
          notes: notesRes.data.notes || [],
          attendance: attRes.data,
          notifications: notifRes.data.notifications || [],
        });
      } catch (e) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const isSubscribed = user?.subscriptionActive && new Date(user?.subscriptionExpiry) > new Date();
  const planColors = { none: '#6b7280', basic: '#E91E8C', premium: '#9C27B0', vip: '#F59E0B' };
  const planColor = planColors[user?.subscriptionPlan] || '#6b7280';

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0020 0%, #3d0030 50%, #1a0020 100%)', border: '1px solid rgba(233,30,140,0.2)' }}>
          <div className="orb w-64 h-64 bg-pink-600 -right-20 -top-20" style={{ opacity: 0.2 }} />
          <div className="orb w-48 h-48 bg-purple-600 -left-10 -bottom-10" style={{ opacity: 0.15 }} />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=E91E8C&color=fff&size=80`}
                alt="" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-pink-500/40" />
              <div>
                <p className="text-pink-300 text-sm font-medium">Welcome back 💄</p>
                <h1 className="font-display text-3xl font-bold text-white">{user?.name}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: `${planColor}20`, border: `1px solid ${planColor}40`, color: planColor }}>
                <span className="w-2 h-2 rounded-full" style={{ background: planColor }} />
                {user?.subscriptionPlan?.toUpperCase() || 'FREE'} Plan
              </span>
              {isSubscribed && (
                <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs text-green-400 bg-green-500/10 border border-green-500/20">
                  <FiCheckCircle size={12} /> Active till {new Date(user.subscriptionExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FiCalendar} label="Upcoming Classes" value={data.classes.length} color="#E91E8C" sub="This week" />
          <StatCard icon={FiBook} label="Notes Available" value={data.notes.length} color="#9C27B0" sub="Download anytime" />
          <StatCard icon={FiTrendingUp} label="Attendance" value={`${data.attendance?.percentage || 0}%`} color="#10B981" sub={`${data.attendance?.attended || 0} classes attended`} />
          <StatCard icon={FiAward} label="Certificates" value="—" color="#F59E0B" sub="Earn by completing courses" />
        </div>

        {/* Subscription CTA */}
        {!isSubscribed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.12) 0%, rgba(123,45,139,0.12) 100%)', border: '1px solid rgba(233,30,140,0.25)' }}>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Unlock All Features 🌸</h3>
              <p className="text-gray-400 text-sm">Subscribe to join live classes, download notes & earn certificates.</p>
            </div>
            <Link to="/pricing" className="btn-primary text-sm px-6 py-3 whitespace-nowrap">View Plans</Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Upcoming Classes</h2>
              <Link to="/my-classes" className="text-pink-400 text-sm hover:text-pink-300 flex items-center gap-1">View all <FiArrowRight size={14} /></Link>
            </div>
            {data.classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiCalendar size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming classes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.classes.map(cls => (
                  <div key={cls._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{cls.title}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">
                        <FiCalendar size={11} /> {new Date(cls.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        <FiClock size={11} /> {cls.time}
                      </p>
                    </div>
                    {isSubscribed ? (
                      <a href={cls.meetLink} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors">
                        <FiPlay size={14} />
                      </a>
                    ) : (
                      <Link to="/pricing" className="flex-shrink-0 text-xs text-pink-400 hover:text-pink-300">Subscribe</Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notes */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Recent Notes</h2>
              <Link to="/my-notes" className="text-pink-400 text-sm hover:text-pink-300 flex items-center gap-1">View all <FiArrowRight size={14} /></Link>
            </div>
            {data.notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiBook size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No notes uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.notes.map(note => (
                  <div key={note._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <FiBook className="text-purple-400" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{note.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 capitalize">{note.type} • {note.classId?.title || 'Class'}</p>
                    </div>
                    {isSubscribed && (
                      <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer"
                        onClick={() => api.post(`/notes/${note._id}/download`)}
                        className="flex-shrink-0 p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors">
                        <FiDownload size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {data.notifications.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <FiBell className="text-pink-400" size={18} />
              <h2 className="text-white font-semibold text-lg">Recent Notifications</h2>
            </div>
            <div className="space-y-2">
              {data.notifications.slice(0, 4).map(n => (
                <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!n.read ? 'bg-pink-500/5 border border-pink-500/10' : 'hover:bg-white/5'}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.read ? 'bg-gray-600' : 'bg-pink-500'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{n.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
