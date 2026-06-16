import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiCamera, FiLock, FiSave, FiCopy } from 'react-icons/fi';

export default function StudentProfile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    if (avatar) fd.append('avatar', avatar);
    dispatch(updateProfile(fd));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', pwdForm);
      toast.success('Password updated!');
      setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPwdLoading(false); }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    toast.success('Referral code copied!');
  };

  const planColors = { none: '#6b7280', basic: '#E91E8C', premium: '#9C27B0', vip: '#F59E0B' };
  const pc = planColors[user?.subscriptionPlan] || '#6b7280';

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        {/* Header card */}
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.07),rgba(123,45,139,0.07))', border: '1px solid rgba(233,30,140,0.15)' }}>
          <div className="relative">
            <img src={preview || `https://ui-avatars.com/api/?name=${user?.name}&background=E91E8C&color=fff&size=120`}
              alt="" className="w-24 h-24 rounded-2xl object-cover ring-2 ring-pink-500/40" />
            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
              <FiCamera size={14} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                style={{ background: `${pc}20`, border: `1px solid ${pc}40`, color: pc }}>
                {user?.subscriptionPlan || 'free'} plan
              </span>
              {user?.subscriptionActive && (
                <span className="text-xs text-green-400">
                  Active till {new Date(user.subscriptionExpiry).toLocaleDateString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
            <FiUser className="text-pink-400" size={18} /> Edit Profile
          </h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-beauty pl-10" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Email (read-only)</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input value={user?.email} disabled className="input-beauty pl-10 opacity-50 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input-beauty pl-10" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
              <FiSave size={15} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        {!user?.googleId && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <FiLock className="text-pink-400" size={18} /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">Current Password</label>
                <input type="password" value={pwdForm.currentPassword}
                  onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                  className="input-beauty" placeholder="••••••••" required />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">New Password</label>
                <input type="password" value={pwdForm.newPassword}
                  onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  className="input-beauty" placeholder="••••••••" required minLength={6} />
              </div>
              <button type="submit" disabled={pwdLoading}
                className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
                <FiLock size={15} /> {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Referral Code */}
        {user?.referralCode && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-3">🎁 Referral Program</h3>
            <p className="text-gray-400 text-sm mb-4">Share your code with friends and earn rewards when they subscribe!</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl font-mono text-pink-400 text-lg font-bold tracking-widest"
                style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.2)' }}>
                {user.referralCode}
              </div>
              <button onClick={copyReferral}
                className="p-3 rounded-xl glass text-gray-400 hover:text-white transition-colors">
                <FiCopy size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
