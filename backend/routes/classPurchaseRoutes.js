const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
  createClassOrder,
  verifyClassPayment,
  getMyPurchasedClasses,
} = require("../controllers/classPurchaseController");

router.post("/create-order", protect, createClassOrder);

router.post("/verify", protect, verifyClassPayment);

router.get("/my", protect, getMyPurchasedClasses);

module.exports = router;