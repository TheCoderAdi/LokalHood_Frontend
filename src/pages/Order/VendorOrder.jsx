import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import "../../styles/usersorder.css";
import Lottie from "lottie-react";
import animData from "../../assets/anim1.json";
import "../../styles/vendororder.css";

const VendorOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/orders`, {
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
    getOrders();
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0)
    return (
      <div className="no-orders__container">
        <Lottie
          animationData={animData}
          style={{ width: "300px", height: "300px" }}
        />
        <p>
          Currently you have no active orders.
          <br /> Once you have orders, they will appear here.
        </p>
        <Link to="/" className="back__link">
          Go Back Home
        </Link>
      </div>
    );

  return (
    <div className="vendor-order__container">
      <h1>Orders</h1>
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
                <p
                  style={{
                    letterSpacing: "1px",
                    color: "#333",
                    marginLeft: "1px",
                  }}
                >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrder;
