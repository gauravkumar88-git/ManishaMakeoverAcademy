import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FiAward, FiCheckCircle, FiXCircle, FiCalendar, FiUser } from 'react-icons/fi';

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/certificates/verify/${id}`)
      .then(r => { setCert(r.data.certificate); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
        {loading ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Verifying certificate...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-3xl p-12 text-center">
            <FiXCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-white mb-2">Certificate Not Found</h2>
            <p className="text-gray-400 mb-6">This certificate ID is invalid or has been revoked.</p>
            <Link to="/" className="btn-primary text-sm px-6 py-2.5 inline-block">Go Home</Link>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a0020, #2d0035, #1a0020)', border: '2px solid rgba(183,110,121,0.5)' }}>
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg opacity-60" style={{ borderColor: '#B76E79' }} />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-60" style={{ borderColor: '#B76E79' }} />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-60" style={{ borderColor: '#B76E79' }} />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg opacity-60" style={{ borderColor: '#B76E79' }} />

            <div className="p-10 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <FiCheckCircle className="text-green-400" size={16} />
                <span className="text-green-400 text-sm font-semibold">Certificate Verified ✓</span>
              </div>

              {/* Academy Logo */}
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl font-display"
                style={{ background: 'linear-gradient(135deg,#E91E8C,#9C27B0)' }}>B</div>
              <p className="text-pink-300 text-sm font-medium mb-1">Beauty Master Academy</p>
              <p className="text-gray-500 text-xs mb-8">Certificate of Completion</p>

              {/* Certificate Content */}
              <p className="text-gray-400 text-sm mb-2">This is to certify that</p>
              <h2 className="font-display text-3xl font-bold mb-2" style={{ background: 'linear-gradient(135deg,#B76E79,#E8C99A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {cert.userId?.name}
              </h2>
              <p className="text-gray-400 text-sm mb-1">has successfully completed</p>
              <h3 className="font-display text-xl font-bold text-white mb-6">{cert.courseName}</h3>

              <div className="flex justify-center gap-8 text-sm text-gray-400 mb-6">
                {cert.instructorName && (
                  <div className="flex items-center gap-2">
                    <FiUser size={13} className="text-pink-400" />
                    <span>Instructor: <span className="text-white">{cert.instructorName}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FiCalendar size={13} className="text-pink-400" />
                  <span>{new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* QR Code */}
              {cert.qrCode && (
                <div className="flex flex-col items-center mb-6">
                  <img src={cert.qrCode} alt="QR Code" className="w-24 h-24 rounded-xl mb-2" style={{ background: 'white', padding: '4px' }} />
                  <p className="text-gray-500 text-xs">Scan to verify</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-500 text-xs">Certificate ID: <span className="font-mono text-pink-400">{cert.certificateId}</span></p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
