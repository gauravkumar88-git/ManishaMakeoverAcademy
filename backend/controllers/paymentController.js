const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { Payment, Coupon, Notification } = require('../models/index');
const { sendEmail } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  basic:   { price: 49900,  label: 'Basic',   duration: 30 },
  premium: { price: 99900,  label: 'Premium',  duration: 30 },
  vip:     { price: 199900, label: 'VIP',      duration: 30 },
};

// @POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  const { plan, couponCode } = req.body;
  if (!PLANS[plan]) return res.status(400).json({ success: false, message: 'Invalid plan.' });

  let amount = PLANS[plan].price;
  let discountAmount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) return res.status(400).json({ success: false, message: 'Invalid or expired coupon.' });
    if (coupon.validTill && new Date() > coupon.validTill) {
      return res.status(400).json({ success: false, message: 'Coupon expired.' });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
    }
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.floor(amount * coupon.discountValue / 100);
    } else {
      discountAmount = coupon.discountValue * 100;
    }
    amount = Math.max(amount - discountAmount, 0);
  }

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { userId: req.user._id.toString(), plan },
  });

  // Save pending payment
  const payment = await Payment.create({
    userId: req.user._id,
    razorpayOrderId: order.id,
    amount: amount / 100,
    subscriptionPlan: plan,
    couponCode: coupon ? coupon.code : undefined,
    discountAmount: discountAmount / 100,
  });

  res.json({
    success: true,
    order,
    key: process.env.RAZORPAY_KEY_ID,
    amount,
    payment: payment._id,
  });
};

// @POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, paymentDbId } = req.body;

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed.' });
  }

  // Update payment record
  const payment = await Payment.findByIdAndUpdate(paymentDbId, {
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: 'paid',
  }, { new: true });

  // Activate subscription
  const duration = PLANS[plan].duration;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + duration);

  const user = await User.findByIdAndUpdate(req.user._id, {
    subscriptionPlan: plan,
    subscriptionActive: true,
    subscriptionExpiry: expiry,
  }, { new: true });

  // Update coupon usage
  if (payment.couponCode) {
    await Coupon.findOneAndUpdate({ code: payment.couponCode }, { $inc: { usedCount: 1 } });
  }

  // Send receipt email
  await sendEmail({
    to: user.email,
    subject: '✅ Payment Confirmed - Beauty Master Academy',
    template: 'paymentReceipt',
    data: {
      name: user.name,
      plan: PLANS[plan].label,
      amount: payment.amount,
      paymentId: razorpay_payment_id,
      expiry: expiry.toDateString(),
    },
  });

  // Create notification
  await Notification.create({
    userId: req.user._id,
    title: 'Subscription Activated! 🎉',
    message: `Your ${PLANS[plan].label} plan is now active till ${expiry.toDateString()}.`,
    type: 'payment',
  });

  await Payment.findByIdAndUpdate(paymentDbId, { receiptSent: true });

  res.json({ success: true, message: 'Payment verified. Subscription activated!', user });
};

// @GET /api/payments/my-payments
exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id, status: 'paid' }).sort({ createdAt: -1 });
  res.json({ success: true, payments });
};

// @POST /api/payments/validate-coupon
exports.validateCoupon = async (req, res) => {
  const { code, plan } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon.' });
  if (coupon.validTill && new Date() > coupon.validTill) return res.status(400).json({ success: false, message: 'Coupon expired.' });
  if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon exhausted.' });

  const basePrice = PLANS[plan]?.price / 100 || 0;
  const discount = coupon.discountType === 'percentage'
    ? Math.floor(basePrice * coupon.discountValue / 100)
    : coupon.discountValue;

  res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount, finalPrice: basePrice - discount } });
};


exports.verifyDummy = async (req, res) => {
  try {

    const { plan, paymentDbId } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentDbId,
      {
        status: 'paid',
        razorpayPaymentId: 'DUMMY_' + Date.now(),
      },
      { new: true }
    );

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionPlan: plan,
        subscriptionActive: true,
        subscriptionExpiry: expiry,
      }
    );

    res.json({
      success: true,
      payment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};