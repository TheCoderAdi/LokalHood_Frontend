import "../styles/register.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register-vendor.css";
import { server } from "../redux/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Register = () => {
  const [type, setType] = useState("");
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, x: "-100vw" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  const rightSectionVariants = {
    hidden: { opacity: 0, x: "100vw" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 1.1, transition: { duration: 0.5 } },
  };

  const handleOnClick = () => {
    setType("user");
    window.open(`${server}/google/user/user`, "_self");
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-container">
      {type !== "vendor" ? (
        <>
          <motion.div
            className="left-section"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h1>Welcome User!</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis, maiores provident, itaque corrupti porro cumque
              exercitationem aliquam
            </p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleOnClick}
            >
              Register as User
            </motion.button>
            <Link to={"/login"}>Already have an account? Login here</Link>
          </motion.div>
          <motion.div
            className="right-section"
            initial="hidden"
            animate="visible"
            variants={rightSectionVariants}
          >
            <h1>Welcome Vendor!</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis, maiores provident, itaque corrupti porro cumque
              exercitationem aliquam
            </p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setType("vendor")}
            >
              Register as Vendor
            </motion.button>
            <Link to={"/login"}>Already have an account? Login here</Link>
          </motion.div>
        </>
      ) : (
        <VendorRegister />
      )}
    </div>
  );
};

export default Register;

const VendorRegister = () => {
  const [typeOfBusiness, setTypeOfBusiness] = useState("");

  const handleOnChange = (e) => {
    setTypeOfBusiness(e.target.value);
  };

  const handleOnClick = () => {
    if (typeOfBusiness === "")
      return toast.error("Please select type of business");
    window.open(`${server}/google/vendor/${typeOfBusiness}`, "_self");
  };

  return (
    <div className="vendor-register">
      <h1>What type of Business you have ?</h1>
      <select name="typeOfBusiness" onChange={handleOnChange}>
        <option value="">Select Type of Business</option>
        <option value="restaurant">Restaurant</option>
        <option value="grocery">Grocery</option>
        <option value="chemist">Chemist</option>
      </select>
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="google-login-button"
        disabled={typeOfBusiness === ""}
        style={{ opacity: typeOfBusiness === "" ? 0.5 : 1 }}
        onClick={handleOnClick}
      >
        <FcGoogle />
        Register with Google
      </motion.button>
    </div>
  );
};
