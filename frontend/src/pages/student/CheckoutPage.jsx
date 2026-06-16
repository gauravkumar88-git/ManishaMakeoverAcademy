import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../utils/api";

export default function CheckoutPage() {
  const { plan } = useParams();
  const navigate = useNavigate();

  const prices = {
    basic: 499,
    premium: 999,
    vip: 1999,
  };

  const handleDummyPayment = async () => {
    try {
 await api.post('/payments/verify-dummy', {
  plan
});

      navigate("/payments");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="glass p-8 rounded-2xl max-w-md mx-auto">
        <h1 className="text-2xl text-white font-bold">
          {plan.toUpperCase()} Plan
        </h1>

        <p className="text-gray-400 mt-3">
          Amount: ₹{prices[plan]}
        </p>

        <button
          onClick={handleDummyPayment}
          className="btn-primary mt-6 w-full"
        >
          Dummy Pay ₹{prices[plan]}
        </button>
      </div>
    </DashboardLayout>
  );
}