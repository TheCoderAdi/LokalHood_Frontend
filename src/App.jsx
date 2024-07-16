import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./redux/action";
import { toast } from "react-toastify";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import UserHome from "./pages/Home/UserHome";
import VendorHome from "./pages/Home/VendorHome";
import UserProfile from "./pages/Profile/UserProfile";
import VendorProfile from "./pages/Profile/VendorProfile";
import Products from "./pages/Product/Products";
import CreateProduct from "./pages/Product/CreateProduct";
import EditProduct from "./pages/Product/EditProduct";
import UserCart from "./pages/Cart/UserCart";
import VisitShop from "./pages/Shop/VisitShop";
import VendorOrder from "./pages/Order/VendorOrder";
import UserOrder from "./pages/Order/UserOrder";
import CheckOut from "./pages/Checkout/CheckOut";
import OrderDetails from "./pages/Order/OrderDetails";
import UserOrderDetails from "./pages/Order/UserOrderDetails";
import OrderHistory from "./pages/Order/OrderHistory";
import Review from "./pages/Review/Review";
import UserReviews from "./pages/Review/UserReviews";
import { vendorRoles } from "./lib/data";
import ManageSeats from "./pages/Restaurant/ManageSeats";
import BookSeat from "./pages/Restaurant/BookSeat";
import BookedSeat from "./pages/Restaurant/BookedSeat";

const App = () => {
  const dispatch = useDispatch();
  const { error, message, loading, user, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const message = urlParams.get("message");

    if (paymentStatus) {
      toast.success("Order placed successfully");
      window.history.replaceState({}, document.title, "/orders");
    }

    if (message) {
      toast.error(message);
      window.history.replaceState({}, document.title, "/register");
    }
  }, []);

  if (loading || isAuthenticated === null) return <Loader />;

  // eslint-disable-next-line react/prop-types
  const PrivateRoute = ({ children, role }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    // eslint-disable-next-line react/prop-types
    if (role && !role.includes(user?.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "user" ? (
                <UserHome />
              ) : (
                <VendorHome />
              )
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              {user?.role === "user" ? <UserProfile /> : <VendorProfile />}
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute role={vendorRoles}>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-product"
          element={
            <PrivateRoute role={vendorRoles}>
              <CreateProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <PrivateRoute role={vendorRoles}>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute role={["user"]}>
              <UserCart />
            </PrivateRoute>
          }
        />
        <Route
          path="/visit-shop/:id"
          element={
            <PrivateRoute role={["user"]}>
              <VisitShop />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <PrivateRoute role={["user"]}>
              <BookSeat />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendor-orders"
          element={
            <PrivateRoute role={vendorRoles}>
              <VendorOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute role={["user"]}>
              <UserOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute role={["user"]}>
              <CheckOut />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <PrivateRoute role={vendorRoles}>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute role={["user"]}>
              <UserOrderDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <PrivateRoute role={vendorRoles}>
              <OrderHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <PrivateRoute role={["user"]}>
              <Review />
            </PrivateRoute>
          }
        />
        <Route
          path="/order/:id/review"
          element={
            <PrivateRoute role={vendorRoles}>
              <UserReviews />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-seats"
          element={
            <PrivateRoute role={["restaurant"]}>
              <ManageSeats />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute role={["user"]}>
              <BookedSeat />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
