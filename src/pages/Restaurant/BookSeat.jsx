import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Seat from "./Seat";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import animData from "../../assets/tick.json";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const BookSeat = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [totalSeats, setTotalSeats] = useState(0);
  const [seats, setSeats] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const fetchSeats = async () => {
    try {
      const { data } = await axios.get(`${server}/user/seats/${id}`, {
        withCredentials: true,
      });
      setSeats(data.seats);
      setTotalSeats(data.totalSeats);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const bookSeats = async () => {
    try {
      const { data } = await axios.post(
        `${server}/user/book-seat/${id}`,
        { seatNumber: selectedSeats },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setBookingSuccess(true);
      setSelectedSeats([]);
      fetchSeats();
      setTimeout(() => {
        setBookingSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchSeats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeatClick = (seat) => {
    if (!seat.user) {
      if (selectedSeats.includes(seat.tableNumber)) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seat.tableNumber));
      } else {
        setSelectedSeats([...selectedSeats, seat.tableNumber]);
      }
    } else {
      if (seat.confirmed)
        toast.info(`Table ${seat.tableNumber} is already booked`);
      else if (seat.user.toString() === user._id)
        toast.info("You already requested for booking");
      else
        toast.info(
          `Table ${seat.tableNumber} , someone is already request for booking wait for confirmation`
        );
    }
  };

  const confirmBooking = () => {
    if (selectedSeats.length > 0) {
      const confirm = window.confirm(
        `Are you sure you want to book seats ${selectedSeats.join(", ")}?`
      );
      if (confirm) bookSeats();
    } else {
      toast.info("Please select at least one seat to book.");
    }
  };

  if (loading) return <Loader />;

  if (bookingSuccess) {
    return (
      <div className="booking-success__container">
        <Lottie
          animationData={animData}
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
          Booking Successful!
        </p>
      </div>
    );
  }

  return (
    <div className="book-seats">
      <h1>Book a Seat</h1>
      <div className="seats-grid">
        {Array.from({ length: totalSeats }, (_, i) => {
          const seat = seats.find((s) => s.tableNumber === i + 1);
          return (
            <Seat
              key={i}
              seat={seat ? seat : { tableNumber: i + 1 }}
              onClick={handleSeatClick}
              isSelected={selectedSeats.includes(i + 1)}
            />
          );
        })}
      </div>
      {selectedSeats.length > 0 && (
        <div className="confirmation-container">
          <p>Selected Seats: {selectedSeats.join(", ")}</p>
          <button className="confirm-button" onClick={confirmBooking}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookSeat;
