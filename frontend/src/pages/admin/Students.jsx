// Admin Students page
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiUsers, FiMail } from 'react-icons/fi';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async (q = '') => {
    setLoading(true);
    const res = await api.get(`/admin/students?limit=50${q ? `&search=${q}` : ''}`);
    setStudents(res.data.students || []);
    setTotal(res.data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student? This cannot be undone.')) return;
    await api.delete(`/admin/students/${id}`);
    setStudents(prev => prev.filter(s => s._id !== id));
    toast.success('Student deleted');
  };

  const planColors = { none: '#6b7280', basic: '#E91E8C', premium: '#9C27B0', vip: '#F59E0B' };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><FiUsers className="text-pink-400" size={18} /> Students</h2>
            <p className="text-gray-400 text-sm">{total} registered students</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                className="input-beauty pl-9 py-2 text-sm w-56" />
            </div>
            <button type="submit" className="btn-primary text-sm py-2 px-4">Search</button>
          </form>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Student', 'Email', 'Phone', 'Plan', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">Loading...</td></tr>
                ) : students.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">No students found</td></tr>
                ) : students.map((s, i) => {
                  const pc = planColors[s.subscriptionPlan] || '#6b7280';
                  return (
                    <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.avatar || `https://ui-avatars.com/api/?name=${s.name}&background=E91E8C&color=fff&size=40`} alt=""
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          <span className="text-white text-sm font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{s.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{s.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ background: `${pc}18`, color: pc, border: `1px solid ${pc}30` }}>
                          {s.subscriptionPlan || 'free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <a href={`mailto:${s.email}`} className="p-2 rounded-lg glass text-blue-400 hover:text-blue-300 transition-colors"><FiMail size={14} /></a>
                          <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg glass text-red-400 hover:text-red-300 transition-colors"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
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
