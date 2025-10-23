import React, { useState, useEffect } from 'react';
// --- CORRECTION: Switched to root-relative paths ---
import API from '/src/api.js'; 
import { useToast } from '../ToastSystem';
import { Loader2, AlertTriangle, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get('/orders/my-orders');
        
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error("Unexpected data format received.");
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
        setError("Could not retrieve your order history.");
        addToast("Failed to fetch orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [addToast]);

  const toggleOrderDetails = (id) => {
    setExpandedOrderId(prevId => (prevId === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold uppercase text-sm">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold uppercase text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold uppercase text-sm">Total</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold uppercase text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold uppercase text-sm">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(Boolean).map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 px-4 text-gray-700 font-mono text-sm">#{order._id.substring(0, 8)}...</td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="py-4 px-4 text-gray-800 font-semibold">{formatPrice(order.totalPrice)}</td>
                      <td className="py-4 px-4">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedOrderId === order._id ? (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1" />
                          )}
                          View
                        </button>
                      </td>
                    </tr>
                    {/* --- Expanded Detail Row --- */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan="5" className="p-4">
                          <h4 className="text-md font-semibold text-gray-800 mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.orderItems.map((item) => (
                              <div key={item.product} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-12 h-12 rounded-md object-cover border border-gray-200"
                                    onError={(e) => e.target.src = 'https://placehold.co/48x48/eee/ccc?text=?'}
                                  />
                                  <div>
                                    <Link 
                                      to={`/product/${item.product}`} 
                                      className="font-medium text-gray-900 hover:text-blue-600"
                                    >
                                      {item.name}
                                    </Link>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-medium text-gray-700">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

