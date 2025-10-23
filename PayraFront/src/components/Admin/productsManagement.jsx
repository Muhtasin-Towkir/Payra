"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, X, Loader2, AlertTriangle, UploadCloud } from "lucide-react"
import API from '../../api';
import { useToast } from "../ToastSystem";
const initialFormData = {
  name: "",
  category: "Clothes",
  subcategory: "",
  price: "",
  inStock: 100,
  description: "",
  // We do not store image URLs, we handle file uploads
};

export default function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [files, setFiles] = useState(null); // For file uploads
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get('/products');
      setProducts(data.products);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create FormData
    const productData = new FormData();
    Object.keys(formData).forEach(key => {
      productData.append(key, formData[key]);
    });
    
    // 2. Append files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        productData.append('images', files[i]);
      }
    }

    // 3. Check if editing or creating
    try {
      if (editingId) {
        const { data } = await API.put(`/products/${editingId}`, formData); // Send as JSON, not FormData
        setProducts(prev => prev.map(p => (p._id === editingId ? data.product : p)));
        addToast("Product updated.", "success");
      } else {
        // We are creating.
        if (!files || files.length === 0) {
          addToast("You must upload at least one image.", "error");
          return;
        }
        const { data } = await API.post('/products', productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts(prev => [data.product, ...prev]);
        addToast("Product created.", "success");
      }

      // 4. Reset form
      setFormData(initialFormData);
      setFiles(null);
      setEditingId(null);
      setShowForm(false);

    } catch (err) {
      addToast(`Error: ${err.response?.data?.message || 'Operation failed.'}`, "error");
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || "",
      price: product.price,
      inStock: product.inStock,
      description: product.description || "",
    });
    setEditingId(product._id);
    setShowForm(true);
    setFiles(null); // Clear file input when editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This is irreversible.")) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
        addToast("Product deleted.", "success");
      } catch (err) {
        addToast("Failed to delete product.", "error");
        console.error(err);
      }
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Products Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(initialFormData);
            setFiles(null);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-lg flex items-center gap-4">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-foreground">{editingId ? "Edit Product" : "Add New Product"}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <select
                 name="category"
                 value={formData.category}
                 onChange={handleFormChange}
                 className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                 required
               >
                 <option value="Clothes">Clothes</option>
                 <option value="Books">Books</option>
                 <option value="Ornaments">Ornaments</option>
               </select>
              <input
                type="text"
                placeholder="Subcategory (e.g., Jamdani)"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
            />
             <input
                type="number"
                placeholder="Stock Quantity"
                name="inStock"
                value={formData.inStock}
                onChange={handleFormChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            
            {!editingId && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 file:cursor-pointer bg-input border border-border rounded-lg text-foreground"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Upload one or more images for this product.</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              {editingId ? "Update Product" : "Create Product"}
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {products.length === 0 && !loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No products yet. Create your first product!</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-card border border-border rounded-lg p-4 flex justify-between items-start"
            >
              <div className="flex gap-4 items-start">
                <img 
                  src={product.images[0]?.url || 'https://placehold.co/100x100/EEE/31343C?text=No+Image'}
                  alt={product.name}
                  className="w-20 h-20 rounded-md object-cover border border-border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category} {product.subcategory && `> ${product.subcategory}`}</p>
                  <p className="text-primary font-bold mt-2">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Stock: {product.inStock}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Helper function to format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT', // Change to your desired currency
  }).format(price);
};
