import { motion } from "framer-motion";
import PropTypes from "prop-types";
import "../../styles/seat.css";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";

const Seat = ({ seat, onClick, onDelete }) => {
  const seatStatus = seat.user ? "booked" : "available";
  const { user } = useSelector((state) => state.user);

  return (
    <motion.div
      className={`seat ${seatStatus}`}
      onClick={() => onClick(seat)}
      whileTap={{ scale: 0.9 }}
    >
      {seat.tableNumber}
      {user?.role === "restaurant" && seat.user && (
        <BiTrash
          className="delete-icon"
          onClick={(e) => {
            e.stopPropagation();
            const confirmDelete = window.confirm(
              "Are you sure you want to delete the booking details?"
            );
            if (confirmDelete) onDelete(seat.tableNumber);
          }}
          size={20}
        />
      )}
    </motion.div>
  );
};

Seat.propTypes = {
  seat: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default Seat;
