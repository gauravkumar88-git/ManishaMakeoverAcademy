import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FiGrid, FiCalendar, FiBook, FiAward, FiBarChart2, FiUser,
  FiCreditCard, FiBell, FiLogOut, FiMenu, FiX, FiChevronRight,
  FiUsers, FiSettings, FiTag, FiHome
} from 'react-icons/fi';

const studentNav = [
  { icon: FiGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FiCalendar, label: 'My Classes', href: '/my-classes' },
  { icon: FiBook, label: 'Notes & PDFs', href: '/my-notes' },
  { icon: FiBarChart2, label: 'Attendance', href: '/attendance' },
  { icon: FiAward, label: 'Certificates', href: '/certificates' },
  { icon: FiCreditCard, label: 'Payments', href: '/payments' },
  { icon: FiUser, label: 'Profile', href: '/profile' },
];

const adminNav = [
  { icon: FiGrid, label: 'Dashboard', href: '/admin' },
  { icon: FiCalendar, label: 'Classes', href: '/admin/classes' },
  { icon: FiUsers, label: 'Students', href: '/admin/students' },
  { icon: FiBook, label: 'Notes', href: '/admin/notes' },
  { icon: FiCreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: FiBell, label: 'Notifications', href: '/admin/notifications' },
  { icon: FiTag, label: 'Coupons', href: '/admin/coupons' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
console.log("USER DATA:", user);
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNav : studentNav;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-pink-gradient flex items-center justify-center text-white font-bold shadow-beauty">B</div>
        <div>
          <div className="font-display font-bold text-white text-sm">ManishaMakeover</div>
          <div className="text-xs text-pink-400">{isAdmin ? 'Admin Panel' : 'Academy'}</div>
        </div>
      </Link>

      {/* User card */}
      <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.15)' }}>
        <div className="flex items-center gap-3">
       <img
  src={
    user?.avatar &&
    !user.avatar.includes("googleusercontent")
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.name || "User"
        )}&background=E91E8C&color=fff`
  }
  alt="Profile"
  className="w-10 h-10 rounded-full object-cover"
/>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-pink-400 text-xs capitalize">{user?.subscriptionPlan || 'Free'} plan</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link key={href} to={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { background: 'linear-gradient(135deg, rgba(233,30,140,0.2), rgba(123,45,139,0.2))', border: '1px solid rgba(233,30,140,0.25)' } : {}}>
              <Icon size={18} className={active ? 'text-pink-400' : ''} />
              {label}
              {active && <FiChevronRight size={14} className="ml-auto text-pink-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <FiHome size={16} /> Back to Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-left">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0A000E' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0"
        style={{ background: '#0D0018', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden flex flex-col"
              style={{ background: '#0D0018', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ background: '#0D0018', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-white font-semibold">
                {navItems.find(n => n.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500 text-xs hidden sm:block">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isAdmin && !user?.subscriptionActive && (
              <Link to="/pricing" className="btn-primary text-xs py-2 px-4 hidden sm:flex">Upgrade Plan</Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
