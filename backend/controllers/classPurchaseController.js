const Razorpay = require("razorpay");
const crypto = require("crypto");

const Class = require("../models/Class");
const User = require("../models/User");

const { Payment, Notification } = require("../models");
const ClassPurchase = require("../models/ClassPurchase");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createClassOrder = async (req, res) => {
  try {
    const { classId } = req.body;

    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const order = await razorpay.orders.create({
      amount: cls.price * 100,
      currency: "INR",
      receipt: `class_${Date.now()}`,
    });

    const purchase = await ClassPurchase.create({
      userId: req.user._id,
      classId,
      amount: cls.price,
      paymentId: order.id,
      status: "pending",
    });

    res.json({
      success: true,
      order,
      purchaseId: purchase._id,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.verifyClassPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purchaseId,
    } = req.body;

    // Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Update purchase
    const purchase = await ClassPurchase.findByIdAndUpdate(
      purchaseId,
      {
        paymentId: razorpay_payment_id,
        status: "paid",
      },
      { new: true }
    );

    // Enroll student
    await Class.findByIdAndUpdate(
      purchase.classId,
      {
        $addToSet: {
          enrolledStudents: req.user._id,
        },
      }
    );

    // Notification
    await Notification.create({
      userId: req.user._id,
      title: "Class Purchased 🎉",
      message: "Your class has been unlocked successfully.",
      type: "payment",
    });

    res.json({
      success: true,
      purchase,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getMyPurchasedClasses = async (req, res) => {
  try {
    const purchases = await ClassPurchase.find({
      userId: req.user._id,
      status: "paid",
    }).select("classId");

    res.json({
      success: true,
      purchases,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};