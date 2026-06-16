# 💄 Beauty Master Academy — Full MERN Stack Platform

A premium subscription-based live beauty education platform built with the MERN stack.

---

## 🚀 Tech Stack

| Layer       | Tech                                           |
|-------------|------------------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, Framer Motion, Redux Toolkit |
| Backend     | Node.js, Express.js                            |
| Database    | MongoDB Atlas + Mongoose                       |
| Auth        | JWT + HTTP-Only Cookies + Google OAuth         |
| Payments    | Razorpay                                       |
| File Upload | Cloudinary (images + PDFs + videos)            |
| Email       | Nodemailer (Gmail SMTP)                        |
| Deployment  | Frontend → Vercel · Backend → Render           |

---

## 📁 Project Structure

```
beauty-master-academy/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Auth, Class, Payment, Notes, Admin...
│   ├── middleware/       # JWT auth, admin guard
│   ├── models/          # User, Class, Note, Attendance, Payment, Certificate...
│   ├── routes/          # All API routes
│   ├── utils/           # Email templates (Nodemailer)
│   ├── server.js        # Entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, DashboardLayout, WhatsApp button
    │   ├── pages/       # All public + student + admin pages
    │   ├── store/       # Redux slices (auth, classes, ui, notifications)
    │   └── utils/       # Axios instance
    ├── index.html
    ├── vite.config.js
    └── .env.example
```

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `.env.example` → `.env` and fill in:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@beautymaster.com
ADMIN_PASSWORD=Admin@123456
```

**Frontend** — copy `.env.example` → `.env`:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Create Admin Account

After starting the backend, run this in the backend folder:

```bash
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
    referralCode: 'ADMIN001'
  });
  console.log('Admin created!');
  process.exit(0);
});
"
```

### 4. Add Razorpay Script to index.html

Add inside `<head>` in `frontend/index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 5. Run Development Servers

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---

## 🌍 Deployment

### Backend → Render

1. Push backend to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add all environment variables

### Frontend → Vercel

1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set framework: **Vite**
4. Add environment variables:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID` = your Google OAuth client ID

---

## 🎯 Features

### Student
- ✅ Register / Login / Google OAuth
- ✅ Forgot & Reset Password
- ✅ View & Join Live Classes (Google Meet)
- ✅ Download PDF Notes
- ✅ Attendance Tracking
- ✅ Generate & Download Certificates
- ✅ View Payment History
- ✅ Subscription Plans (Basic / Premium / VIP)
- ✅ Coupon Code Support
- ✅ Notifications
- ✅ Profile Management

### Admin
- ✅ Create / Edit / Delete Classes
- ✅ Upload PDF Notes per Class
- ✅ Manage Students
- ✅ View All Payments
- ✅ Send Global Notifications
- ✅ Create & Manage Coupons
- ✅ Dashboard Analytics

### Public
- ✅ Landing Page with Hero, Features, Testimonials
- ✅ Courses Page with Filters
- ✅ Pricing Page with Razorpay
- ✅ Blog Page
- ✅ About Page
- ✅ Contact Page with WhatsApp Support
- ✅ Certificate Verification Page
- ✅ Dark Mode UI

---

## 🔐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |
| GET  | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Forgot password |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET  | `/api/classes` | List all classes |
| POST | `/api/classes` | Create class (admin) |
| POST | `/api/classes/:id/join` | Join class (subscribe) |
| GET  | `/api/notes` | Get all notes |
| POST | `/api/notes` | Upload note PDF (admin) |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify & activate subscription |
| GET  | `/api/attendance/my` | My attendance |
| POST | `/api/certificates/generate` | Generate certificate |
| GET  | `/api/certificates/verify/:id` | Verify certificate (public) |
| GET  | `/api/admin/dashboard` | Admin stats |
| GET  | `/api/admin/students` | All students |

---

## 📞 Support

For help, WhatsApp: **+91 98765 43210**

© 2025 Beauty Master Academy
# manisha-makeover-academy
