import React from "react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0015] via-[#1a0020] to-[#120018] py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Terms of <span className="text-pink-500">Service</span>
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
            By accessing our website, enrolling in courses, or using any of our
            services, you agree to comply with the following Terms of Service.
          </p>

          {/* Eligibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Eligibility
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Users must provide accurate information during registration.
              Students are responsible for maintaining the confidentiality of
              their login credentials and account information.
            </p>
          </section>

          {/* Course Enrollment */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Course Enrollment
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Enrollment is confirmed only after successful payment.</li>
              <li>Course access is provided according to the selected plan.</li>
              <li>Course schedules may change when necessary.</li>
              <li>Students must attend classes respectfully and professionally.</li>
            </ul>
          </section>

          {/* Payments */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Payments
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All payments are processed through secure third-party payment
              gateways such as Razorpay. Beauty Master Academy is not responsible
              for payment gateway downtime or banking issues beyond our control.
            </p>
          </section>

          {/* Certificates */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Certificates
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Certificates are issued only after successful completion of course
              requirements. Certificates remain the property of Beauty Master
              Academy and may be verified through our platform.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Intellectual Property
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All course materials, videos, notes, branding, logos, and website
              content belong exclusively to Beauty Master Academy. Unauthorized
              copying, sharing, recording, distribution, or resale is strictly
              prohibited.
            </p>
          </section>

          {/* User Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              User Conduct
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>No misuse of the platform.</li>
              <li>No sharing of login credentials.</li>
              <li>No uploading harmful or malicious content.</li>
              <li>No harassment of instructors or students.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Limitation of Liability
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Beauty Master Academy shall not be liable for indirect, incidental,
              or consequential damages arising from the use of our platform,
              courses, or services.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Changes to Terms
            </h2>

            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time.
              Continued use of the platform after updates constitutes acceptance
              of the revised terms.
            </p>
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
                Phone: +91 8860011621
              </p>

              <p className="text-gray-300">
                Website: http://localhost:5173
              </p>
            </div>
          </section>

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

export default TermsConditions;