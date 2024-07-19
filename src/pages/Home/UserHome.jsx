import { useSelector } from "react-redux";
import "../../styles/userhome.css";
import { profileIsComplete } from "../../lib/helper";
import { Link, useNavigate } from "react-router-dom";
import Map from "../../components/Map";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { server } from "../../redux/store";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const UserHome = () => {
  const { user } = useSelector((state) => state.user);

  const profileCompletion = profileIsComplete(user);
  const navigate = useNavigate();

  const [selectOptions, setSelectOptions] = useState("All");

  const options = ["All", "Chemist", "Grocery", "Restaurant"];

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = (vendor) => {
    setSelectedVendor(vendor);
  };

  const getVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/near-by-vendors`, {
        withCredentials: true,
      });
      setVendors(data.vendors);
      setFilteredVendors(data.vendors);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    setSelectOptions(option);
    if (option === "All") {
      setFilteredVendors(vendors);
    } else {
      const filteredVendors = vendors.filter(
        (vendor) => vendor.role === option.toLowerCase()
      );
      setFilteredVendors(filteredVendors);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

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
    <div className="user-home">
      <div className="map-section">
        <div className="map-container" style={{ marginTop: "37px" }}>
          <Map
            vendorArray={vendors}
            selectedVendor={selectedVendor}
            loading={loading}
          />
        </div>
        <div className="vendor-list">
          <h1>Near by vendors</h1>
          {
            <div className="button-container">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  style={{
                    backgroundColor:
                      selectOptions === option ? "#f1f1f1" : "#333",
                    color: selectOptions === option ? "black" : "white",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          }
          {!loading && vendors.length === 0 ? (
            <>
              <h3>No vendors found near by you</h3>
            </>
          ) : (
            filteredVendors?.map((vendor, index) => (
              <motion.div
                key={index}
                className="vendor-item"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="vendor-item__photo">
                  <img src={vendor.profilePic.url} alt={vendor.name} />
                </div>
                <div className="vendor-item__details">
                  <div>
                    <h3>Name: {vendor.name}</h3>
                    <p style={{ textTransform: "capitalize" }}>
                      Bussiness: {vendor.role}
                    </p>
                    <p>Phone: {vendor.phoneNumber}</p>
                  </div>
                  <div className="vendor-item__buttons">
                    <button onClick={() => handleClick(vendor)}>Locate</button>
                    <button
                      onClick={() =>
                        navigate(
                          `/${
                            vendor.role === "restaurant"
                              ? "restaurant"
                              : "visit-shop"
                          }/${vendor._id}`
                        )
                      }
                    >
                      Visit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
