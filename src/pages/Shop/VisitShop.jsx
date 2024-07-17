import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../redux/store";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import "../../styles/visit-shop.css";

const VisitShop = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/get-products/${id}`, {
        withCredentials: true,
      });
      setProducts(data.products);
      setVendorName(data.vendor);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = async (productId, stock) => {
    const quantity = parseInt(quantities[productId]) || 1;

    if (quantity > stock) {
      return toast.error("Product stock is less than the quantity you entered");
    }

    try {
      setLoading(true);
      await axios.put(
        `${server}/user/add-to-cart`,
        {
          productId,
          quantity,
        },
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      toast.success("Product added to cart successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;

  if (products.length === 0)
    return (
      <div className="products-no__found">
        <p>
          No products found in this shop.
          <br /> Please check back later or visit another shop.
        </p>
        <Link to="/" className="back__link">
          Back to Home
        </Link>
      </div>
    );

  return (
    <>
      <h1 className="visit-shop__heading">{vendorName}&apos;s Shop</h1>
      <div className="visit-shop__container">
        {products.map((product) => (
          <div key={product._id} className="product__card">
            <img
              src={
                product?.image
                  ? product.image.url
                  : "https://th.bing.com/th/id/OIP.9hetfdrodOfI9KzE_g_dDAAAAA?rs=1&pid=ImgDetMain"
              }
              className="product__image"
              alt={product.name}
            />
            <div>
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <div className="product__buy">
                <input
                  type="number"
                  title="quantity"
                  min="1"
                  value={quantities[product._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product._id, e.target.value)
                  }
                  className="quantity__input"
                />
                <button
                  onClick={() => handleAddToCart(product._id, product.stock)}
                  className="add__button"
                >
                  Add to Cart
                </button>
                <p
                  className="overlay__out_of_stock"
                  style={{
                    display: product.stock === 0 ? "" : "none",
                    color: "whitesmoke",
                    fontSize: "1.2rem",
                  }}
                >
                  Out Of Stock
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VisitShop;
