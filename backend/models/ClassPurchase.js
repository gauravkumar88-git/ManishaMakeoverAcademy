const mongoose = require("mongoose");

const classPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClassPurchase", classPurchaseSchema);