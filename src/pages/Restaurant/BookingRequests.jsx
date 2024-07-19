import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import animData from "../../assets/cross.json";
import "../../styles/bookingrequests.css";

const BookingRequests = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const getBookingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/booking-requests`, {
        withCredentials: true,
      });
      setRequests(data.bookingRequests);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    let url =
      action === "accept"
        ? `${server}/vendor/confirm-booking/${id}`
        : `${server}/vendor/reject-booking/${id}`;

    try {
      setLoading(true);
      const { data } = await axios.put(
        url,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        getBookingRequests();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingRequests();
  }, []);

  if (loading) return <Loader />;

  if (requests.length === 0)
    return (
      <div
        className="no-seats__container"
        style={{
          height: "calc(100vh - 10vh)",
          justifyContent: "center",
        }}
      >
        <Lottie
          animationData={animData}
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
    );

  return (
    <div className="booking-requests">
      {requests.map((request) => (
        <div key={request._id} className="booking-request">
          <div className="booking-request__header">
            <h3>Name: {request.name}</h3>
            <p>Phone: {request.phoneNumber}</p>
          </div>
          <div className="booking-request__body">
            <p>Requested Tables: {request.tableNumber.join(",")}</p>
            <p>Time: {new Date(request.requestedAt).toLocaleTimeString()}</p>
            <p>Date: {new Date(request.requestedAt).toLocaleDateString()}</p>
          </div>
          <div className="booking-request__footer">
            <button
              className="accept"
              onClick={() => handleAction(request._id, "accept")}
            >
              Accept
            </button>
            <button
              className="reject"
              onClick={() => handleAction(request._id, "reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingRequests;
