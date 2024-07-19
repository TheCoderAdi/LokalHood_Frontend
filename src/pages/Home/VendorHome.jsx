import { useDispatch, useSelector } from "react-redux";
import { profileIsCompleteVendor } from "../../lib/helper";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/vendorhome.css";
import axios from "axios";
import { server } from "../../redux/store";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { vendorRoles } from "../../lib/data";
import { loadUser } from "../../redux/action";

const VendorHome = () => {
  const { user, orders: userOrders } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [mostSelled, setMostSelled] = useState([]);
  const [orders, setOrders] = useState([]);
  const [seats, setSeats] = useState(0);
  const [show, setShow] = useState(false);
  const [outOfStock, setOutOfStock] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [todayRequest, setTodayRequest] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date().getDate();

  const profileCompletion = profileIsCompleteVendor(user);

  const getOrders = async () => {
    try {
      setLoading(false);
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

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!seats) return toast.error("Please enter number of seats to add");
    if (seats <= 0) return toast.error("Please enter a valid number of seats");
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/vendor/update-seat`,
        { seats },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setLoading(false);
      setSeats(0);
      if (show) setShow(false);
      dispatch(loadUser());
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const mostSelledProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/vendor/most-selled`, {
        withCredentials: true,
      });
      setMostSelled(data.productName);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const outOfStockProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/vendor/out-of-stock`, {
        withCredentials: true,
      });
      setOutOfStock(data.outOfStockProducts);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    mostSelledProduct();
    outOfStockProducts();
  }, []);

  useEffect(() => {
    if (userOrders) {
      let customers = [];
      let amount = 0;
      userOrders.forEach((order) => {
        if (!customers.includes(order.user)) {
          customers.push(order.user);
        }
        amount += order.orderItems[0].totalAmount;
        if (new Date(order.createdAt).getDate() === today) {
          setTodaySales((prev) => prev + order.orderItems[0].totalAmount);
        }
      });
      setTotalCustomers(customers.length);
      setTotalAmount(amount);
    }
  }, [userOrders, today]);

  useEffect(() => {
    if (orders) {
      let todayOrders = 0;
      orders.map((order) => {
        if (new Date(order.createdAt).getDate() === today) {
          todayOrders += 1;
        }
      });
      setTodayOrders(todayOrders);
    }
  }, [orders, today]);

  useEffect(() => {
    if (user?.role === "restaurant") {
      let confirmedSeats = 0;
      let requests = 0;
      user?.tables.map((table) => {
        if (table.confirmed) confirmedSeats += 1;
        if (new Date(table.requestedAt).getDate() === today) requests += 1;
      });
      setAvailableSeats(user?.totalSeats - confirmedSeats);
      setTodayRequest(requests);
    }
  }, [user, today]);

  useEffect(() => {
    if (profileCompletion === 100) getOrders();
  }, [profileCompletion]);

  if (profileCompletion < 100) {
    return (
      <div className="user-home__progress">
        <div className="user-home__profile">
          <h1>Complete your profile</h1>
          <p>
            Let&apos;s go only {100 - profileCompletion}% left to complete your
            profile
          </p>
          <Link to="/profile" className="complete-btn">
            Complete Profile
          </Link>
          <div className="user-home__profile__progress">
            <motion.div
              className="user-home__profile__progress__bar"
              style={{ width: `${profileCompletion}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${profileCompletion}%` }}
              transition={{ duration: 1.5 }}
            ></motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="vendor-home__container">
      <motion.div
        className="vendor-home__header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome, {user?.name}!</h1>
        <motion.img
          src={user?.profilePic.url}
          alt={user?.name}
          style={{
            borderRadius: "50%",
            width: "100px",
            height: "100px",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>
      <div className="vendor-home__inner-container">
        {vendorRoles.includes(user?.role) ? (
          <motion.div
            className="vendor-home__section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="vendor-boxes">
              <div className="vendor-box">
                <h3>Total Sales</h3>
                <p>₹{totalAmount}</p>
              </div>
              <div className="vendor-box">
                <h3>Total Customers</h3>
                <p>{totalCustomers}</p>
              </div>
              <div className="vendor-box">
                <h3>most slod product</h3>
                <p>{mostSelled ? mostSelled : "No product sold yet"}</p>
              </div>
              <div className="vendor-box">
                <h3>convinence fees</h3>
                <p>2%</p>
              </div>
            </div>
            <div className="vendor-actions">
              <div className="vendor-actions__box-left">
                <h3>Today</h3>
                <p>Recieved Orders : {todayOrders}</p>
                <p>Revenue : ₹{todaySales}</p>
              </div>
              <div className="vendor-actions__box-right">
                <h3>Stock Alert</h3>
                <div className="stocks-container">
                  {outOfStock !== null ? (
                    outOfStock.map((product) => (
                      <div className="stock" key={product.id}>
                        <p>{product.name}</p>
                        <button
                          onClick={() =>
                            navigate(`/edit-product/${product.id}`)
                          }
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No products are out of stock</p>
                  )}
                </div>
              </div>
            </div>
            <div className="vendor-managing">
              <div className="managing-boxes">
                <h3>Add Product</h3>
                <p>Total Products : {user?.products?.length}</p>
                <button onClick={() => navigate("/create-product")}>
                  Add Products
                </button>
              </div>
              <div className="managing-boxes">
                <h3>Manage Product</h3>
                <p>Total Products : {user?.products?.length}</p>
                <button onClick={() => navigate("/products")}>
                  Manage Products
                </button>
              </div>
              <div className="managing-boxes">
                <h3>Manage Orders</h3>
                <p>Pending Orders : {orders.length}</p>
                <button onClick={() => navigate("/vendor-orders")}>
                  Manage Orders
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {user?.totalSeats > 0 ? (
              <motion.div
                className="vendor-home__section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="vendor-boxes">
                  <div className="vendor-box">
                    <h3>Total Seats</h3>
                    <p>{user?.totalSeats}</p>
                  </div>
                  <div className="vendor-box">
                    <h3>Available Seats</h3>
                    <p>{availableSeats}</p>
                  </div>
                  <div className="vendor-box">
                    <h3>convinence fees</h3>
                    <p>2%</p>
                  </div>
                </div>
                <div className="vendor-actions">
                  <div
                    className="vendor-actions__box-left"
                    style={{
                      height: "150px",
                    }}
                  >
                    <h3>Today</h3>
                    <p>Total Table Requests : {todayRequest}</p>
                    {todayRequest > 0 && (
                      <button
                        onClick={() => navigate("/requests")}
                        className="vendor-home__button"
                      >
                        Go To Requests
                      </button>
                    )}
                  </div>
                </div>
                <div className="vendor-managing">
                  <div
                    className="managing-boxes"
                    style={{ alignItems: "center" }}
                  >
                    <p>
                      Want to add more seats? You can add more seats to your
                      restaurant
                    </p>
                    <button
                      onClick={() => setShow(!show)}
                      className="vendor-home__button"
                    >
                      Add Seats
                    </button>
                  </div>
                  <div
                    className="managing-boxes"
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <p>
                      Want to manage seats? You can manage your restaurant seats
                    </p>
                    <button
                      onClick={() => navigate("/manage-seats")}
                      to="/manage-seats"
                      className="vendor-home__button"
                    >
                      Manage Seats
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="vendor-home__section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <p>
                  You have not added any seats yet. Please add seats to start
                  managing them.
                </p>
                <form onSubmit={handleOnSubmit} className="add-seats__form">
                  <label htmlFor="seats">Total Seats</label>
                  <input
                    type="number"
                    placeholder="Enter number of seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    min={0}
                    required
                  />
                  <button className="vendor-home__button">
                    {loading ? "Adding Seats..." : "Add Seats"}
                  </button>
                </form>
              </motion.div>
            )}
            {show && (
              <motion.div
                className="vendor-home__section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  marginTop: "20px",
                }}
              >
                <form onSubmit={handleOnSubmit} className="add-seats__form">
                  <label htmlFor="seats">Total Seats</label>
                  <input
                    type="number"
                    placeholder="Enter number of seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    min={0}
                    required
                  />
                  <button className="vendor-home__button">
                    {loading ? "Adding Seats..." : "Add Seats"}
                  </button>
                </form>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VendorHome;
