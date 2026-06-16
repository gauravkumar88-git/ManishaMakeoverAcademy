const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const templates = {
  welcome: (data) => `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fff0f5 0%, #fce4ec 100%); padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c2185b; font-size: 28px; margin: 0;">💄 Beauty Master Academy</h1>
        <p style="color: #ad1457; font-size: 14px;">Transform Your Passion Into a Career</p>
      </div>
      <h2 style="color: #333;">Welcome, ${data.name}! 🌸</h2>
      <p style="color: #555; line-height: 1.8;">We're thrilled to have you join our community of beauty professionals. Your journey to becoming a certified beauty expert starts now!</p>
      <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #e91e63;">
        <h3 style="color: #c2185b; margin: 0 0 10px 0;">What awaits you:</h3>
        <ul style="color: #555; line-height: 2;">
          <li>🎥 Live Interactive Classes</li>
          <li>📄 Premium Study Notes & PDFs</li>
          <li>🏆 Industry-Recognized Certificates</li>
          <li>👩‍🏫 Expert Mentorship</li>
        </ul>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/pricing" style="background: linear-gradient(135deg, #e91e63, #9c27b0); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">Explore Plans →</a>
      </div>
      <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">© ${new Date().getFullYear()} Beauty Master Academy. All rights reserved.</p>
    </div>
  `,

  paymentReceipt: (data) => `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="text-align: center; background: linear-gradient(135deg, #e91e63, #9c27b0); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0;">✅ Payment Confirmed</h1>
      </div>
      <p>Hi <strong>${data.name}</strong>,</p>
      <p>Your payment has been received and your subscription is now active!</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #fce4ec;"><td style="padding: 12px; border-radius: 4px; font-weight: bold;">Plan</td><td style="padding: 12px;">${data.plan}</td></tr>
        <tr><td style="padding: 12px; font-weight: bold;">Amount</td><td style="padding: 12px;">₹${data.amount}</td></tr>
        <tr style="background: #fce4ec;"><td style="padding: 12px; font-weight: bold;">Payment ID</td><td style="padding: 12px; font-size: 12px;">${data.paymentId}</td></tr>
        <tr><td style="padding: 12px; font-weight: bold;">Valid Till</td><td style="padding: 12px;">${data.expiry}</td></tr>
      </table>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #e91e63, #9c27b0); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">Go to Dashboard →</a>
      </div>
    </div>
  `,

  resetPassword: (data) => `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fff; border-radius: 16px;">
      <h2 style="color: #c2185b;">🔑 Reset Your Password</h2>
      <p>Hi ${data.name}, we received a request to reset your password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetUrl}" style="background: linear-gradient(135deg, #e91e63, #9c27b0); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #888; font-size: 12px;">This link expires in 15 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `,
};

exports.sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    const htmlContent = html || (templates[template] ? templates[template](data) : '<p>Notification from Beauty Master Academy</p>');
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};
