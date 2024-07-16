import "../../styles/profile.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/profile.css";
import { updateProfile } from "../../redux/action";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import { OPENCAGE_API_KEY } from "../../lib/data";
import MapModal from "../../components/MapModal";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);

  const [currFile, setCurrFile] = useState(null);
  const [formModified, setFormModified] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name,
    email: user?.email,
    contactNo: user?.phoneNumber || "",
    address: user?.address || "",
    profilepic: user?.profilePic.url || "",
    latitude: user?.latitude || "",
    longitude: user?.longitude || "",
  });
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name,
      email: user?.email,
      contactNo: user?.phoneNumber || "",
      address: user?.address || "",
      profilepic: user?.profilePic.url || "",
      latitude: user?.latitude || "",
      longitude: user?.longitude || "",
    });
  }, [user]);

  const { name, email, address, contactNo, latitude, longitude } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormModified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      name.trim() === "" ||
      address.trim() === "" ||
      contactNo.trim() === ""
    ) {
      toast.error("Cannot have empty spaces");
      return;
    }

    if (contactNo.length !== 10) {
      toast.error("Contact number must be 10 digits long");
      return;
    }
    if (contactNo.match(/[^0-9]/)) {
      toast.error("Contact number can only include digits");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", contactNo);
    formData.append("address", address);
    formData.append("profilePicture", currFile);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    dispatch(updateProfile(formData, "user"));
    if (!loading) navigate("/");
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    setCurrFile(file);
    setFormModified(true);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, profilepic: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsMapModalOpen(true);
  };

  const handleLocationSelect = (location) => {
    const { latitude, longitude } = location;
    axios
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
      )
      .then((response) => {
        const address = response.data.results[0].formatted;
        setFormData({ ...formData, address, latitude, longitude });
        setFormModified(true);
      })
      .catch(() => {
        toast.error("Unable to retrieve your location");
      });
  };

  const profileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="profile-container">
      <motion.div
        className="profile"
        initial="hidden"
        animate="visible"
        variants={profileVariants}
      >
        <img
          src={formData.profilepic}
          alt="profilepic"
          className="profile-img"
        />
        <input
          className="edit-image-btn"
          type="file"
          onChange={handleEditImage}
          accept="image/*"
        />
      </motion.div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name of the user:</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type="text"
            name="contactNo"
            value={contactNo}
            onChange={handleChange}
            placeholder="Enter your contact number"
          />
        </div>
        <div>
          <label>Address:</label>
          <div className="address-container">
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleChange}
              placeholder="Write your full address"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="location-btn"
            >
              <MdLocationOn className="location-icon" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!formModified}
          style={{
            opacity: formModified ? "1" : "0.5",
          }}
          className={formModified ? "update-btn" : "update-btn-disabled"}
        >
          Update Profile
        </button>
      </form>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default UserProfile;
