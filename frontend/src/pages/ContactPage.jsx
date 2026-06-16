import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiYoutube, FiFacebook } from 'react-icons/fi';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you within 24 hours. 🌸');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="badge mb-4">Contact Us</span>
          <h1 className="section-title text-white mb-4">Let's <span className="gradient-text">Talk Beauty</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">Have questions? We're here to help you start your beauty journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-5">Get in Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: FiMail, label: 'Email', value: 'info@beautymasteracademy.com', href: 'mailto:info@beautymasteracademy.com' },
                  { icon: FiPhone, label: 'Phone / WhatsApp', value: '+91 98765 43210', href: 'tel:+919876543210' },
                  { icon: FiMapPin, label: 'Location', value: 'Online — India-wide', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(233,30,140,0.12)', border: '1px solid rgba(233,30,140,0.2)' }}>
                      <Icon className="text-pink-400" size={18} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-white text-sm hover:text-pink-400 transition-colors">{value}</a>
                      ) : (
                        <p className="text-white text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: FiInstagram, href: '#', label: 'Instagram', color: '#E91E8C' },
                  { icon: FiYoutube, href: '#', label: 'YouTube', color: '#FF0000' },
                  { icon: FiFacebook, href: '#', label: 'Facebook', color: '#1877F2' },
                ].map(({ icon: Icon, href, label, color }) => (
                  <a key={label} href={href}
                    className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl glass hover:scale-105 transition-transform"
                    style={{ border: `1px solid ${color}20` }}>
                    <Icon size={20} style={{ color }} />
                    <span className="text-xs text-gray-400">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.08),rgba(123,45,139,0.08))', border: '1px solid rgba(233,30,140,0.2)' }}>
              <h3 className="text-white font-semibold mb-2">💬 WhatsApp Support</h3>
              <p className="text-gray-400 text-sm mb-4">Get instant support on WhatsApp. Available Mon–Sat, 9 AM – 8 PM IST.</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ background: '#25D366' }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-white font-semibold text-lg mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Full Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="input-beauty" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="input-beauty" placeholder="your@email.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="input-beauty" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Subject *</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="input-beauty" style={{ background: 'rgba(255,255,255,0.05)' }} required>
                      <option value="">Select a topic...</option>
                      <option>Course Enquiry</option>
                      <option>Subscription / Payment</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="input-beauty resize-none" rows={6} placeholder="Tell us how we can help you..." required />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><FiSend size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
