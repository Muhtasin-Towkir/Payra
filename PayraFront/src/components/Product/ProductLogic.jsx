import { useState, useRef, useMemo } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { sampleProducts } from '../Shop/shopdata'

export const useProductDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const imageRef = useRef(null)

    // Safely parse the ID and find the product
    const productId = params.id ? Number(params.id) : null 
    const product = useMemo(() => 
        sampleProducts.find((p) => p.id === productId), 
        [productId]
    )
    
    // --- State Management ---
    const initialSize = 
        (product && Array.isArray(product.size) && product.size.length > 0) 
        ? product.size[0] 
        : null;

    const [quantity, setQuantity] = useState(1)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [selectedSize, setSelectedSize] = useState(initialSize)
    const [activeTab, setActiveTab] = useState("description")
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const [isZooming, setIsZooming] = useState(false)
    
    // --- Handlers & Logic ---
    
    const relatedProducts = useMemo(() => {
        if (!product) return []
        return sampleProducts
            .filter((p) => p.subcategory === product.subcategory && p.id !== product.id)
            .slice(0, 4)
    }, [product])


const handleQuantityChange = (value) => {
    let num = parseInt(value);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 100) num = 100;
    setQuantity(num);
};

const incrementQuantity = () => handleQuantityChange(quantity + 1);
const decrementQuantity = () => handleQuantityChange(quantity - 1);
    const handleMouseMove = (e) => {
        if (!imageRef.current) return
        const rect = imageRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setZoomPosition({ x, y })
    }

    return {
        // Data & Refs
        product,
        relatedProducts,
        imageRef,
        navigate,

        // State
        quantity,
        selectedPayment,
        selectedSize,
        activeTab,
        zoomPosition,
        isZooming,

        // Setters & Actions
        setQuantity,
        setSelectedPayment,
        setSelectedSize,
        setActiveTab,
        setIsZooming,

        // Handlers
        handleQuantityChange,
        incrementQuantity,
        decrementQuantity,
        handleMouseMove,
    }
}