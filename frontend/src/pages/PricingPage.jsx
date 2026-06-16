import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiCheck, FiTag } from 'react-icons/fi';

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: 499, emoji: '🌸', color: '#E91E8C',
    features: ['Live Classes Access', 'PDF Notes Download', 'Attendance Tracking', 'Community Access', 'Basic Support'],
  },
  {
    id: 'premium', name: 'Premium', price: 999, emoji: '💎', color: '#9C27B0', popular: true,
    features: ['Everything in Basic', 'Class Recordings', 'Premium Content Library', 'Priority Support', 'Exclusive Workshops'],
  },
  {
    id: 'vip', name: 'VIP', price: 1999, emoji: '👑', color: '#F59E0B',
    features: ['Everything in Premium', 'One-to-One Mentorship', 'Exclusive Live Sessions', 'Career Placement Help', 'Lifetime Access to Recordings'],
  },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. Your access continues until the end of the billing period.' },
  { q: 'Are the classes pre-recorded or live?', a: 'All classes are conducted live via Google Meet with real-time interaction with instructors.' },
  { q: 'What payment methods are accepted?', a: 'We accept all UPI apps, credit/debit cards, net banking, and wallets via Razorpay.' },
  { q: 'Is there a refund policy?', a: 'We offer a 7-day money-back guarantee if you\'re not satisfied with the course content.' },
  { q: 'Can I upgrade my plan later?', a: 'Absolutely! You can upgrade your plan anytime and enjoy enhanced features immediately.' },
];

export default function PricingPage() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const validateCoupon = async (plan) => {
    if (!coupon.trim()) return null;
    setValidatingCoupon(true);
    try {
      const res = await api.post('/payments/validate-coupon', { code: coupon, plan });
      setCouponData(res.data.coupon);
      toast.success(`Coupon applied! ₹${res.data.coupon.discount} off`);
      return res.data.coupon;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
      return null;
    } finally { setValidatingCoupon(false); }
  };

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setProcessingPlan(plan.id);

    try {
      const orderRes = await api.post('/payments/create-order', { plan: plan.id, couponCode: coupon || undefined });
      const { order, key, payment: paymentDbId } = orderRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Beauty Master Academy',
        description: `${plan.name} Plan - 30 Days`,
        order_id: order.id,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#E91E8C' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.id,
              paymentDbId,
            });
            toast.success('🎉 Subscription activated!');
            navigate('/dashboard');
          } catch { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => setProcessingPlan(null) },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay not loaded. Please refresh the page.');
        setProcessingPlan(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
      setProcessingPlan(null);
    }
  };

  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20">
      {/* Load Razorpay script */}
      {!window.Razorpay && (
        <script src="https://checkout.razorpay.com/v1/checkout.js" />
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="badge mb-4">Subscription Plans</span>
          <h1 className="section-title text-white mb-4">Invest in Your <span className="gradient-text">Beauty Career</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">All plans include a 7-day money-back guarantee. No hidden fees. Cancel anytime.</p>
        </motion.div>

        {/* Coupon */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-10">
          <div className="glass rounded-2xl p-4 flex gap-3">
            <div className="relative flex-1">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="Have a coupon code?" className="input-beauty pl-9 py-2.5 text-sm w-full" />
            </div>
            <button onClick={() => validateCoupon(PLANS[0].id)} disabled={validatingCoupon || !coupon}
              className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
              {validatingCoupon ? '...' : 'Apply'}
            </button>
          </div>
          {couponData && (
            <p className="text-green-400 text-sm text-center mt-2">✓ {couponData.discountValue}{couponData.discountType === 'percentage' ? '%' : '₹'} discount applied</p>
          )}
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {PLANS.map((plan, i) => {
            const discount = couponData?.discountType === 'percentage'
              ? Math.floor(plan.price * couponData.discountValue / 100)
              : (couponData?.discountValue || 0);
            const finalPrice = Math.max(plan.price - discount, 0);

            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`glass rounded-3xl p-8 relative flex flex-col ${plan.popular ? 'ring-2 ring-pink-500/50 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-beauty"
                      style={{ background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' }}>Most Popular</span>
                  </div>
                )}

                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h2 className="text-white text-2xl font-display font-bold mb-2">{plan.name}</h2>

                <div className="mb-6">
                  {couponData ? (
                    <div>
                      <span className="text-gray-500 line-through text-lg">₹{plan.price}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-display font-bold text-white">₹{finalPrice}</span>
                        <span className="text-gray-400 text-sm">/month</span>
                      </div>
                      <span className="text-green-400 text-xs">You save ₹{discount}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold text-white">₹{plan.price}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}>
                        <FiCheck size={11} style={{ color: plan.color }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingPlan === plan.id || (user?.subscriptionPlan === plan.id && user?.subscriptionActive)}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                    user?.subscriptionPlan === plan.id && user?.subscriptionActive
                      ? 'text-green-400 bg-green-500/10 border border-green-500/20 cursor-default'
                      : plan.popular
                      ? 'text-white hover:opacity-90'
                      : 'btn-outline'
                  }`}
                  style={plan.popular && !(user?.subscriptionPlan === plan.id && user?.subscriptionActive)
                    ? { background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' }
                    : {}}>
                  {processingPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                    </span>
                  ) : user?.subscriptionPlan === plan.id && user?.subscriptionActive
                    ? '✓ Current Plan'
                    : `Subscribe to ${plan.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center section-title text-white mb-10">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-medium text-sm">{item.q}</span>
                  <span className={`text-pink-400 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                    className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                    {item.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
