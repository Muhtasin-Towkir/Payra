import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/CartLogic';
import API from '../../api';

export const useProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const imageRef = useRef(null);
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data.product);
            } catch (err) {
                setError('This record could not be found in the archives.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        if (product && Array.isArray(product.details?.size) && product.details.size.length > 0) {
            setSelectedSize(product.details.size[0]);
        }
    }, [product]);

    const relatedProducts = [];
    const handleQuantityChange = (value) => {
        let num = parseInt(value);
        if (isNaN(num) || num < 1) num = 1;
        if (num > 100) num = 100;
        setQuantity(num);
    };
    const incrementQuantity = () => handleQuantityChange(quantity + 1);
    const decrementQuantity = () => handleQuantityChange(quantity - 1);
    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };
    const handleAddToCart = () => {
        if (Array.isArray(product?.details?.size) && !selectedSize) {
             alert("Please select a size first.");
             return;
        }
        const itemToAdd = {
            id: product._id,
            quantity: quantity,
            name: product.name,
            displayName: product.name + (selectedSize ? ` (${selectedSize})` : ''),
            price: product.price,
            image: product.images[0]?.url,
        };
        addItem(itemToAdd);
    };

    return {
        product, relatedProducts, imageRef, navigate, loading, error,
        quantity, selectedSize, activeTab, zoomPosition, isZooming,
        setQuantity, setSelectedPayment: () => {}, setSelectedSize, setActiveTab, setIsZooming,
        handleQuantityChange, incrementQuantity, decrementQuantity,
        handleMouseMove, handleAddToCart
    };
};