import { useState, useEffect } from 'react';
import { useCart } from '../Cart/CartLogic';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
// 1. Import the toast alert system (Corrected Path - removed /Common/)
import { useToast } from '../ToastSystem'; 

export const usePlaceOrderLogic = () => {
  // 2. Destructure clearCart from useCart and addToast from useToast
  const { items: cartItems, getSubtotal, clearCart } = useCart();
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coupon: "",
    firstName: "",
    lastName: "",
    country: "Bangladesh",
    streetAddress: "",
    apartment: "",
    townCity: "",
    district: "Dhaka",
    postcode: "",
    phone: "",
    email: "",
    shipDifferent: false,
    shippingFirstName: "",
    shippingLastName: "",
    shippingCountry: "Bangladesh",
    shippingStreet: "",
    shippingApartment: "",
    shippingTown: "",
    shippingDistrict: "Dhaka",
    shippingPostcode: "",
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.mobile || '',
        firstName: user.username?.split(' ')[0] || '',
        lastName: user.username?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const subtotal = getSubtotal();
  const shippingPrice = subtotal > 0 ? 50 : 0;
  const totalPrice = subtotal + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      setError("Your cargo hold is empty. Cannot place order.");
      return;
    }
    setLoading(true);
    setError("");

    const useShippingAddress = formData.shipDifferent;
    const finalShippingInfo = {
      address: useShippingAddress ? `${formData.shippingStreet}, ${formData.shippingApartment}` : `${formData.streetAddress}, ${formData.apartment}`,
      city: useShippingAddress ? formData.shippingTown : formData.townCity,
      phoneNo: formData.phone,
      postalCode: useShippingAddress ? formData.shippingPostcode : formData.postcode,
      country: useShippingAddress ? formData.shippingCountry : formData.country,
    };

    const orderPayload = {
      shippingInfo: finalShippingInfo,
      itemsPrice: subtotal,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      orderNotes: formData.orderNotes,
      paymentMethod: paymentMethod,
    };

    try {
      const { data } = await API.post('/orders', orderPayload);
      console.log("Order transmitted successfully:", data.order);
      
      clearCart(); // Empty the cargo hold
      addToast('Order placed successfully!', 'success'); // Send holo-alert
      navigate('/'); // Return to the Home sector
      // --- END OF CORRECTION ---

    } catch (err) {
      const message = err.response?.data?.message || "The transaction could not be completed.";
      setError(message); // Set local error for form
      addToast(message, 'error'); // Send global holo-alert
      console.error("Order creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, handleInputChange, handleSubmit,
    cartItems, subtotal, shippingPrice, totalPrice,
    error, loading, user,
    paymentMethod, setPaymentMethod,
  };
};


