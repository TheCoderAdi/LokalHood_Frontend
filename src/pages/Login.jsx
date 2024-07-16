import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import "../styles/login.css";
import { server } from "../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleClick = () => {
    window.open(`${server}/google/universal/login`, "_self");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="login-card"
      >
        <h1>Log in to continue</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="google-login-button"
          onClick={handleClick}
        >
          <FcGoogle />
          Login with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginPage;
