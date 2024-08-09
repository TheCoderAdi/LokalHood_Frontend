import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../styles/home.css";
import img1 from "../assets/pic1.jpg";
import img2 from "../assets/pic2.jpg";
import img3 from "../assets/pic3.jpg";
import img4 from "../assets/pic4.jpg";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import introVideo from "../assets/intro.mp4";

const Home = () => {
  const { ref: bannerRef, inView: bannerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section2Ref, inView: section2InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section3Ref, inView: section3InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section4Ref, inView: section4InView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationVariantsFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  const animationVariantsFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.section
        className="banner"
        ref={bannerRef}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5 }}
      >
        <video
          src={introVideo}
          autoPlay={true}
          controls={false}
          width={"100%"}
          muted
          loop={true}
        ></video>
        <h1 className="banner-text-left">LOKAL</h1>
        <h1 className="banner-text-right">HOOD</h1>
      </motion.section>
      <div className="home-container">
        <div
          style={{
            height: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div className="text">
            <h2>Welcome to LokalHood</h2>
            <p>
              New to the area and not sure where to start? No worries,
              we&apos;ve got you covered. We&apos;re here to help you explore
              your new locality and make your lifestyle easier and more
              enjoyable. Let us guide you through your new neighborhood and help
              you settle in smoothly.
            </p>
          </div>
        </div>
        <motion.section
          className="section"
          ref={section2Ref}
          initial="hidden"
          animate={section2InView ? "visible" : "hidden"}
          variants={animationVariantsFromRight}
          transition={{ duration: 0.5 }}
        >
          <img src={img2} alt="Chemist" />
          <div className="text">
            <h2>For Chemist</h2>
            <p>
              Too sick to shop or just avoiding the line? Check if we have what
              you need and get your meds delivered to your door. No need to put
              on pants—let us handle it!
            </p>
          </div>
        </motion.section>
        <motion.section
          className="section"
          ref={section3Ref}
          initial="hidden"
          animate={section3InView ? "visible" : "hidden"}
          variants={animationVariantsFromLeft}
          transition={{ duration: 0.5 }}
        >
          <div className="text">
            <h2>For Resturants</h2>
            <p>
              Looking for the perfect spot to eat? Want to know if there&apos;s
              a table available or if the place is packed? We make it simple to
              check availability and reserve your seat ahead of time, ensuring a
              hassle-free dining experience.
            </p>
          </div>
          <img src={img3} alt="Resturants" />
        </motion.section>
        <motion.section
          className="section"
          ref={section4Ref}
          initial="hidden"
          animate={section4InView ? "visible" : "hidden"}
          variants={animationVariantsFromRight}
          transition={{ duration: 0.5 }}
        >
          <img src={img4} alt="Shops" />
          <div className="text">
            <h2>For Shops</h2>
            <p>
              Pressed for time or not in the mood to haul groceries home? Check
              product availability and let us deliver everything you need right
              to your doorstep.
            </p>
          </div>
        </motion.section>
        <section className="section">
          <div className="text">
            <h2>Register with us a Buisness</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Veritatis ad cupiditate tempore.
            </p>
          </div>
          <Carousel images={[img1, img2, img3, img4]} />
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
