import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../../styles/products.css";
import { server } from "../../redux/store";
import Loader from "../../components/Loader";

const EditProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currFile, setCurrFile] = useState(null);
  const [formEdited, setFormEdited] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formEdited) return;
    const { name, price, stock } = formData;
    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("stock", stock);
    if (currFile instanceof File) {
      data.append("productPicture", currFile);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${server}/vendor/edit-product/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/products");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${server}/vendor/product/${id}`, {
          withCredentials: true,
        });

        setFormData({
          name: data.product.name,
          price: data.product.price,
          stock: data.product.stock,
          image: data.product.image,
        });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    getProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormEdited(true);
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
      setFormEdited(true);

      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="product-edit__container">
      <h2>Edit Product</h2>
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
              currFile
                ? formData.image
                : formData.image?.url
                ? formData.image.url
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
          Edit Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
