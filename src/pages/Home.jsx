import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../styles/home.css";
import img1 from "../assets/pic1.jpg";
import img2 from "../assets/pic2.jpg";
import img3 from "../assets/pic3.jpg";
import img4 from "../assets/pic4.jpg";
import banner from "../assets/banner.jpg";
import Footer from "../components/Footer";

const Home = () => {
  const { ref: bannerRef, inView: bannerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: section1Ref, inView: section1InView } = useInView({
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
        <img src={banner} alt="Banner Image" />
        <h1 className="banner-text">LOKAL HOOD</h1>
      </motion.section>
      <div className="home-container">
        <motion.section
          className="section"
          ref={section1Ref}
          initial="hidden"
          animate={section1InView ? "visible" : "hidden"}
          variants={animationVariantsFromLeft}
          transition={{ duration: 0.5 }}
        >
          <div className="text">
            <h2>Welcome to LokalHood</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe
              dignissimos numquam veniam voluptatem voluptate est, voluptatibus
              ipsam velit maiores. Quod, deleniti cumque! Quis!
            </p>
          </div>
          <img src={img1} alt="Medical Image" />
        </motion.section>
        <motion.section
          className="section"
          ref={section2Ref}
          initial="hidden"
          animate={section2InView ? "visible" : "hidden"}
          variants={animationVariantsFromRight}
          transition={{ duration: 0.5 }}
        >
          <img src={img2} alt="About Us Image" />
          <div className="text">
            <h2>About Us</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. At
              animi, ex, culpa tenetur impedit ducimus ratione praesentium
              placeat id enim dignissimos quasi quam?
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
            <h2>Our Services</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Provident minus, ad optio nihil accusamus asperiores consequatur
              nam sunt quod voluptate, praesentium doloribus saepe?
            </p>
          </div>
          <img src={img3} alt="Medical Services Image" />
        </motion.section>
        <motion.section
          className="section"
          ref={section4Ref}
          initial="hidden"
          animate={section4InView ? "visible" : "hidden"}
          variants={animationVariantsFromRight}
          transition={{ duration: 0.5 }}
        >
          <img src={img4} alt="For Doctors Image" />
          <div className="text">
            <h2>For Users</h2>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Necessitatibus animi eligendi provident fugit, delectus natus
              voluptas, voluptatem corrupti similique quia, eius veritatis nisi
              consectetur aliquid earum dolor molestiae laborum ut?
            </p>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
