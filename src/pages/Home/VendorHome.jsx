import { useDispatch, useSelector } from "react-redux";
import { profileIsCompleteVendor } from "../../lib/helper";
import { Link } from "react-router-dom";
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
  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [seats, setSeats] = useState(0);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

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
            <p>Total Products : {user?.products.length}</p>
            <p>Start managing your products</p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginBlock: "10px",
              }}
            >
              <Link to="/create-product" className="vendor-home__button">
                Add Products
              </Link>
              <Link to="/products" className="vendor-home__button">
                Manage Products
              </Link>
            </div>
            <p>Total Orders : {orders.length}</p>
            <p>Start managing your orders</p>
            <Link
              to="/vendor-orders"
              className="vendor-home__button"
              style={{
                margin: "10px auto",
              }}
            >
              Manage Orders
            </Link>
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
                <p>Total Seats : {user?.totalSeats}</p>
                <p>
                  Availabel Seats: {user?.totalSeats - user?.tables?.length}
                </p>
                <p>Start managing your seats</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    marginBlock: "10px",
                  }}
                >
                  <Link
                    onClick={() => setShow(!show)}
                    className="vendor-home__button"
                  >
                    Add Seats
                  </Link>
                  <Link to="/manage-seats" className="vendor-home__button">
                    Manage Seats
                  </Link>
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
