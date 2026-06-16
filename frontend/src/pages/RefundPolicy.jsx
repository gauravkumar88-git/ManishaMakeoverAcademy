import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0015] via-[#1a0020] to-[#120018] py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Refund <span className="text-pink-500">Policy</span>
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

        {/* Content Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-pink-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">

          <p className="text-pink-200 mb-6">
            Last Updated: August 2026
          </p>

          <p className="text-gray-300 leading-relaxed mb-8">
            Thank you for choosing{" "}
            <span className="text-pink-400 font-semibold">
              Beauty Master Academy
            </span>.
            Please read our refund policy carefully before purchasing any
            course, training program, workshop, or educational service.
          </p>

          {/* No Refund Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              No Refund Policy
            </h2>

            <p className="text-gray-300 leading-relaxed">
              All course purchases made through Beauty Master Academy are final.
              Once payment is successfully completed and enrollment is confirmed,
              no refunds, cancellations, or exchanges will be provided.
            </p>
          </section>

          {/* Why */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Reason for No Refunds
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Our courses provide immediate access to digital learning
              materials, class schedules, notes, resources, and educational
              services. Because access is granted instantly, all sales are
              considered final.
            </p>
          </section>

          {/* Not Eligible */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Refund Requests Will Not Be Accepted For
            </h2>

            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Change of mind after purchasing a course.</li>
              <li>Failure to attend classes.</li>
              <li>Lack of time to complete the course.</li>
              <li>Dissatisfaction after course access has been granted.</li>
              <li>Failure to understand course requirements before purchase.</li>
            </ul>
          </section>

          {/* Duplicate Payments */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Duplicate Payments
            </h2>

            <p className="text-gray-300 leading-relaxed">
              If a customer is accidentally charged multiple times for the same
              transaction, the duplicate payment amount may be reviewed and
              refunded after successful verification.
            </p>
          </section>

          {/* Technical Issues */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">
              Technical Issues
            </h2>

            <p className="text-gray-300 leading-relaxed">
              If you experience any technical issue while accessing your course,
              our support team will assist you in resolving the problem.
              However, technical issues do not qualify for refunds.
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

export default RefundPolicy;