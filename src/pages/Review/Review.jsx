import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import animData from "../../assets/tick.json";
import "../../styles/review.css";

const Review = () => {
  const { id } = useParams();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  const submitReview = async () => {
    if (!review) {
      return toast.error("Review cannot be empty");
    }
    if (rating === 0) {
      return toast.error("Rating cannot be 0");
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/user/review/${id}`,
        { review, rating },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setLoading(false);
      setReview("");
      setRating(0);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
      if (data.success) navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="review__container"
    >
      <div className="review__inner__container">
        <h1>Write a Review</h1>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          className="review__textarea"
          style={{
            width: "90%",
          }}
        />
        <div className="rating__container">
          <p>Rating:</p>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "filled" : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <button
          onClick={submitReview}
          className="submit__button"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        {showAnimation && (
          <div className="animation__container">
            <Lottie animationData={animData} loop={false} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Review;
