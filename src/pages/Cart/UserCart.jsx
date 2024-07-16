import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { server } from "../../redux/store";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import "../../styles/cart.css";
import { BiTrash } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";

const UserCart = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const getCart = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${server}/user/cart`, {
        withCredentials: true,
      });

      setCart(data.cart);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const calculateTotal = () => {
      let total = cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setTotalAmount(total);
    };
    calculateTotal();
  }, [cart]);

  const handleDelete = (productId) => async () => {
    try {
      let confirm = window.confirm(
        "Are you sure you want to remove this product from cart?"
      );
      if (!confirm) return;
      setLoading(true);

      await axios.delete(`${server}/user/cart-delete/${productId}`, {
        withCredentials: true,
      });

      await getCart();
      setLoading(false);
      toast.success("Product removed from cart");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  if (loading) return <Loader />;

  if (cart.length === 0)
    return (
      <div className="cart__container__no">
        <h2>
          Your cart is empty&nbsp;
          <AiOutlineShoppingCart
            size={30}
            style={{
              marginBottom: "-8px",
            }}
          />
        </h2>
        <p>Go to the home page to add products to your cart</p>
        <Link to={"/"} className="back__link">
          Go to home
        </Link>
      </div>
    );

  return (
    <div className="cart__container">
      <h2>
        Your cart
        <AiOutlineShoppingCart
          size={30}
          style={{
            marginBottom: "-8px",
          }}
        />
      </h2>

      <table className="cart__table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, ind) => (
            <tr key={ind} className="cart__item">
              <td>
                <img src={item.product.image.url} alt={item.product.name} />
              </td>
              <td>{item.product.name}</td>
              <td>₹{item.product.price}</td>
              <td>{item.quantity}</td>
              <td>₹{item.product.price * item.quantity}</td>
              <td>
                <BiTrash
                  onClick={handleDelete(item.product._id)}
                  className="cart__delete__btn"
                  fontSize={25}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart__summary">
        <h3>Total Amount: ₹{totalAmount}</h3>
        <button
          className="checkout__button"
          onClick={() =>
            navigate("/checkout", { state: { cart, totalAmount } })
          }
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default UserCart;
