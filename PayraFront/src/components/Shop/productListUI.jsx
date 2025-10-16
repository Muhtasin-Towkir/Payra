import ProductCard from './productCard';

const ProductGrid = ({
    products, 
    loading,
    error,
    selectedCategory,
    selectedSubcategory,
    sortBy,
    setSortBy,
    setShowFilters
}) => {
    if (loading) {
        return <div className="text-center p-20">Receiving transmissions...</div>;
    }
    if (error) {
        return <div className="text-center p-20 text-red-500">{error}</div>;
    }

    return (
        <div className="flex-1">
            {/* ... Breadcrumb and Sort/Filter UI ... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    // The Commander gives a mission to each Soldier
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            {products.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">The archives hold no records matching your query.</p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;