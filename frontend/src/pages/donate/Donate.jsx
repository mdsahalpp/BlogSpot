import { useState, useContext } from "react";
import AuthContext from "../../context/authContext";
import axios from "axios";
import "./donate.css";

const Donate = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const amounts = [10, 100, 1000];

  const { user } = useContext(AuthContext);
  const key = import.meta.env.VITE_RAZORPAY_API_KEY;
  const token = localStorage.getItem("token");

  const handleDonate = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/donate/create-order",
        {
          amount: selected,
          donor: {
            name: user.username,
            email: user.email,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const options = {
        key: key,
        amount: data.o_amount,
        currency: data.o_currency,
        name: "BlogSpot",
        description: "Thank you for supporting us ❤️",
        order_id: data.o_id,
        handler: async function (response) {
          await axios.post(
            "http://localhost:5000/donate/verify-order",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert("✅ Payment Successful!");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error : ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-page">
      <h1>Donation</h1>
      <div className="d-card">
        <h3 id="h-options">Select the amount</h3>
        <p className="d-thanks">
          {selected
            ? `You selected ₹${selected}. Thank you for your kindness!`
            : "Your kindness makes a big difference — thank you!"}
        </p>

        <div className="d-options">
          {amounts.map((amt) => (
            <div
              key={amt}
              className={`d-amount ${selected === amt ? "selected" : ""}`}
              onClick={() => setSelected(amt)}
            >
              ₹{amt}
            </div>
          ))}
        </div>
        <button
          className="d-btn"
          onClick={handleDonate}
          disabled={!selected || loading}
        >
          {loading
            ? "Processing..."
            : selected
            ? `Donate ₹${selected}`
            : "Donate"}
        </button>
      </div>
    </div>
  );
};

export default Donate;
