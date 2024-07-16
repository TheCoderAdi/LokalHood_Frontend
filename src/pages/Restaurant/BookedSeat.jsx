import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import axios from "axios";
import Loader from "../../components/Loader";
import Lottie from "lottie-react";
import animData from "../../assets/cross.json";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import "../../styles/bookedseat.css";

const BookedSeat = () => {
  const [loading, setLoading] = useState(false);
  const [bookedSeats, setBookedSeats] = useState([]);

  const bookedByMe = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/user/booked-seats`, {
        withCredentials: true,
      });
      setBookedSeats(data.vendors);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    bookedByMe();
  }, []);

  const handleDownloadPDF = (vendor) => {
    const doc = new jsPDF();
    doc.text(`Vendor Name: ${vendor.name}`, 10, 10 + 1 * 30);
    doc.text(`Vendor Email: ${vendor.email}`, 10, 20 + 1 * 30);
    doc.text(`Vendor Address: ${vendor.address}`, 10, 30 + 2 * 30);
    vendor.tables.forEach((table, tableIndex) => {
      doc.text(
        `Table Number: ${table.tableNumber}`,
        10,
        30 + 1 * 30 + tableIndex * 10
      );
    });
    doc.save("booked_seats.pdf");
  };

  if (loading) return <Loader />;

  if (bookedSeats.length === 0)
    return (
      <div className="no-seats__container">
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="booked-seat__container"
    >
      {bookedSeats.map((vendor) => (
        <motion.div
          key={vendor._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="booked-seat__details">
            <p className="booked-seat__vendor-name">
              Vendor Name: {vendor.name}
            </p>
            <p className="booked-seat__vendor-email">
              Vendor Email: {vendor.email}
            </p>
            {vendor.tables.map((table) => (
              <p key={table._id} className="booked-seat__table-number">
                Table Number: {table.tableNumber}
              </p>
            ))}
          </div>
          <motion.button
            className="download-pdf__button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDownloadPDF(vendor)}
          >
            Download as PDF
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookedSeat;
