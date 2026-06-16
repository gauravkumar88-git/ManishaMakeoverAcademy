import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FiCalendar, FiEye, FiArrowRight } from 'react-icons/fi';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs').then(r => { setBlogs(r.data.blogs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const placeholders = [
    { _id: '1', title: '10 Must-Know Bridal Makeup Tips for 2025', excerpt: 'Master the art of bridal makeup with these pro techniques used by top makeup artists.', coverImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600', category: 'bridal', views: 1240, createdAt: new Date('2025-01-10'), slug: '#', author: { name: 'Priya Mehta' } },
    { _id: '2', title: 'The Complete Guide to Glass Skin Routine', excerpt: 'Achieve the coveted glass skin look with this step-by-step Korean skincare inspired routine.', coverImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', category: 'skincare', views: 890, createdAt: new Date('2025-01-15'), slug: '#', author: { name: 'Sneha Kapoor' } },
    { _id: '3', title: 'Nail Art Trends Dominating 2025', excerpt: 'From chrome powder to 3D nail art — discover the hottest nail trends you need to try.', coverImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', category: 'nail', views: 674, createdAt: new Date('2025-01-20'), slug: '#', author: { name: 'Anjali Sharma' } },
    { _id: '4', title: 'How to Build a Profitable Salon Business', excerpt: 'Turn your beauty passion into a thriving business with these expert business strategies.', coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', category: 'business', views: 532, createdAt: new Date('2025-01-25'), slug: '#', author: { name: 'Priya Mehta' } },
    { _id: '5', title: 'HD Makeup vs Airbrush: Which is Better?', excerpt: 'A comprehensive comparison of HD and airbrush makeup techniques for different occasions.', coverImage: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600', category: 'makeup', views: 421, createdAt: new Date('2025-02-01'), slug: '#', author: { name: 'Sneha Kapoor' } },
    { _id: '6', title: 'Natural Hair Care Remedies That Actually Work', excerpt: 'Science-backed home remedies for stronger, shinier, and healthier hair growth.', coverImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600', category: 'hair', views: 310, createdAt: new Date('2025-02-08'), slug: '#', author: { name: 'Priya Mehta' } },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : placeholders;
  const [featured, ...rest] = displayBlogs;

  return (
    <div style={{ background: '#0D0010' }} className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="badge mb-4">Beauty Blog</span>
          <h1 className="section-title text-white mb-4">Tips, Trends & <span className="gradient-text">Inspiration</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">Expert beauty advice, tutorials, and industry insights from our top instructors.</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-72 shimmer" />)}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl overflow-hidden mb-10 group card-hover">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    <span className="absolute top-4 left-4 badge capitalize">{featured.category}</span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-pink-400 text-xs font-semibold mb-2 uppercase tracking-wider">Featured Post</span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{featured.title}</h2>
                    <p className="text-gray-400 leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-gray-500 text-xs mb-6">
                      <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(featured.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><FiEye size={12} /> {featured.views} views</span>
                    </div>
                    <a href={featured.slug !== '#' ? `/blog/${featured.slug}` : '#'}
                      className="btn-primary inline-flex items-center gap-2 text-sm w-fit">
                      Read Article <FiArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog, i) => (
                <motion.article key={blog._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass rounded-2xl overflow-hidden group card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 left-3 badge capitalize">{blog.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <span className="flex items-center gap-1"><FiEye size={11} /> {blog.views}</span>
                      </div>
                      <span className="text-pink-400">{blog.author?.name}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
