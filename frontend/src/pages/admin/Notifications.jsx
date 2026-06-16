// Admin Notifications
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiBell, FiSend } from 'react-icons/fi';

export default function AdminNotifications() {
  const [form, setForm] = useState({ title: '', message: '', type: 'info', isGlobal: true });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/notifications/send', form);
      toast.success('Notification sent!');
      setSent(prev => [{ ...form, createdAt: new Date() }, ...prev]);
      setForm({ title: '', message: '', type: 'info', isGlobal: true });
    } catch { toast.error('Failed to send'); }
    finally { setSending(false); }
  };

  const typeColors = { info: '#3b82f6', success: '#10b981', warning: '#eab308', class: '#E91E8C', payment: '#9C27B0' };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2"><FiBell className="text-pink-400" size={18} /> Send Notifications</h2>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-beauty" placeholder="Notification title" required />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Message *</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="input-beauty resize-none" rows={4} placeholder="Notification message..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {['info', 'success', 'warning', 'class', 'payment'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Audience</label>
                <select value={form.isGlobal} onChange={e => setForm({ ...form, isGlobal: e.target.value === 'true' })}
                  className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <option value="true">All Students</option>
                  <option value="false">Specific User</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={sending} className="btn-primary flex items-center gap-2 text-sm py-3 px-6">
              <FiSend size={15} /> {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {sent.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white font-medium mb-3 text-sm">Recently Sent</h3>
            <div className="space-y-2">
              {sent.map((n, i) => {
                const tc = typeColors[n.type] || '#3b82f6';
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${tc}10`, border: `1px solid ${tc}20` }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: tc }} />
                    <div>
                      <p className="text-white text-sm font-medium">{n.title}</p>
                      <p className="text-gray-400 text-xs">{n.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
