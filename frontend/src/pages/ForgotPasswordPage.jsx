import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0010' }}>
      <div className="orb w-80 h-80 bg-pink-600 top-0 right-0" style={{ opacity: 0.08 }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-pink-gradient flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">B</div>
          <h1 className="font-display text-2xl font-bold text-white">Forgot Password?</h1>
          <p className="text-gray-400 mt-2 text-sm">No worries — we'll send a reset link to your email.</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-green-400" size={28} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Check Your Email</h3>
              <p className="text-gray-400 text-sm mb-6">We've sent a password reset link to <span className="text-pink-400">{email}</span>. The link expires in 15 minutes.</p>
              <Link to="/login" className="btn-primary text-sm px-6 py-2.5 inline-block">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-beauty pl-11" placeholder="your@email.com" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                <FiArrowLeft size={14} /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
