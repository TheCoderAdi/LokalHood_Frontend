import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Seat from "./Seat";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import "../../styles/seat.css";
import Lottie from "lottie-react";
import animationData from "../../assets/cross.json";
import tickAnimationData from "../../assets/tick.json";

const ManageSeats = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState([]);
  const [showTickAnimation, setShowTickAnimation] = useState(false);

  const fetchSeats = async () => {
    try {
      const { data } = await axios.get(`${server}/vendor/seats`, {
        withCredentials: true,
      });
      setSeats(data.seats);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleSeatClick = (seat) => {
    if (seat.user) {
      toast.info(`Table ${seat.tableNumber} booked by ${seat.user.name}`);
    } else {
      toast.info(`Table ${seat.tableNumber} is empty`);
    }
  };

  const handleSeatDelete = async (tableNumber) => {
    try {
      const { data } = await axios.delete(`${server}/vendor/delete-booking`, {
        data: { seatNumber: tableNumber },
        withCredentials: true,
      });
      toast.success(data.message);
      setShowTickAnimation(true);
      fetchSeats();
      setTimeout(() => {
        setShowTickAnimation(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) return <Loader />;

  if (showTickAnimation) {
    return (
      <div
        className="tick-animation"
        style={{
          height: "calc(100vh - 10vh)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Lottie
          animationData={tickAnimationData}
          style={{ width: "300px", height: "300px" }}
        />
        <p
          style={{
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          Booking details deleted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="manage-seats">
      <h1>Manage Seats</h1>
      {seats.length === 0 ? (
        <div className="no-seats__container">
          <Lottie
            animationData={animationData}
            style={{ width: "300px", height: "300px" }}
          />
          <p
            style={{
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            No seats have been booked yet.
          </p>
        </div>
      ) : (
        <div className="seats-grid">
          {Array.from({ length: user?.totalSeats }, (_, i) => {
            const seat = seats.find((s) => s.tableNumber === i + 1);
            return (
              <Seat
                key={i}
                seat={seat ? seat : { tableNumber: i + 1 }}
                onClick={handleSeatClick}
                onDelete={handleSeatDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageSeats;
