import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiDollarSign, FiSearch } from 'react-icons/fi';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/payments').then(r => { setPayments(r.data.payments || []); setLoading(false); });
  }, []);

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const planColors = { basic: '#E91E8C', premium: '#9C27B0', vip: '#F59E0B' };

  const filtered = payments.filter(p =>
    p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.subscriptionPlan?.includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><FiDollarSign className="text-green-400" size={18} /> Payments</h2>
            <p className="text-gray-400 text-sm">{payments.length} transactions • Total: ₹{total.toLocaleString('en-IN')}</p>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..."
              className="input-beauty pl-9 py-2 text-sm w-56" />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {['basic', 'premium', 'vip'].map(plan => {
            const count = payments.filter(p => p.subscriptionPlan === plan);
            const rev = count.reduce((s, p) => s + p.amount, 0);
            const pc = planColors[plan];
            return (
              <div key={plan} className="glass rounded-2xl p-4" style={{ border: `1px solid ${pc}20` }}>
                <p className="text-xs capitalize text-gray-400 mb-1">{plan} Plan</p>
                <p className="text-xl font-bold text-white">{count.length} <span className="text-sm text-gray-400">orders</span></p>
                <p className="text-sm mt-1" style={{ color: pc }}>₹{rev.toLocaleString('en-IN')}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Student', 'Plan', 'Amount', 'Payment ID', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="py-10 text-center text-gray-400">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-gray-400">No payments</td></tr>
                : filtered.map((p, i) => {
                  const pc = planColors[p.subscriptionPlan] || '#E91E8C';
                  return (
                    <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={p.userId?.avatar || `https://ui-avatars.com/api/?name=${p.userId?.name}&background=E91E8C&color=fff&size=36`} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-white text-sm">{p.userId?.name}</p>
                            <p className="text-gray-400 text-xs">{p.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ background: `${pc}18`, color: pc, border: `1px solid ${pc}30` }}>
                          {p.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-green-400 font-semibold text-sm">₹{p.amount}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{p.razorpayPaymentId ? p.razorpayPaymentId.slice(0, 16) + '...' : '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs text-green-400 bg-green-500/10 border border-green-500/20">Paid</span></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
