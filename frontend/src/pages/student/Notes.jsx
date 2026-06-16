import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiBook, FiDownload, FiSearch, FiFilter, FiExternalLink } from 'react-icons/fi';

const TYPE_COLORS = {
  notes: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  assignment: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  guide: 'text-green-400 bg-green-500/10 border-green-500/20',
  other: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function StudentNotes() {
  const { user } = useSelector(s => s.auth);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

const isSubscribed =
  user?.subscriptionActive &&
  user?.subscriptionPlan !== "none";

console.log("USER:", user);
console.log("PLAN:", user?.subscriptionPlan);
console.log("ACTIVE:", user?.subscriptionActive);
console.log("SUBSCRIBED:", isSubscribed);
  useEffect(() => {
    api.get('/notes').then(r => { setNotes(r.data.notes || []); setLoading(false); });
  }, []);

  const handleDownload = async (note) => {
    if (!isSubscribed) { toast.error('Subscribe to download notes'); return; }
    await api.post(`/notes/${note._id}/download`);
    window.open(note.pdfUrl, '_blank');
    toast.success('Download started!');
  };

  const filtered = notes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.classId?.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || n.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Controls */}
        <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
              className="input-beauty pl-10 py-2.5 text-sm w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'notes', 'assignment', 'guide', 'other'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${typeFilter === t ? 'text-white' : 'text-gray-400 glass hover:text-white'}`}
                style={typeFilter === t ? { background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' } : {}}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {!isSubscribed && (
          <div className="glass rounded-2xl p-5 border border-pink-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">🔒 Notes are locked</p>
              <p className="text-gray-400 text-sm mt-1">Subscribe to download all study materials and PDFs.</p>
            </div>
            <a href="/pricing" className="btn-primary text-sm px-5 py-2 whitespace-nowrap">Unlock Now</a>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl p-5 h-36 shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FiBook size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No notes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((note, i) => (
              <motion.div key={note._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl p-5 hover:border-pink-500/20 transition-all group"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <FiBook className="text-pink-400" size={20} />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${TYPE_COLORS[note.type] || TYPE_COLORS.other}`}>
                    {note.type}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{note.title}</h3>
                {note.description && <p className="text-gray-400 text-xs mb-2 line-clamp-2">{note.description}</p>}
                <p className="text-gray-500 text-xs mb-4">Class: {note.classId?.title || '—'}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDownload(note)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${isSubscribed ? 'text-white hover:opacity-90' : 'text-gray-500 bg-white/5 cursor-not-allowed'}`}
                    style={isSubscribed ? { background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' } : {}}>
                    <FiDownload size={13} /> {isSubscribed ? 'Download' : 'Locked'}
                  </button>
                  {isSubscribed && (
                    <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2.5 rounded-xl glass text-gray-400 hover:text-white transition-colors">
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
