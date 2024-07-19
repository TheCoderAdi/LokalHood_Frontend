import { useState, useEffect, useRef } from "react";
import "../styles/carousel.css";
import PropTypes from "prop-types";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const next = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    timeoutRef.current = setTimeout(() => setCurrentIndex(next), 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, images.length]);

  const previousSlide = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  const nextSlide = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };
  return (
    <div className="carousel">
      <button className="carousel-button left" onClick={previousSlide}>
        &#10094;
      </button>
      <div className="carousel-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={index === currentIndex ? "active" : "inactive"}
          />
        ))}
      </div>
      <button className="carousel-button right" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

Carousel.propTypes = {
  images: PropTypes.array.isRequired,
};

export default Carousel;
