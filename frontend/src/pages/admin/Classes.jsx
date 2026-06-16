import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, createClass, updateClass, deleteClass } from '../../store/slices/classSlice';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar, FiClock, FiUser, FiLink } from 'react-icons/fi';

const EMPTY = { title: '', description: '', instructor: '', category: 'makeup', date: '', time: '', duration: 60, meetLink: '', requiredPlan: 'basic', tags: '' };

export default function AdminClasses() {
  const dispatch = useDispatch();
  const { list: classes, loading } = useSelector(s => s.classes);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [thumbnail, setThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { dispatch(fetchClasses({ limit: 50 })); }, [dispatch]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setThumbnail(null); setModal(true); };
  const openEdit = (cls) => {
    setEditing(cls._id);
    setForm({ ...cls, date: cls.date?.slice(0, 10) || '', tags: (cls.tags || []).join(', ') });
    setThumbnail(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
    if (thumbnail) fd.append('thumbnail', thumbnail);

    const action = editing
      ? dispatch(updateClass({ id: editing, formData: fd }))
      : dispatch(createClass(fd));

    const res = await action;
    setSaving(false);
    if (!res.error) { setModal(false); toast.success(editing ? 'Class updated!' : 'Class created!'); }
    else toast.error('Failed to save class');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    const res = await dispatch(deleteClass(id));
    if (!res.error) toast.success('Class deleted');
  };

  const statusBadge = (s) => {
    const map = { upcoming: 'text-blue-400 bg-blue-500/10', live: 'text-green-400 bg-green-500/10', completed: 'text-gray-400 bg-gray-500/10', cancelled: 'text-red-400 bg-red-500/10' };
    return map[s] || map.upcoming;
  };
  // console.log("FORM OBJECT:", form);

// const fd = new FormData();

// Object.entries(form).forEach(([k, v]) => {
//   if (v !== undefined && v !== null) {
//     fd.append(k, v);
//   }
// });

// for (const pair of fd.entries()) {
//   console.log(pair[0], pair[1]);
// }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg">Manage Classes</h2>
            <p className="text-gray-400 text-sm">{classes.length} total classes</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <FiPlus size={16} /> Add Class
          </button>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['Class', 'Category', 'Date & Time', 'Plan', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls, i) => (
                    <motion.tr key={cls._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-t border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=60'} alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium">{cls.title}</p>
                            <p className="text-gray-400 text-xs">{cls.instructor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm capitalize">{cls.category}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(cls.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1 text-xs"><FiClock size={11} /> {cls.time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-pink-300">{cls.requiredPlan}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(cls.status)}`}>{cls.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(cls)} className="p-2 rounded-lg glass text-blue-400 hover:text-blue-300 transition-colors"><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDelete(cls._id)} className="p-2 rounded-lg glass text-red-400 hover:text-red-300 transition-colors"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {classes.length === 0 && (
                <p className="text-center py-10 text-gray-400">No classes found. Create your first class!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
              style={{ background: '#0D0018', border: '1px solid rgba(233,30,140,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Class' : 'Create Class'}</h3>
                <button onClick={() => setModal(false)} className="p-2 rounded-lg glass text-gray-400 hover:text-white"><FiX size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Class Title *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-beauty" placeholder="e.g. Advanced Bridal Makeup" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Description *</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      className="input-beauty resize-none" rows={3} placeholder="Class description..." required />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Instructor *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className="input-beauty pl-9" placeholder="Instructor name" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {['bridal', 'skincare', 'hair', 'nail', 'makeup', 'eyebrow', 'mehndi', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Date *</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-beauty pl-9" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Time *</label>
                    <div className="relative">
                      <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="input-beauty pl-9" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Duration (mins)</label>
                    <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="input-beauty" min={15} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Required Plan</label>
                    <select value={form.requiredPlan} onChange={e => setForm({ ...form, requiredPlan: e.target.value })} className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {['basic', 'premium', 'vip'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Google Meet Link *</label>
                    <div className="relative">
                      <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input value={form.meetLink} onChange={e => setForm({ ...form, meetLink: e.target.value })} className="input-beauty pl-9" placeholder="https://meet.google.com/xxx-xxxx-xxx" required />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Tags (comma-separated)</label>
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-beauty" placeholder="bridal, luxury, wedding" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {['upcoming', 'live', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Thumbnail Image</label>
                    <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])}
                      className="input-beauty text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-pink-500/20 file:text-pink-400 file:text-xs" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                    {saving ? 'Saving...' : editing ? 'Update Class' : 'Create Class'}
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
