import { useState, useMemo, useEffect } from "react";
import { categories } from './shopdata';
import API from '../../api';

const defaultFilters = {
    stock: "In Stock", // Changed from Array to String
    discount: false,
    size: [],
    color: [],
    origin: [],
    material: [],
};

export const useShopState = () => {
    const [selectedCategory, setSelectedCategory] = useState("Clothes");
    const [selectedSubcategory, setSelectedSubcategory] = useState("All");
    const [filters, setFilters] = useState(defaultFilters);
    const [sortBy, setSortBy] = useState("-createdAt");
    const [showFilters, setShowFilters] = useState(true);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            setLoading(true);
            setError(null);
            const params = { category: selectedCategory, sort: sortBy };
            if (selectedSubcategory !== "All") { params.subcategory = selectedSubcategory; }

            // --- CORRECTED ARRAY FILTER LOGIC ---
            // Send as a comma-separated string, not an object
            if (filters.color.length > 0) params['details.color'] = filters.color.join(',');
            if (filters.size.length > 0) params['details.size'] = filters.size.join(',');
            if (filters.material.length > 0) params['details.material'] = filters.material.join(',');
            if (filters.origin.length > 0) params['details.origin'] = filters.origin.join(',');
            // --- END OF CORRECTION ---
            
            // --- IN-STOCK LOGIC (Corrected with $) ---
            // This now queries the 'Number' field in the database.
            if (filters.stock === "In Stock") {
                params.inStock = { $gte: 1 }; // gte: "Greater Than or Equal to" 1
            } else if (filters.stock === "Out of Stock") {
                params.inStock = { $lte: 0 }; // lte: "Less Than or Equal to" 0
            }
            // If filters.stock is "All", we don't add the param, so all are shown.
            // --- END OF CORRECTION ---

            try {
                const { data } = await API.get('/products', { params });
                setProducts(data.products || []);
            } catch (err) {
                setError("Transmission failed. Could not retrieve products.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredProducts();
    }, [selectedCategory, selectedSubcategory, filters, sortBy]);
    
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory("All");
        // Reset filters, but keep the current stock filter
        setFilters(prev => ({ ...defaultFilters, stock: prev.stock }));
    };

    const handleSubcategoryChange = (subcategory) => { setSelectedSubcategory(subcategory); };
    
    // This handler is for array-based filters (e.g., color, size)
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value],
        }));
    };

    // --- New handler for Radio Button (Stock) ---
    const handleStockChange = (status) => {
        setFilters(prev => ({ ...prev, stock: status }));
    };
    // --- End of New Handler ---

    const clearFilter = (filterType, value) => {
        if (filterType === 'stock') {
            // Set to "All" to clear stock filter
            setFilters(prev => ({ ...prev, stock: "All" })); 
        } else {
            setFilters(prev => ({
                ...prev,
                [filterType]: prev[filterType].filter(item => item !== value),
            }));
        }
    };

    const clearAllFilters = () => { 
        // Set stock back to "In Stock" by default
        setFilters(defaultFilters); 
    };

    const appliedFilters = useMemo(() => {
        const applied = [];
        Object.entries(filters).forEach(([key, value]) => {
            // Handle array filters (color, size, etc.)
            if (Array.isArray(value) && value.length > 0) {
                applied.push(...value.map((v) => ({ type: key, value: v })));
            }
            // Handle string filters (stock)
            if (typeof value === 'string' && key === 'stock' && value && value !== "All") {
                applied.push({ type: 'stock', value: value });
            }
        });
        return applied;
    }, [filters]);

    return {
        selectedCategory, selectedSubcategory, filters, sortBy, showFilters,
        products, loading, error, categories, appliedFilters,
        handleCategoryChange, handleSubcategoryChange, handleFilterChange,
        handleStockChange, // <-- Export new handler
        clearFilter, clearAllFilters, setSortBy, setShowFilters,
    };
};

