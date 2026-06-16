import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0015] via-[#1a0020] to-[#120018] py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Privacy <span className="text-pink-500">Policy</span>
          </h1>

          <p className="text-pink-200 text-lg">
            Beauty Master Academy
          </p>

          <div className="flex justify-center mt-6">
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-full px-6 py-2">
              <span className="text-pink-400 font-medium">
                Professional Beauty Education Platform
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/5 backdrop-blur-lg border border-pink-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">

          <p className="text-pink-200 mb-6">
            Last Updated: August 2026
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            Welcome to <strong className="text-pink-400">Beauty Master Academy</strong>.
            We are committed to protecting your privacy and ensuring that your
            personal information remains secure. This Privacy Policy explains
            how we collect, use, store, and protect your information when you
            use our website, courses, and services.
          </p>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Information We Collect
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Profile Information</li>
              <li>Course Enrollment Details</li>
              <li>Attendance Records</li>
              <li>Certificate Information</li>
              <li>Payment Details (Processed Securely via Razorpay)</li>
              <li>Google Account Information (For Google Login Users)</li>
            </ul>
          </section>

          {/* How We Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              How We Use Your Information
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide access to beauty and makeup courses.</li>
              <li>Manage student registrations and enrollments.</li>
              <li>Track attendance and learning progress.</li>
              <li>Generate certificates after course completion.</li>
              <li>Process payments securely.</li>
              <li>Send updates, announcements, and notifications.</li>
              <li>Improve platform functionality and user experience.</li>
            </ul>
          </section>

          {/* Payment Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Payment Security
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All payments are processed through trusted third-party payment
              gateways such as Razorpay. We do not store your complete debit
              card, credit card, UPI PIN, CVV, or banking credentials on our
              servers.
            </p>
          </section>

          {/* Data Protection */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Data Protection
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We use industry-standard security practices and technologies to
              safeguard your information from unauthorized access, disclosure,
              misuse, or alteration.
            </p>
          </section>

          {/* Third Party Services */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Third-Party Services
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Beauty Master Academy may use trusted services including Google
              OAuth, Cloudinary, MongoDB Atlas, Razorpay, and email service
              providers to deliver platform functionality. These providers have
              their own privacy policies regarding data usage.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Cookies
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We may use cookies and similar technologies to improve user
              experience, remember login sessions, analyze website traffic, and
              enhance platform performance.
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Your Rights
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Access your personal information.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Request deletion of your account and data.</li>
              <li>Contact us regarding privacy concerns.</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Contact Us
            </h2>

            <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-6 mt-4">
              <p className="text-white font-semibold text-lg mb-3">
                Beauty Master Academy
              </p>

              <p className="text-gray-300">
                Email: manishamakeoveracademy740@gmail.com
              </p>

              <p className="text-gray-300">
                Phone: +91 XXXXXXXXXX
              </p>

              <p className="text-gray-300">
                Website: https://yourdomain.com
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-10 text-center border-t border-pink-500/20 pt-6">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Beauty Master Academy.
              All Rights Reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;