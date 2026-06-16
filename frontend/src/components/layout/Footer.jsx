import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiYoutube, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
export default function Footer() {
  return (
    <footer style={{ background: '#060008', borderTop: '1px solid rgba(233,30,140,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-gradient flex items-center justify-center text-white font-bold text-xl">M</div>
              <div>
                <div className="font-display font-bold text-white text-lg">Manisha Makeover</div>
                <div className="text-xs text-pink-400">Academy</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Transform your passion for beauty into a professional career through live interactive classes, premium notes, and industry-recognized certifications.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiInstagram, href: '#', color: 'hover:text-pink-400' },
                { icon: FiYoutube, href: '#', color: 'hover:text-red-400' },
                { icon: FiFacebook, href: '#', color: 'hover:text-blue-400' },
              ].map(({ icon: Icon, href, color }) => (
                <a key={href} href={href} className={`p-2 rounded-full glass text-gray-400 ${color} transition-all hover:scale-110`}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['Courses', '/courses'], ['Pricing', '/pricing'], ['Blog', '/blog'], ['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-gray-400 hover:text-pink-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Courses</h4>
            <ul className="space-y-2">
              {['Bridal Makeup', 'Skincare Mastery', 'Hair Styling', 'Nail Art', 'Eyebrow Design', 'Mehndi Art'].map(c => (
                <li key={c}>
                  <span className="text-gray-400 hover:text-pink-400 text-sm transition-colors cursor-pointer">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail size={16} className="text-pink-400 flex-shrink-0" />
                <span>manishamakeoveracademy740@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone size={16} className="text-pink-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
                <span>Online Platform<br />India-wide</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Subscribe to newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="input-beauty text-xs py-2 flex-1" />
                <button className="btn-primary text-xs py-2 px-4">Go</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Manisha Makeover  Academy. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
         <a href="/privacy-policy" className="hover:text-pink-400 transition-colors">
  Privacy Policy
</a>

<a href="/terms-of-service" className="hover:text-pink-400 transition-colors">
  Terms of Service
</a>

<a href="/refund-policy" className="hover:text-pink-400 transition-colors">
  Refund Policy
</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
