import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/products.css";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const Products = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/vendor/products`, {
        withCredentials: true,
      });
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const deleteProduct = (id) => async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;
    try {
      setLoading(true);
      await axios.delete(`${server}/vendor/delete-product/${id}`, {
        withCredentials: true,
      });
      getProducts();
      setLoading(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (loading) return <Loader />;

  if (products.length === 0)
    return (
      <div className="products-no__found">
        <p>No products found. Please add products to display here.</p>
        <Link to={"/create-product"} className="products-create__button">
          Create Product
        </Link>
      </div>
    );

  console.log(products);

  return (
    <div className="products-page__container">
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
            <p>Stock: {product.stock}</p>
            <Link to={`/edit-product/${product._id}`} className="product__edit">
              Edit
              <BiEdit />
            </Link>
          </div>
          <button
            className="product__delete"
            onClick={deleteProduct(product._id)}
          >
            <MdDelete size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
