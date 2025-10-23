import React, { useState, useEffect } from "react"; // <-- IMPORT ADDED
import { Eye, Loader2, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import API from "../../api.js";
import { useToast } from "../ToastSystem.jsx";
import { Link } from "react-router-dom"; 

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

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  
  // --- NEW: State to track which order row is expanded ---
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/orders");
        
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error("Unexpected data format received from API.");
        }

      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch order data.");
        addToast("Failed to fetch orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [addToast]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}`, { orderStatus: newStatus });
      setOrders(
        orders.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o))
      );
      addToast("Order status updated", "success");
    } catch (err) { // <-- SYNTAX FIXED
      console.error("Failed to update status:", err);
      addToast("Failed to update status", "error");
    } // <-- SYNTAX FIXED
  };

  // --- NEW: Toggle for expanding/collapsing order details ---
  const toggleOrderDetails = (id) => {
    if (expandedOrderId === id) {
      setExpandedOrderId(null); // Collapse if already open
    } else {
      setExpandedOrderId(id); // Expand new one
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
      <h2 className="text-3xl font-bold text-foreground">Orders Management</h2>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Total</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(Boolean).map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-b border-border hover:bg-muted transition">
                    <td className="py-3 px-4 text-foreground font-mono text-sm">#{order._id.substring(0, 6)}...</td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {order.user ? order.user.username : <span className="text-red-500">User Deleted</span>}
                    </td>
                    <td className="py-3 px-4 text-primary font-semibold">{formatPrice(order.totalPrice)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-input border border-border rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button 
                        onClick={() => toggleOrderDetails(order._id)}
                        className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
                      >
                        {expandedOrderId === order._id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedOrderId === order._id && (
                    <tr className="bg-muted border-b border-border">
                      <td colSpan="6" className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Order Items:</h4>
                          {order.orderItems.map((item) => (
                            <div key={item.product} className="flex justify-between items-center p-2 bg-card rounded">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover"/>
                                <div>
                                  <Link 
                                    to={`/product/${item.product}`} 
                                    className="font-medium text-primary hover:underline"
                                    target="_blank" // Open in new tab
                                    rel="noopener noreferrer"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">Product ID: {item.product ? item.product.substring(0, 10) : 'N/A'}...</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-foreground">{formatPrice(item.price)} x {item.quantity}</p>
                                <p className="text-sm text-muted-foreground">Total: {formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                           <div className="border-t border-border pt-3 mt-3">
                             <h5 className="font-semibold">Shipping Details:</h5>
                             <p className="text-sm text-muted-foreground">{order.shippingInfo.address}</p>
                             <p className="text-sm text-muted-foreground">{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                             <p className="text-sm text-muted-foreground">Phone: {order.shippingInfo.phoneNo}</p>
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
           <div className="text-center py-12 text-muted-foreground">
             <p>No orders found in the registry.</p>
           </div>
        )}
      </div>
    </div>
  );
}

