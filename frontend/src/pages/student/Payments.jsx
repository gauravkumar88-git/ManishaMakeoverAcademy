import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiCreditCard, FiCheckCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';

export default function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/my-payments').then(r => { setPayments(r.data.payments || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const planColors = { basic: '#E91E8C', premium: '#9C27B0', vip: '#F59E0B' };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Payment History</h2>
          <Link to="/pricing" className="btn-primary text-sm py-2 px-5">Upgrade Plan</Link>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : payments.length === 0 ? (
          <div className="glass rounded-2xl p-14 text-center">
            <FiCreditCard size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">No payments yet</p>
            <Link to="/pricing" className="btn-primary text-sm px-6 inline-flex items-center gap-2">
              View Plans <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p, i) => {
              const pc = planColors[p.subscriptionPlan] || '#E91E8C';
              return (
                <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-5 flex items-center gap-4"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${pc}20`, border: `1px solid ${pc}30` }}>
                    <FiCheckCircle style={{ color: pc }} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium capitalize">{p.subscriptionPlan} Plan</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {p.razorpayPaymentId && <span className="font-mono">ID: {p.razorpayPaymentId.slice(0, 18)}...</span>}
                      {p.couponCode && <span className="text-green-400">Coupon: {p.couponCode}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-lg">₹{p.amount}</p>
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Paid</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
