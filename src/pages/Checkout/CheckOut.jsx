import {
  useElements,
  useStripe,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { server } from "../../redux/store";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import "../../styles/checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_SECRET);

const CheckOut = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/user/make-payment`,
        { totalAmount: state.totalAmount },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setClientSecret(data.client_secret);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!state) navigate("/cart");
  }, [state, navigate]);

  useEffect(() => {
    handlePayment();
  }, []);

  if (loading || !clientSecret) return <Loader />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckOutForm state={state} />
    </Elements>
  );
};

export default CheckOut;

const CheckOutForm = ({ state }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const vendorTotals = {};
    state.cart.forEach((item) => {
      const vendorId = item.product.vendor;
      const itemTotal = item.product.price * item.quantity;
      if (vendorTotals[vendorId]) {
        vendorTotals[vendorId] += itemTotal;
      } else {
        vendorTotals[vendorId] = itemTotal;
      }
    });

    const orderItems = state.cart.map((item) => ({
      quantity: item.quantity,
      image: item.product.image,
      price: item.product.price,
      product: item.product._id,
      vendor: item.product.vendor,
      totalAmount: vendorTotals[item.product.vendor],
    }));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
    const paymentInfo = {
      id: paymentIntent.id,
      status: paymentIntent.status,
    };

    if (paymentIntent.status === "succeeded") {
      await axios.post(
        `${server}/user/make-an-order`,
        {
          orderItems,
          totalAmount: state.totalAmount,
          paymentInfo,
        },
        {
          withCredentials: true,
        }
      );

      navigate("/");
      toast.success("Order placed successfully");
    }

    setLoading(false);
  };

  return (
    <div className="checkout__container">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

CheckOutForm.propTypes = {
  state: PropTypes.object.isRequired,
};
