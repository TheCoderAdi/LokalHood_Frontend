import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "../styles/navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/action";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const userLinks = [
    { name: "Map", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Bookings", path: "/bookings" },
    { name: "Orders", path: "/orders" },
    { name: "Cart", path: "/cart" },
    { name: "Logout", path: "/logout" },
  ];

  const vendorLinks =
    user?.role !== "restaurant"
      ? [
          { name: "Home", path: "/" },
          { name: "Profile", path: "/profile" },
          { name: "Products", path: "/products" },
          { name: "Orders", path: "/order-history" },
          { name: "Logout", path: "/logout" },
        ]
      : [
          { name: "Home", path: "/" },
          { name: "Profile", path: "/profile" },
          { name: "Requests", path: "/requests" },
          { name: "Bookings", path: "/manage-seats" },
          { name: "Logout", path: "/logout" },
        ];

  const guestLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav>
        <div className="logo">
          <Link to="/">LokalHood</Link>
        </div>
        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          {user
            ? user?.role === "user"
              ? userLinks.map((link, index) => (
                  <li key={index} onClick={closeMobileMenu}>
                    {link.name === "Logout" ? (
                      <button className="logout-btn" onClick={handleLogout}>
                        {link.name}
                      </button>
                    ) : (
                      <Link to={link.path}>{link.name}</Link>
                    )}
                  </li>
                ))
              : vendorLinks.map((link, index) => (
                  <li key={index} onClick={closeMobileMenu}>
                    {link.name === "Logout" ? (
                      <button className="logout-btn" onClick={handleLogout}>
                        {link.name}
                      </button>
                    ) : (
                      <Link to={link.path}>{link.name}</Link>
                    )}
                  </li>
                ))
            : guestLinks.map((link, index) => (
                <li key={index} onClick={closeMobileMenu}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
        </ul>
        <div className="menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
