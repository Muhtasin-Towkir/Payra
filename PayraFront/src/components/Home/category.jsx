const Categories = () => {

  const handleCategoryClick = (categoryName) => {
    // redirect to the shop page with the correct category filter
    const url = `/shop?category=${categoryName}`;
    window.location.href = url;
    console.log(`Redirecting to: ${url}`); // Optional: Check console 
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1a4d3e]">Our Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. BOOKS BUTTON - Hardcoded to 'Books' */}
          <div 
            className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-[1.02]"
            onClick={() => handleCategoryClick('Books')}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Books</h3>
            <p className="text-gray-600">Discover amazing stories and knowledge</p>
          </div>

          {/* 2. CLOTHING BUTTON - Hardcoded to 'Clothes' */}
          <div 
            className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-[1.02]"
            onClick={() => handleCategoryClick('Clothes')}
          >
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Clothing</h3>
            <p className="text-gray-600">Fashion for every occasion</p>
          </div>

          {/* 3. ORNAMENTS BUTTON - Hardcoded to 'Ornaments' */}
          <div 
            className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-[1.02]"
            onClick={() => handleCategoryClick('Ornaments')}
          >
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Ornaments</h3>
            <p className="text-gray-600">Elegant accessories for every look</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Categories;