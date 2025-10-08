import { useState, useMemo, useEffect } from "react"
import { sampleProducts, categories } from './shopdata' 

const defaultFilters = {
    stock: ["In Stock"],
    priceRange: [0, 1000],
    discount: false,
    topic: [],
    size: [],
    color: [],
    origin: [],
    material: [],
}

export const useShopState = () => {
    const [selectedCategory, setSelectedCategory] = useState("Books")
    const [selectedSubcategory, setSelectedSubcategory] = useState("All")
    const [filters, setFilters] = useState(defaultFilters)
    const [sortBy, setSortBy] = useState("featured")
    const [showFilters, setShowFilters] = useState(true)

    //Add useEffect to read the URL query parameter on page load
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search)
            const categoryParam = urlParams.get("category")
            if (categoryParam && categories[categoryParam]) {
                setSelectedCategory(categoryParam)
                setSelectedSubcategory("All")
            }
        }
    }, [])

    // Handler functions
    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
        setSelectedSubcategory("All")
        // Reset category-specific filters
        setFilters((prev) => ({
            ...prev,
            topic: [],
            size: [],
            color: [],
            origin: [],
            material: [],
        }))
    }

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory)
        // Optionally clear subcategory-dependent filters when 'All' is selected
        if (subcategory === "All") {
            setFilters((prev) => ({
                ...prev,
                topic: [],
                size: [],
                color: [],
                origin: [],
                material: [],
            }))
        }
    }

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter((item) => item !== value)
                : [...prev[filterType], value],
        }))
    }

    const clearFilter = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: prev[filterType].filter((item) => item !== value),
        }))
    }

    const clearAllFilters = () => {
        setFilters(defaultFilters)
    }

    // Memoized Values

    const appliedFilters = useMemo(() => {
        const applied = []
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                applied.push(...value.map((v) => ({ type: key, value: v })))
            }
        })
        return applied
    }, [filters])

    // UPDATED: Filter products based on current filters (with size array check)
    const filteredProducts = useMemo(() => {
        let products = sampleProducts.filter((product) => {
            // Category filter (Must match)
            if (product.category !== selectedCategory) return false

            // Subcategory filter
            if (selectedSubcategory !== "All" && product.subcategory !== selectedSubcategory) return false

            // Stock filter
            if (filters.stock.length > 0) {
                const stockMatch = filters.stock.includes("In Stock") ? product.inStock : !product.inStock
                if (!stockMatch) return false
            }

            // Topic filter (for books)
            if (filters.topic.length > 0 && !filters.topic.includes(product.topic)) return false

            // SIZE FILTER LOGIC (Supports array of sizes) 
            if (filters.size.length > 0) {
                if (Array.isArray(product.size)) {
                    // Check if ANY of the selected filter sizes are included in the product's available sizes
                    const sizeMatch = filters.size.some(filterSize => 
                        product.size.includes(filterSize)
                    );
                    if (!sizeMatch) return false;
                } else {
                    // This block handles products with old single-string size or non-array size.
                    // If the product has a size property but it's not an array, treat it as a single match.
                    if (product.size && !filters.size.includes(product.size)) return false;
                }
            }
            
            // Color filter (for Clothes)
            if (filters.color.length > 0 && !filters.color.includes(product.color)) return false

            // Origin filter (for Clothes)
            if (filters.origin.length > 0 && !filters.origin.includes(product.origin)) return false

            // Material filter (for Ornaments)
            if (filters.material.length > 0 && !filters.material.includes(product.material)) return false

            return true
        })

        // Sorting logic

        return products
    }, [selectedCategory, selectedSubcategory, filters, sortBy])
    
    return {
        // State
        selectedCategory,
        selectedSubcategory,
        filters,
        sortBy,
        showFilters,
        
        // Data/Memoized
        categories,
        appliedFilters,
        filteredProducts,
        
        // Handlers
        handleCategoryChange,
        handleSubcategoryChange,
        handleFilterChange,
        clearFilter,
        clearAllFilters,
        setSortBy,
        setShowFilters,
    }
}