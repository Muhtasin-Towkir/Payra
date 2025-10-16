import { useState, useMemo, useEffect } from "react";
import { categories } from './shopdata';
import API from '../../api';

const defaultFilters = {
    stock: ["In Stock"],
    priceRange: [0, 10000],
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
            if (filters.color.length > 0) params['details.color'] = { in: filters.color.join(',') };
            if (filters.size.length > 0) params['details.size'] = { in: filters.size.join(',') };
            if (filters.material.length > 0) params['details.material'] = { in: filters.material.join(',') };
            if (filters.origin.length > 0) params['details.origin'] = { in: filters.origin.join(',') };
            if (filters.stock.includes("In Stock")) params.inStock = true;

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
        setFilters(prev => ({ ...defaultFilters, stock: prev.stock }));
    };

    const handleSubcategoryChange = (subcategory) => { setSelectedSubcategory(subcategory); };
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value],
        }));
    };
    const clearFilter = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].filter(item => item !== value),
        }));
    };
    const clearAllFilters = () => { setFilters(defaultFilters); };

    const appliedFilters = useMemo(() => {
        const applied = [];
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                applied.push(...value.map((v) => ({ type: key, value: v })));
            }
        });
        return applied;
    }, [filters]);

    return {
        selectedCategory, selectedSubcategory, filters, sortBy, showFilters,
        products, loading, error, categories, appliedFilters,
        handleCategoryChange, handleSubcategoryChange, handleFilterChange,
        clearFilter, clearAllFilters, setSortBy, setShowFilters,
    };
};