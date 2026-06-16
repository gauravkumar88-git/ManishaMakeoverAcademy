import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiTag, FiPlus, FiX, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '', maxUses: 100, validTill: '', isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/coupons').then(r => setCoupons(r.data.coupons || []));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/admin/coupons', { ...form, discountValue: Number(form.discountValue), maxUses: Number(form.maxUses) });
      setCoupons(prev => [res.data.coupon, ...prev]);
      toast.success('Coupon created!');
      setModal(false);
      setForm(EMPTY);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    const res = await api.patch(`/admin/coupons/${id}/toggle`);
    setCoupons(prev => prev.map(c => c._id === id ? res.data.coupon : c));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><FiTag className="text-pink-400" size={18} /> Coupon Codes</h2>
            <p className="text-gray-400 text-sm">{coupons.length} coupons</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <FiPlus size={16} /> Create Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.length === 0 ? (
            <div className="col-span-3 glass rounded-2xl p-12 text-center text-gray-400">
              <FiTag size={40} className="mx-auto mb-3 opacity-40" />
              No coupons yet
            </div>
          ) : coupons.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5" style={{ border: `1px solid ${c.isActive ? 'rgba(233,30,140,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-lg font-bold text-pink-400">{c.code}</span>
                <button onClick={() => handleToggle(c._id)} className={`transition-colors ${c.isActive ? 'text-green-400' : 'text-gray-500'}`}>
                  {c.isActive ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                </button>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-white font-medium">
                    {c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'} off
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Used</span>
                  <span className="text-white">{c.usedCount} / {c.maxUses}</span>
                </div>
                {c.validTill && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires</span>
                    <span className="text-white text-xs">{new Date(c.validTill).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${Math.min((c.usedCount / c.maxUses) * 100, 100)}%`, background: 'linear-gradient(90deg,#E91E8C,#9C27B0)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0D0018', border: '1px solid rgba(233,30,140,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg">Create Coupon</h3>
                <button onClick={() => setModal(false)} className="p-2 rounded-lg glass text-gray-400 hover:text-white"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Code *</label>
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="input-beauty font-mono uppercase" placeholder="e.g. BEAUTY20" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Type</label>
                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}
                      className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Value *</label>
                    <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                      className="input-beauty" placeholder={form.discountType === 'percentage' ? '20' : '100'} min={1} required />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                    className="input-beauty" min={1} />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Valid Till</label>
                  <input type="date" value={form.validTill} onChange={e => setForm({ ...form, validTill: e.target.value })} className="input-beauty" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                    {saving ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
