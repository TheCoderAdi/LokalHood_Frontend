import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../../styles/products.css";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";

const CreateProduct = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currFile, setCurrFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      setCurrFile(file);

      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, stock } = formData;

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("stock", stock);
    if (currFile) {
      data.append("productPicture", currFile);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/vendor/create-product`,
        data,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully");
        navigate("/products");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="product-create__container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price(₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <img
            src={
              formData.image
                ? formData.image
                : "https://via.placeholder.com/150"
            }
            alt="product-image"
            style={{
              height: "150px",
              width: "150px",
            }}
          />
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="product-create__button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
