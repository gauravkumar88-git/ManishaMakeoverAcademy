import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingClasses } from '../store/slices/classSlice';
import { FiPlay, FiStar, FiUsers, FiAward, FiBook, FiVideo, FiCheck, FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const stats = [
  { value: '5000+', label: 'Students Trained', icon: FiUsers },
  { value: '200+', label: 'Live Classes', icon: FiVideo },
  { value: '98%', label: 'Success Rate', icon: FiStar },
  { value: '50+', label: 'Certificates Issued', icon: FiAward },
];

const features = [
  { icon: '🎥', title: 'Live Interactive Classes', desc: 'Join real-time classes via Google Meet with our expert instructors and get personalized feedback.' },
  { icon: '📄', title: 'Premium PDF Notes', desc: 'Download comprehensive study materials, assignments, and beauty guides after each class.' },
  { icon: '🏆', title: 'Industry Certificates', desc: 'Earn QR-verified certificates recognized by top salons and beauty brands across India.' },
  { icon: '👩‍🏫', title: 'Expert Mentorship', desc: 'Get one-on-one guidance from professional makeup artists with 10+ years of experience.' },
  { icon: '📊', title: 'Attendance Tracking', desc: 'Monitor your learning progress with detailed attendance and performance analytics.' },
  { icon: '💬', title: '24/7 Community Support', desc: 'Connect with fellow students and instructors through our exclusive WhatsApp groups.' },
];

const testimonials = [
  { name: 'Priya Sharma', city: 'Delhi', image: 'https://randomuser.me/api/portraits/women/44.jpg', text: "Beauty Master Academy transformed my life! I started my own salon within 3 months of completing the bridal makeup course.", rating: 5 },
  { name: 'Kavya Reddy', city: 'Bangalore', image: 'https://randomuser.me/api/portraits/women/55.jpg', text: "The live classes are so interactive. My instructor's feedback helped me perfect my blending techniques in just 2 weeks.", rating: 5 },
  { name: 'Ananya Singh', city: 'Mumbai', image: 'https://randomuser.me/api/portraits/women/68.jpg', text: "The certificate I got from here helped me land my dream job at a luxury wedding studio. Highly recommended!", rating: 5 },
];

const plans = [
  { name: 'Basic', price: '₹499', period: '/month', color: 'from-pink-500 to-rose-500', features: ['Live Classes Access', 'PDF Notes Download', 'Community Access', 'Attendance Tracking'], popular: false },
  { name: 'Premium', price: '₹999', period: '/month', color: 'from-purple-500 to-pink-500', features: ['Everything in Basic', 'Class Recordings', 'Premium Content', 'Priority Support'], popular: true },
  { name: 'VIP', price: '₹1999', period: '/month', color: 'from-amber-400 to-rose-500', features: ['Everything in Premium', 'One-to-One Mentorship', 'Exclusive Workshops', 'Career Placement Help'], popular: false },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { upcoming } = useSelector(s => s.classes);

  useEffect(() => { dispatch(fetchUpcomingClasses()); }, [dispatch]);

  return (
    <div style={{ background: '#0D0010' }} className="overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Orbs */}
        <div className="orb w-96 h-96 bg-pink-600 top-20 -left-48" style={{ opacity: 0.12 }} />
        <div className="orb w-80 h-80 bg-purple-600 bottom-20 -right-40" style={{ opacity: 0.12 }} />
        <div className="orb w-64 h-64 bg-rose-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.06 }} />

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(233,30,140,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(233,30,140,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-pink-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse-slow" />
              <span className="text-pink-300 text-sm font-medium">India's #1 Online Beauty Academy</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Transform Your
              <br />
              <span className="gradient-text">Passion Into a</span>
              <br />
              Professional Career
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Learn from beauty experts through <span className="text-pink-300">live interactive classes</span>, premium notes, mentorship, and certification programs designed for aspiring beauty professionals.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2 group">
                Start Learning Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/courses" className="btn-outline text-base px-8 py-4 flex items-center justify-center gap-2">
                <FiPlay size={16} /> Explore Classes
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="glass rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-pink-gradient flex items-center justify-center mx-auto mb-2">
                    <Icon className="text-white" size={18} />
                  </div>
                  <div className="text-2xl font-bold text-white font-display">{value}</div>
                  <div className="text-gray-400 text-xs mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge mb-4">Why Choose Us</span>
            <h2 className="section-title text-white mb-4">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From live classes to certification, we provide a complete ecosystem for your beauty education journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-pink-400 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── UPCOMING CLASSES ─────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section className="py-24 px-6" style={{ background: 'rgba(233,30,140,0.03)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="badge mb-3">Live Classes</span>
                <h2 className="section-title text-white">Upcoming <span className="gradient-text">Classes</span></h2>
              </div>
              <Link to="/courses" className="btn-outline text-sm">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.slice(0, 3).map((cls, i) => (
                <motion.div key={cls._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl overflow-hidden card-hover group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={cls.thumbnail || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400'} alt={cls.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 right-3 badge capitalize">{cls.category}</span>
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-lg mb-2">{cls.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{cls.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><FiCalendar size={14} /> {new Date(cls.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      <span className="flex items-center gap-1"><FiClock size={14} /> {cls.time}</span>
                    </div>
                    <Link to="/pricing" className="btn-primary w-full text-center text-sm py-2 block">Join Class</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PRICING ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge mb-4">Subscription Plans</span>
            <h2 className="section-title text-white mb-4">Choose Your <span className="gradient-text">Learning Path</span></h2>
            <p className="text-gray-400">Flexible plans designed to match your learning goals and budget.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`glass rounded-3xl p-8 relative card-hover ${plan.popular ? 'border border-pink-500/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #E91E8C, #9C27B0)' }}>Most Popular</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white text-xl mb-4`}>
                  {i === 0 ? '🌸' : i === 1 ? '💎' : '👑'}
                </div>
                <h3 className="text-white text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <FiCheck className="text-pink-400 flex-shrink-0" size={16} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/pricing" className={`block text-center rounded-full py-3 font-semibold text-sm transition-all ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'rgba(233,30,140,0.03)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="badge mb-4">Student Stories</span>
            <h2 className="section-title text-white mb-4">What Our <span className="gradient-text">Students Say</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-yellow-400 fill-yellow-400" size={16} />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500/30" />
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="glass rounded-3xl p-12" style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(123,45,139,0.1) 100%)', border: '1px solid rgba(233,30,140,0.2)' }}>
              <h2 className="section-title text-white mb-4">Ready to Start Your <span className="gradient-text">Beauty Career?</span></h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join 5000+ students who have transformed their passion into a thriving professional career.</p>
              <div className="flex gap-4 justify-center">
                <Link to="/register" className="btn-primary text-base px-8 py-4">Enroll Now — Free</Link>
                <Link to="/contact" className="btn-outline text-base px-8 py-4">Talk to Advisor</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
