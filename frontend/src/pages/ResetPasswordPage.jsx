import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0D0010' }}>
      <div className="orb w-80 h-80 bg-purple-600 bottom-0 left-0" style={{ opacity: 0.08 }} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-pink-gradient flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">B</div>
          <h1 className="font-display text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2 text-sm">Enter your new password below.</p>
        </div>
        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input-beauty pl-11 pr-11" placeholder="Min 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="input-beauty pl-11" placeholder="Repeat password" required />
              </div>
              {confirm && password !== confirm && <p className="text-red-400 text-xs mt-1">Passwords don't match</p>}
            </div>
            <button type="submit" disabled={loading || password !== confirm} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
            <Link to="/login" className="block text-center text-gray-400 text-sm hover:text-pink-400 transition-colors">Back to Login</Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
