import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animData from "../../assets/anim1.json";

const OrderHistory = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const getOrderHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/order-history`, {
        withCredentials: true,
      });
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0)
    return (
      <div className="no-orders__container">
        <Lottie
          animationData={animData}
          style={{ width: "300px", height: "300px" }}
        />
        <p>Currently you don&apos;t have delivered orders.</p>
        <Link to="/vendor-orders" className="back__link">
          Go Back Orders
        </Link>
      </div>
    );

  return (
    <div className="vendor-order__container">
      <h1>Order History</h1>
      <div className="orders__container">
        {orders.map((order) => (
          <div key={order._id} className="order__card">
            {order.orderItems.length > 1 ? (
              <div className="order__multiple__images">
                {[0, 1].map((i) => {
                  return (
                    <img
                      src={order.orderItems[i].image.url}
                      alt={order.orderItems[i].name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "100%",
                        border: "2px solid #333",
                      }}
                      key={i}
                    />
                  );
                })}
                <p>
                  {order.orderItems.length - 2 === 0
                    ? ""
                    : `+${order.orderItems.length - 2}more`}
                </p>
              </div>
            ) : (
              <img
                src={order.orderItems[0].image.url}
                alt={order.orderItems[0].name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "100%",
                  border: "2px solid #333",
                }}
              />
            )}
            <p>Amount: ₹{order.orderItems[0].totalAmount}</p>
            <p
              style={{
                textTransform: "capitalize",
              }}
            >
              Payment: {order.paymentInfo.status}
            </p>
            <p>Delivered: {order.orderStatus}</p>
            <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>

            <Link to={`/order/${order._id}`} className="order__link">
              View Order
            </Link>
            {order.reviewed && (
              <Link to={`/order/${order._id}/review`} className="order__link">
                View Review
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
