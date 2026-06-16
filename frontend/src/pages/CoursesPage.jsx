import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiCalendar, FiClock, FiUser, FiFilter, FiPlay } from 'react-icons/fi';

const CATEGORIES = ['all', 'bridal', 'skincare', 'hair', 'nail', 'makeup', 'eyebrow', 'mehndi'];

export default function CoursesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (status !== 'all') params.status = status;
    const q = new URLSearchParams({ ...params, limit: 30 }).toString();
    api.get(`/classes?${q}`).then(r => { setClasses(r.data.classes || []); setLoading(false); });
  }, [category, status]);

  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="badge mb-4">Live Classes</span>
          <h1 className="section-title text-white mb-4">All <span className="gradient-text">Beauty Courses</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">Master every aspect of beauty with our expert-led live courses.</p>
        </motion.div>

        {/* Filters */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiFilter size={14} /> Filter:
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'upcoming', 'live', 'completed'].map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${status === s ? 'text-white' : 'text-gray-400 glass hover:text-white'}`}
                style={status === s ? { background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' } : {}}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${category === c ? 'text-pink-400 bg-pink-500/15 border border-pink-500/30' : 'text-gray-400 glass hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <div className="h-48 shimmer" />
                <div className="p-5 space-y-2">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <p className="text-gray-400">No classes found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, i) => (
              <motion.div key={cls._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl overflow-hidden group card-hover">
                <div className="relative h-48 overflow-hidden">
                  <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500'} alt={cls.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge capitalize">{cls.category}</span>
                  </div>
                  {cls.status === 'live' && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/80 text-white text-xs">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{cls.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{cls.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-5">
                    <span className="flex items-center gap-1"><FiUser size={12} /> {cls.instructor}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(cls.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {cls.time}</span>
                  </div>
                 <Link
  to="/checkout/basic"
  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
  style={{ background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' }}
>
  <FiPlay size={14} />
  Buy Course
</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
