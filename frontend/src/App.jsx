import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { getMe } from './store/slices/authSlice';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import ScrollToTop from './components/common/ScrollToTop';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import PricingPage from './pages/PricingPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
// import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentClasses from './pages/student/Classes';
import StudentNotes from './pages/student/Notes';
import StudentAttendance from './pages/student/Attendance';
import StudentCertificates from './pages/student/Certificates';
import StudentProfile from './pages/student/Profile';
import StudentPayments from './pages/student/Payments';
import CheckoutPage from "./pages/student/CheckoutPage";
// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminClasses from './pages/admin/Classes';
import AdminStudents from './pages/admin/Students';
import AdminNotes from './pages/admin/Notes';
import AdminPayments from './pages/admin/Payments';
import AdminNotifications from './pages/admin/Notifications';
import AdminCoupons from './pages/admin/Coupons';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, initialized } = useSelector(state => state.auth);
  if (!initialized) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useSelector(state => state.auth);
  if (!initialized) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a0020', color: '#fff', border: '1px solid rgba(233,30,140,0.3)' },
            success: { iconTheme: { primary: '#E91E8C', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
          <Route path="/courses" element={<><Navbar /><CoursesPage /><Footer /></>} />
          <Route path="/pricing" element={<><Navbar /><PricingPage /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/verify-certificate/:id" element={<><Navbar /><VerifyCertificatePage /><Footer /></>} />
          {/* <Route path="/privacy-policy" element={<> <Navbar /><PrivacyPolicy /> <Footer /> </> }/> */}
          <Route path="/terms-of-service" element={ <> <Navbar /> <TermsConditions /><Footer /> </> }/>
          <Route path="/refund-policy" element={<> <Navbar /><RefundPolicy /><Footer /> </> }/>

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/my-classes" element={<ProtectedRoute><StudentClasses /></ProtectedRoute>} />
          <Route path="/my-notes" element={<ProtectedRoute><StudentNotes /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><StudentCertificates /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><StudentPayments /></ProtectedRoute>} />
          <Route path="/checkout/:plan" element={<CheckoutPage />}
/>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute adminOnly><AdminClasses /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute adminOnly><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/notes" element={<ProtectedRoute adminOnly><AdminNotes /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/coupons" element={<ProtectedRoute adminOnly><AdminCoupons /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <WhatsAppButton />
      </Router>
    </div>
  );
}

export default App;
