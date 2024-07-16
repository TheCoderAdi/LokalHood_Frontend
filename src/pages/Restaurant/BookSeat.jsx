import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Seat from "./Seat";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import animData from "../../assets/tick.json";
import { useParams } from "react-router-dom";

const BookSeat = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [totalSeats, setTotalSeats] = useState(0);
  const [seats, setSeats] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  const bookSeat = async (seatNumber) => {
    try {
      const { data } = await axios.post(
        `${server}/user/book-seat/${id}`,
        { seatNumber },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setBookingSuccess(true);
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
      bookSeat(seat.tableNumber);
    } else {
      toast.info(`Table ${seat.tableNumber} is already booked`);
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default BookSeat;
