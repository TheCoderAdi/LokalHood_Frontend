import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import animData from "../../assets/anim1.json";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserOrder = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/my-orders`, {
        withCredentials: true,
      });

      setOrders(data.orders);
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
        <p>Currently you have no orders.</p>
        <Link to="/" className="back__link">
          Go Back Home
        </Link>
      </div>
    );

  return (
    <div className="user-order__container">
      <h1>My Orders</h1>
      <div className="orders__container">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order__card"
            style={{
              justifyContent: `${order.reviewed ? "space-around" : "center"}`,
            }}
          >
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
            <div
              style={{
                marginBlock: `${order.reviewed ? "0px" : "10px"}`,
              }}
            >
              <p>Amount: ₹{order.totalAmount}</p>
              <p>Order Status: {order.orderStatus}</p>
            </div>
            <Link to={`/orders/${order._id}`} className="order__link">
              View Details
            </Link>
            {order.orderStatus === "Delivered" && !order.reviewed && (
              <Link to={`/review/${order._id}`} className="order__link">
                Write a Review
              </Link>
            )}
            {order.reviewed && <div className="reviewed__badge">Reviewed</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;
