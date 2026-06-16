import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { fetchNotifications, markAllRead } from '../../store/slices/notificationSlice';
import { FiSun, FiMoon, FiBell, FiMenu, FiX, FiChevronDown, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const { darkMode } = useSelector(s => s.ui);
  const { list: notifications, unreadCount } = useSelector(s => s.notifications);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchNotifications());
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'rgba(13, 0, 16, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(233,30,140,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-pink-gradient flex items-center justify-center text-white font-bold text-lg shadow-beauty">M</div>
          <div>
            <span className="font-display font-bold text-white text-lg">ManishaMakeover</span>
            <div className="text-xs text-pink-400 -mt-1">Academy</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'text-pink-400 bg-pink-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); if (unreadCount > 0) dispatch(markAllRead()); }}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all relative"
                >
                  <FiBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                      <div className="p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">Notifications</h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-gray-400 text-sm text-center">No notifications</p>
                        ) : notifications.slice(0, 5).map(n => (
                          <div key={n._id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? 'border-l-2 border-pink-500' : ''}`}>
                            <p className="text-sm font-medium text-white">{n.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full glass hover:bg-white/10 transition-all"
                >
                  <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=E91E8C&color=fff`} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm text-white font-medium">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} className="text-gray-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 w-52 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                      {user?.role === 'admin' ? (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <FiGrid size={16} /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          <FiGrid size={16} /> Dashboard
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                        <FiUser size={16} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Join Now</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-white"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(13, 0, 16, 0.98)', borderTop: '1px solid rgba(233,30,140,0.2)' }}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === link.href ? 'text-pink-400 bg-pink-500/10' : 'text-gray-300'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex gap-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center text-sm">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Join Now</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
