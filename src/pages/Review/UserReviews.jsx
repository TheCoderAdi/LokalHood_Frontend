import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import { useParams } from "react-router-dom";
import "../../styles/userreview.css";
import animData from "../../assets/review.json";
import Lottie from "lottie-react";

const UserReviews = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [review, setReview] = useState({});

  const getReview = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/review/${id}`, {
        withCredentials: true,
      });
      setReview(data.returnObject);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 10vh)",
        }}
      >
        <Lottie
          animationData={animData}
          style={{ width: 700, height: 700 }}
          loop
        />
      </div>
    );

  return (
    <div className="user-review__container">
      {!loading && review ? (
        <>
          <div className="user-review__header">
            <h2>Review by {review?.name}</h2>
          </div>

          <div className="user-review__content">
            <div>
              <img
                src={review?.profilePic}
                alt="profile"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <q
                style={{
                  fontSize: "1.1rem",
                  color: "#fdfdfd",
                  textAlign: "center",
                }}
              >
                {review?.review}
              </q>
              <p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= review?.rating ? "filled" : ""}`}
                    style={{ fontSize: "1.9rem" }}
                  >
                    ★
                  </span>
                ))}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default UserReviews;
