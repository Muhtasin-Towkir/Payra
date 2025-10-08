import { ChevronDown, Filter } from "lucide-react"

// A helper component for color swatch
const ColorSwatch = ({ color, selected, onClick }) => (
    <div
        className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selected ? "border-gray-800" : "border-gray-300"}`}
        style={{ backgroundColor: color.toLowerCase() }}
        onClick={onClick}
    />
)

const FilterSidebar = ({
    categories,
    selectedCategory,
    selectedSubcategory,
    filters,
    appliedFilters,
    showFilters,
    handleCategoryChange,
    handleSubcategoryChange,
    handleFilterChange,
    clearFilter,
    clearAllFilters,
    setShowFilters,
}) => {
    const currentCategoryData = categories[selectedCategory]

    return (
        <div className={`${showFilters ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Filter className="w-4 h-4 mr-2" /> Filters
                    </h3>
                    <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>

                {/* Applied Filters */}
                {appliedFilters.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Applied Filters</span>
                            <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:text-blue-800">
                                clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {appliedFilters.map((filter, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800" >
                                    {filter.value}
                                    <button onClick={() => clearFilter(filter.type, filter.value)} className="ml-1 text-gray-500 hover:text-gray-700" >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
                        Category <ChevronDown className="w-4 h-4" />
                    </h4>
                    <div className="space-y-2">
                        {Object.keys(categories).map((category) => (
                            <label key={category} className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category}
                                    onChange={() => handleCategoryChange(category)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Subcategory</h4>
                    <div className="space-y-2">
                        <label key="All" className="flex items-center">
                            <input
                                type="radio"
                                name="subcategory"
                                checked={selectedSubcategory === "All"}
                                onChange={() => handleSubcategoryChange("All")}
                                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-bold text-gray-700">All {selectedCategory}</span>
                        </label>
                        {currentCategoryData?.subcategories.map((subcategory) => (
                            <label key={subcategory} className="flex items-center">
                                <input
                                    type="radio"
                                    name="subcategory"
                                    checked={selectedSubcategory === subcategory}
                                    onChange={() => handleSubcategoryChange(subcategory)}
                                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{subcategory}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Stock Status Filter */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
                        Stock Status <ChevronDown className="w-4 h-4" />
                    </h4>
                    <div className="space-y-2">
                        {["In Stock", "Out of Stock"].map((status) => (
                            <label key={status} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.stock.includes(status)}
                                    onChange={() => handleFilterChange("stock", status)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{status}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* CATEGORY-SPECIFIC FILTERS */}
                {/* Books: Topic */}
                {selectedCategory === "Books" && (
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Topic</h4>
                        <div className="space-y-2">
                            {currentCategoryData.topics.map((topic) => (
                                <label key={topic} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.topic.includes(topic)}
                                        onChange={() => handleFilterChange("topic", topic)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{topic}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Clothes Filters */}
                {selectedCategory === "Clothes" && (
                    <>
                        {/* Size Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
                                Size <ChevronDown className="w-4 h-4" />
                            </h4>
                            <div className="space-y-2">
                                {currentCategoryData.sizes.map((size) => (
                                    <label key={size} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.size.includes(size)}
                                            onChange={() => handleFilterChange("size", size)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center justify-between">
                                Color <ChevronDown className="w-4 h-4" />
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                                {currentCategoryData.colors.map((color) => (
                                    <ColorSwatch
                                        key={color}
                                        color={color}
                                        selected={filters.color.includes(color)}
                                        onClick={() => handleFilterChange("color", color)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Origin Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3">Origin</h4>
                            <div className="space-y-2">
                                {currentCategoryData.origins.map((origin) => (
                                    <label key={origin} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.origin.includes(origin)}
                                            onChange={() => handleFilterChange("origin", origin)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{origin}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Ornaments Filters */}
                {selectedCategory === "Ornaments" && (
                    <>
                        {/* Material Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3">Material</h4>
                            <div className="space-y-2">
                                {currentCategoryData.materials.map((material) => (
                                    <label key={material} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.material.includes(material)}
                                            onChange={() => handleFilterChange("material", material)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{material}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                            <div className="space-y-2">
                                {currentCategoryData.sizes.map((size) => (
                                    <label key={size} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.size.includes(size)}
                                            onChange={() => handleFilterChange("size", size)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default FilterSidebar