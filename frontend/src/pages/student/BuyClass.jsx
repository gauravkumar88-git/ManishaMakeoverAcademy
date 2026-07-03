import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../utils/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import {
  FiBook,
  FiUser,
  FiClock,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";

export default function BuyClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchClass();
  }, []);

  const fetchClass = async () => {
    try {
      const res = await api.get(`/classes/${id}`);
      setCls(res.data.class);
    } catch (err) {
      toast.error("Unable to load class.");
    } finally {
      setLoading(false);
    }
  };

const handleBuy = async () => {
  try {
    setBuying(true);

    const { data } = await api.post("/class-purchase/create-order", {
      classId: cls._id,
    });

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,

      name: "Manisha Makeover Academy",
      description: cls.title,

      handler: async function (response) {
        try {
          await api.post("/class-purchase/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            purchaseId: data.purchaseId,
          });

          toast.success("Class Purchased Successfully");

          navigate("/my-classes");

        } catch (err) {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name: "",
        email: "",
      },

      theme: {
        color: "#E91E8C",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Unable to create order");
  } finally {
    setBuying(false);
  }
};

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!cls) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-white">
          Class not found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">

        <motion.div
          initial={{ opacity:0,y:20 }}
          animate={{ opacity:1,y:0 }}
          className="grid lg:grid-cols-2 gap-8"
        >

          {/* Left */}

          <div className="glass rounded-3xl overflow-hidden">

            <img
              src={
                cls.thumbnail ||
                "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1000"
              }
              alt={cls.title}
              className="w-full h-80 object-cover"
            />

            <div className="p-6">

              <h1 className="text-3xl font-bold text-white mb-3">
                {cls.title}
              </h1>

              <p className="text-gray-400 mb-6">
                {cls.description}
              </p>

              <div className="space-y-3">

                <div className="flex items-center gap-3 text-gray-300">
                  <FiUser />
                  {cls.instructor}
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FiCalendar />
                  {new Date(cls.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FiClock />
                  {cls.time}
                </div>

              </div>

            </div>

          </div>

          {/* Right */}

          <motion.div
            initial={{ opacity:0,x:30 }}
            animate={{ opacity:1,x:0 }}
            className="glass rounded-3xl p-8 sticky top-28 h-fit"
          >

            <h2 className="text-2xl font-bold text-white mb-6">
              Purchase Course
            </h2>

            <div className="text-5xl font-bold text-green-400 mb-8">
              ₹{cls.price}
            </div>

            <div className="space-y-4 mb-8">

              <div className="flex gap-3">
                <FiCheckCircle className="text-green-400 mt-1"/>
                <span className="text-gray-300">
                  Lifetime Access
                </span>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-green-400 mt-1"/>
                <span className="text-gray-300">
                  HD Live Classes
                </span>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-green-400 mt-1"/>
                <span className="text-gray-300">
                  Notes Included
                </span>
              </div>

              <div className="flex gap-3">
                <FiCheckCircle className="text-green-400 mt-1"/>
                <span className="text-gray-300">
                  Certificate Included
                </span>
              </div>

            </div>

            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-4 rounded-2xl text-lg font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg,#E91E8C,#9C27B0)"
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <FiCreditCard />
                Buy Now ₹{cls.price}
              </div>
            </button>

            <p className="text-center text-gray-500 mt-5 text-sm">
              Secure payment powered by Razorpay
            </p>

          </motion.div>

        </motion.div>

      </div>
    </DashboardLayout>
  );
}