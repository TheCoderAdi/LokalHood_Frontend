import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import axios from "axios";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import "../../styles/orderdetails.css";

const OrderDetails = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/order/${id}`, {
        withCredentials: true,
      });
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const updateStatus = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${server}/vendor/order/${id}`,
        { status: "Delivered" },
        {
          withCredentials: true,
        }
      );
      setOrder(data.order);
      toast.success("Order status updated successfully");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  if (loading) return <Loader />;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === order.orderItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? order.orderItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {order && !loading ? (
        <div className="order-details__container">
          <div className="order__details">
            <div className="order-details__left">
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="slider">
                  <div
                    className="slider__wrapper"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {order.orderItems.map((product) => (
                      <div key={product._id} className="order-details__card">
                        <img
                          src={product.image.url}
                          alt={product.product.name}
                        />
                        <p>{product.product.name}</p>
                        <p>Price: ₹{product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider__button left"
                    onClick={prevSlide}
                    style={{
                      display: order.orderItems.length > 1 ? "" : "none",
                    }}
                  >
                    &lt;
                  </button>
                  <button
                    className="slider__button right"
                    onClick={nextSlide}
                    style={{
                      display: order.orderItems.length > 1 ? "" : "none",
                    }}
                  >
                    &gt;
                  </button>
                </div>
              ) : null}
            </div>
            <div className="order-details__right">
              <p>
                Amount: ₹
                {order.orderItems ? order?.orderItems[0]?.totalAmount : null}
              </p>
              <p style={{ textTransform: "capitalize" }}>
                Payment Status: {order.paymentInfo?.status}
              </p>
              <p>Order Status: {order.orderStatus}</p>
              <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
              <p>
                Delivered At:{" "}
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleString()
                  : "Not Delivered"}
              </p>
              <p>Shipping Info: {order.shippingInfo?.address}</p>
              <p>Phone: {order.shippingInfo?.phoneNumber}</p>
              <button
                onClick={() => updateStatus(order._id)}
                disabled={order.orderStatus === "Delivered"}
                style={{
                  opacity: order.orderStatus === "Delivered" ? 0.5 : 1,
                  cursor:
                    order.orderStatus === "Delivered"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Update Order Status
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OrderDetails;
