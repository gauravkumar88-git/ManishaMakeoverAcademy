import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiBook, FiX, FiPlus } from 'react-icons/fi';

export default function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ classId: '', title: '', description: '', type: 'notes' });
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/notes'),
      api.get('/classes?limit=100'),
    ]).then(([notesRes, clsRes]) => {
      setNotes(notesRes.data.notes || []);
      setClasses(clsRes.data.classes || []);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) { toast.error('Please select a PDF file'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('pdf', pdfFile);
    try {
      const res = await api.post('/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNotes(prev => [res.data.note, ...prev]);
      toast.success('Notes uploaded!');
      setModal(false);
      setForm({ classId: '', title: '', description: '', type: 'notes' });
      setPdfFile(null);
    } catch { toast.error('Upload failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(n => n._id !== id));
    toast.success('Note deleted');
  };

  const typeColors = { notes: '#3b82f6', assignment: '#eab308', guide: '#10b981', other: '#9C27B0' };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><FiBook className="text-pink-400" size={18} /> Notes & PDFs</h2>
            <p className="text-gray-400 text-sm">{notes.length} files uploaded</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <FiPlus size={16} /> Upload Notes
          </button>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.length === 0 ? (
              <div className="col-span-3 glass rounded-2xl p-12 text-center">
                <FiBook size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No notes uploaded yet</p>
              </div>
            ) : notes.map((note, i) => {
              const tc = typeColors[note.type] || '#9C27B0';
              return (
                <motion.div key={note._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${tc}20` }}>
                      <FiBook style={{ color: tc }} size={20} />
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ background: `${tc}15`, color: tc, border: `1px solid ${tc}30` }}>{note.type}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">{note.title}</h3>
                  <p className="text-gray-400 text-xs mb-1">{note.description}</p>
                  <p className="text-gray-500 text-xs mb-4">Class: {note.classId?.title || '—'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{note.downloads} downloads</span>
                    <div className="flex gap-2">
                      <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg glass text-blue-400 hover:text-blue-300 text-xs transition-colors">View</a>
                      <button onClick={() => handleDelete(note._id)}
                        className="p-1.5 rounded-lg glass text-red-400 hover:text-red-300 transition-colors"><FiTrash2 size={13} /></button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0D0018', border: '1px solid rgba(233,30,140,0.2)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-semibold text-lg">Upload Notes</h3>
                <button onClick={() => setModal(false)} className="p-2 rounded-lg glass text-gray-400 hover:text-white"><FiX size={16} /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Select Class *</label>
                  <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}
                    className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }} required>
                    <option value="">Choose a class...</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-beauty" placeholder="e.g. Bridal Makeup Notes" required />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="input-beauty resize-none" rows={2} placeholder="Brief description..." />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {['notes', 'assignment', 'guide', 'other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">PDF File *</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-pink-500/40 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('pdf-input').click()}>
                    <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">{pdfFile ? pdfFile.name : 'Click to upload PDF'}</p>
                    <input id="pdf-input" type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} className="hidden" />
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                    {saving ? 'Uploading...' : 'Upload'}
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
