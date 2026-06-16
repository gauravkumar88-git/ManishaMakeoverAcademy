import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { FiAward, FiDownload, FiShare2, FiExternalLink } from 'react-icons/fi';

export default function StudentCertificates() {
  const { user } = useSelector(s => s.auth);
  const [certificates, setCertificates] = useState([]);
  const [completedClasses, setCompletedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/certificates/my'),
      api.get('/classes?status=completed&limit=20'),
    ]).then(([certRes, clsRes]) => {
      setCertificates(certRes.data.certificates || []);
      setCompletedClasses(clsRes.data.classes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleGenerate = async (cls) => {
    if (!user?.subscriptionActive) { toast.error('Active subscription required'); return; }
    setGenerating(cls._id);
    try {
      const res = await api.post('/certificates/generate', { classId: cls._id, courseName: cls.title });
      setCertificates(prev => [...prev.filter(c => c.classId?._id !== cls._id), res.data.certificate]);
      toast.success('Certificate generated! 🎉');
    } catch { toast.error('Failed to generate certificate'); }
    finally { setGenerating(null); }
  };

  const hasCert = (classId) => certificates.find(c => c.classId?._id === classId || c.classId === classId);

  const handleShare = (cert) => {
    const url = `${window.location.origin}/verify-certificate/${cert.certificateId}`;
    navigator.clipboard.writeText(url);
    toast.success('Verification link copied!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Earned Certificates */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <FiAward className="text-yellow-400" size={20} /> My Certificates ({certificates.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((cert, i) => (
                <motion.div key={cert._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl overflow-hidden p-6"
                  style={{ background: 'linear-gradient(135deg, #1a0020, #2d0035, #1a0020)', border: '1px solid rgba(183,110,121,0.4)' }}>
                  {/* Gold decorative border */}
                  <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(183,110,121,0.15), transparent, rgba(183,110,121,0.15))' }} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B76E79, #E8C99A)' }}>
                        <FiAward className="text-white" size={26} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Certificate ID</p>
                        <p className="text-xs font-mono text-yellow-400">{cert.certificateId}</p>
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">{cert.courseName}</h3>
                    <p className="text-gray-400 text-sm mb-1">Awarded to: <span className="text-white">{user?.name}</span></p>
                    {cert.instructorName && <p className="text-gray-400 text-xs mb-1">Instructor: {cert.instructorName}</p>}
                    <p className="text-gray-500 text-xs mb-4">Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="flex gap-2">
                      {cert.pdfUrl ? (
                        <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white"
                          style={{ background: 'linear-gradient(135deg, #B76E79, #E8C99A)' }}>
                          <FiDownload size={14} /> Download
                        </a>
                      ) : (
                        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-400 glass">
                          PDF Generating...
                        </div>
                      )}
                      <button onClick={() => handleShare(cert)}
                        className="p-2.5 rounded-xl glass text-gray-400 hover:text-white transition-colors">
                        <FiShare2 size={15} />
                      </button>
                      <a href={`/verify-certificate/${cert.certificateId}`} target="_blank" rel="noopener noreferrer"
                        className="p-2.5 rounded-xl glass text-gray-400 hover:text-white transition-colors">
                        <FiExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Available to Earn */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Earn Certificates</h2>
          {loading ? (
            <div className="glass rounded-2xl p-8 text-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : completedClasses.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <FiAward size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No completed classes yet. Attend classes to earn certificates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedClasses.map((cls, i) => {
                const earned = hasCert(cls._id);
                return (
                  <motion.div key={cls._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass rounded-2xl p-5" style={{ border: `1px solid ${earned ? 'rgba(183,110,121,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=100'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-medium line-clamp-1">{cls.title}</h3>
                        <p className="text-gray-400 text-xs">{cls.instructor}</p>
                      </div>
                    </div>
                    {earned ? (
                      <div className="flex items-center gap-2 text-yellow-400 text-xs font-medium">
                        <FiAward size={14} /> Certificate Earned ✓
                      </div>
                    ) : (
                      <button onClick={() => handleGenerate(cls)} disabled={generating === cls._id}
                        className="w-full py-2 rounded-xl text-sm font-medium text-white transition-all"
                        style={{ background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' }}>
                        {generating === cls._id ? 'Generating...' : 'Generate Certificate'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
