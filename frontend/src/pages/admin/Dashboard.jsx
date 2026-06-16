import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiUsers, FiDollarSign, FiCalendar, FiTrendingUp, FiArrowRight, FiStar } from 'react-icons/fi';

const Stat = ({ icon: Icon, label, value, sub, color }) => (
  <motion.div whileHover={{ y: -3 }} className="glass rounded-2xl p-5 relative overflow-hidden"
    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10" style={{ background: color }} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-3xl font-display font-bold text-white mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => {
      setStats(r.data.stats);
      setRecentPayments(r.data.recentPayments || []);
      setRecentStudents(r.data.recentStudents || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Welcome */}
        <div className="rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg,#1a0020,#3d0030)', border: '1px solid rgba(233,30,140,0.2)' }}>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Dashboard 👑</h1>
          <p className="text-pink-200 text-sm">Here's what's happening at Beauty Master Academy today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={FiUsers} label="Total Students" value={stats?.totalStudents || 0} color="#E91E8C" sub="Registered users" />
          <Stat icon={FiDollarSign} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} color="#10B981" sub="All time" />
          <Stat icon={FiStar} label="Active Subscribers" value={stats?.activeSubscribers || 0} color="#9C27B0" sub="With valid plans" />
          <Stat icon={FiCalendar} label="Total Classes" value={stats?.totalClasses || 0} color="#F59E0B" sub="All categories" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2"><FiDollarSign className="text-green-400" size={17} /> Recent Payments</h2>
              <Link to="/admin/payments" className="text-pink-400 text-xs flex items-center gap-1 hover:text-pink-300">View all <FiArrowRight size={12} /></Link>
            </div>
            {recentPayments.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm text-center">No payments yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentPayments.map(p => (
                  <div key={p._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                    <img
  src={s.avatar}
  alt={s.name}
  className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
  onError={(e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      s.name
    )}&background=9C27B0&color=fff&size=40`;
  }}
/>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.userId?.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{p.subscriptionPlan} plan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold text-sm">₹{p.amount}</p>
                      <p className="text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Students */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2"><FiUsers className="text-pink-400" size={17} /> New Students</h2>
              <Link to="/admin/students" className="text-pink-400 text-xs flex items-center gap-1 hover:text-pink-300">View all <FiArrowRight size={12} /></Link>
            </div>
            {recentStudents.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm text-center">No students yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentStudents.map(s => (
                  <div key={s._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                    <img src={s.avatar || `https://ui-avatars.com/api/?name=${s.name}&background=9C27B0&color=fff&size=40`}
                      alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{s.name}</p>
                      <p className="text-gray-400 text-xs truncate">{s.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ background: s.subscriptionActive ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)', color: s.subscriptionActive ? '#10B981' : '#9ca3af', border: `1px solid ${s.subscriptionActive ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)'}` }}>
                      {s.subscriptionActive ? s.subscriptionPlan : 'free'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Class', href: '/admin/classes', emoji: '📅', color: '#E91E8C' },
            { label: 'Upload Notes', href: '/admin/notes', emoji: '📄', color: '#9C27B0' },
            { label: 'Send Notification', href: '/admin/notifications', emoji: '🔔', color: '#F59E0B' },
            { label: 'Create Coupon', href: '/admin/coupons', emoji: '🎟️', color: '#10B981' },
          ].map(a => (
            <Link key={a.href} to={a.href}
              className="glass rounded-2xl p-5 text-center hover:scale-105 transition-transform"
              style={{ border: `1px solid ${a.color}20` }}>
              <div className="text-3xl mb-2">{a.emoji}</div>
              <p className="text-white text-sm font-medium">{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
