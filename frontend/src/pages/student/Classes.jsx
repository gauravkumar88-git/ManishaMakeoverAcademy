import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUser, FiPlay, FiVideo, FiLock, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['all', 'bridal', 'skincare', 'hair', 'nail', 'makeup', 'eyebrow', 'mehndi'];
const STATUS = ['all', 'upcoming', 'live', 'completed'];

export default function StudentClasses() {
  const { user } = useSelector(s => s.auth);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const isSubscribed = user?.subscriptionActive;
  const canAccessClass = (requiredPlan) => {
  const plans = {
    basic: 1,
    premium: 2,
    vip: 3,
  };

  const userPlan = plans[user?.subscriptionPlan] || 0;
  const classPlan = plans[requiredPlan] || 0;

  return userPlan >= classPlan;
};
  console.log("USER DATA:", user);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const params = {};
      if (category !== 'all') params.category = category;
      if (status !== 'all') params.status = status;
      const q = new URLSearchParams(params).toString();
      const res = await api.get(`/classes?${q}&limit=20`);
      setClasses(res.data.classes);
      setLoading(false);
    };
    fetch();
  }, [category, status]);

const handleJoin = async (cls) => {
  try {
    console.log("Joining class:", cls._id);

    const res = await api.post(`/classes/${cls._id}/join`);

    console.log("JOIN RESPONSE:", res.data);

    window.open(res.data.meetLink, "_blank");
  } catch (err) {
    console.log("JOIN ERROR:", err.response?.data);
    toast.error(err.response?.data?.message || "Cannot join class");
  }
};;

  const statusColors = { upcoming: 'text-blue-400 bg-blue-500/10 border-blue-500/20', live: 'text-green-400 bg-green-500/10 border-green-500/20', completed: 'text-gray-400 bg-gray-500/10 border-gray-500/20', cancelled: 'text-red-400 bg-red-500/10 border-red-500/20' };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div className="glass rounded-2xl p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <FiFilter size={14} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${status === s ? 'text-white' : 'text-gray-400 hover:text-white glass'}`}
                  style={status === s ? { background: 'linear-gradient(135deg, #E91E8C, #9C27B0)' } : {}}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${category === c ? 'text-pink-400 bg-pink-500/15 border border-pink-500/30' : 'text-gray-400 hover:text-white glass'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <div className="h-44 shimmer" />
                <div className="p-5 space-y-2">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <FiCalendar size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {classes.map((cls, i) => (
              <motion.div key={cls._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden hover:border-pink-500/20 transition-all group"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500'} alt={cls.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[cls.status] || statusColors.upcoming}`}>{cls.status}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium border border-white/20 text-white/70 capitalize">{cls.category}</span>
                  </div>
                  {cls.status === 'live' && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/80 text-white text-xs">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-1 line-clamp-1">{cls.title}</h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{cls.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><FiUser size={12} /> {cls.instructor}</span>
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(cls.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {cls.time} • {cls.duration}min</span>
                  </div>

                  <div className="flex items-center gap-2">

  {cls.status === "live" ? (

  isSubscribed && canAccessClass(cls.requiredPlan) ? (
    <button
      onClick={() => handleJoin(cls)}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
      style={{
        background: "linear-gradient(135deg, #E91E8C, #9C27B0)",
        color: "white"
      }}
    >
      <FiPlay size={15} />
      Join Live Class
    </button>
  ) : (
    <button
      disabled
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-white/5 cursor-not-allowed"
    >
      <FiLock size={15} />
      {cls.requiredPlan.toUpperCase()} Plan Required
    </button>
  )

  ) : cls.status === "upcoming" ? (

    <button
      disabled
      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-500/10 text-blue-400"
    >
      Upcoming Class
    </button>

  ) : cls.status === "completed" ? (

    cls.recordingUrl ? (
      <a
        href={cls.recordingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
      >
        <FiVideo size={15} />
        Watch Recording
      </a>
    ) : (
      <button
        disabled
        className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-500/10 text-gray-400"
      >
        Completed
      </button>
    )

  ) : (

    <button
      disabled
      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-400"
    >
      Cancelled
    </button>

  )}

</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
