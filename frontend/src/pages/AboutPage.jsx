import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAward, FiUsers, FiHeart, FiStar } from 'react-icons/fi';

const team = [
  { name: 'Priya Mehta', role: 'Head Instructor & Founder', exp: '12 years', img: 'https://randomuser.me/api/portraits/women/44.jpg', speciality: 'Bridal & Editorial Makeup' },
  { name: 'Sneha Kapoor', role: 'Senior Instructor', exp: '8 years', img: 'https://randomuser.me/api/portraits/women/55.jpg', speciality: 'Skincare & Hair Styling' },
  { name: 'Anjali Sharma', role: 'Nail Art Specialist', exp: '6 years', img: 'https://randomuser.me/api/portraits/women/68.jpg', speciality: 'Nail Art & Extensions' },
];

const milestones = [
  { year: '2020', event: 'Beauty Master Academy founded' },
  { year: '2021', event: 'Reached 500 students' },
  { year: '2022', event: 'Launched live online classes via Google Meet' },
  { year: '2023', event: '2000+ certificates issued' },
  { year: '2024', event: '5000+ students trained across India' },
];

const values = [
  { icon: FiHeart, title: 'Passion First', desc: 'We believe beauty is an art form that deserves dedicated, passionate instruction.' },
  { icon: FiAward, title: 'Excellence', desc: 'Our curriculum is designed by industry professionals with decades of experience.' },
  { icon: FiUsers, title: 'Community', desc: 'We foster a supportive learning environment where every student thrives.' },
  { icon: FiStar, title: 'Innovation', desc: 'We continuously update our content to reflect the latest beauty trends and techniques.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="orb w-80 h-80 bg-pink-600 -top-20 left-1/2 -translate-x-1/2" style={{ opacity: 0.1 }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <span className="badge mb-4">Our Story</span>
          <h1 className="section-title text-white mb-6">Empowering Beauty <span className="gradient-text">Professionals</span> Since 2020</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Beauty Master Academy was born from a simple belief — every person who loves beauty deserves access to world-class training, regardless of where they live. We started as a small studio in Delhi and have grown into India's most trusted online beauty education platform.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[['5000+', 'Students Trained'], ['200+', 'Live Classes'], ['50+', 'Expert Instructors'], ['98%', 'Satisfaction Rate']].map(([val, label], i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-display font-bold gradient-text">{val}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-white mb-3">Our <span className="gradient-text">Core Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.2),rgba(123,45,139,0.2))', border: '1px solid rgba(233,30,140,0.2)' }}>
                  <v.icon className="text-pink-400" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6" style={{ background: 'rgba(233,30,140,0.03)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-white mb-3">Meet Our <span className="gradient-text">Expert Team</span></h2>
            <p className="text-gray-400">Learn from the best in the industry.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center card-hover">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-pink-500/30" />
                <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                <p className="text-pink-400 text-sm mb-1">{member.role}</p>
                <p className="text-gray-400 text-xs mb-2">{member.speciality}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs text-purple-300" style={{ background: 'rgba(156,39,176,0.15)', border: '1px solid rgba(156,39,176,0.2)' }}>
                  {member.exp} experience
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-white mb-3">Our <span className="gradient-text">Journey</span></h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, #E91E8C, #9C27B0)' }} />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-6 pl-14 relative">
                  <div className="absolute left-3.5 w-5 h-5 rounded-full border-2 border-pink-500 bg-pink-500/20" />
                  <div className="glass rounded-xl px-5 py-3 flex-1">
                    <span className="text-pink-400 font-bold text-sm">{m.year}</span>
                    <p className="text-white text-sm mt-0.5">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto glass rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(233,30,140,0.1),rgba(123,45,139,0.1))', border: '1px solid rgba(233,30,140,0.2)' }}>
          <h2 className="section-title text-white mb-4">Join the <span className="gradient-text">Beauty Revolution</span></h2>
          <p className="text-gray-400 mb-8">Be a part of our growing community of beauty professionals.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-3">Start Free Today</Link>
            <Link to="/contact" className="btn-outline text-base px-8 py-3">Talk to Us</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
