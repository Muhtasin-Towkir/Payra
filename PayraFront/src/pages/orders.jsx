import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { ChevronLeft, Package, CheckCircle, Clock } from "lucide-react";
import API from "../api.js";
import { useAuth } from "../context/authContext.jsx"; 

// This component fetches real order data from your backend
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the logged-in user

  useEffect(() => {
    // Fetches orders from your /api/v1/orders/my-orders endpoint
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        setError("You must be logged in to view your orders.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get("/orders/my-orders");
        // The backend returns orders sorted by newest first
        setOrders(data || []);
      } catch (err) {
        setError("Failed to retrieve your order history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // Re-fetch if the user logs in or out

  const getStatusIcon = (status) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "delivered") {
      return <CheckCircle className="text-green-500" size={20} />; // Use theme-agnostic colors
    }
    if (lowerStatus === "shipped") {
      return <Package className="text-blue-500" size={20} />;
    }
    // Default to 'processing'
    return <Clock className="text-yellow-500" size={20} />;
  };

  const getStatusLabel = (status) => {
    if (!status) return "Processing";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading Order History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">
            {error}
          </h2>
          <p className="text-muted-foreground mb-6">
            Please log in and try again.
          </p>
          <Link
            to="/user" // <-- Changed to 'to'
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    // This JSX structure and styling is copied directly from your example
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            to="/user" // <-- Changed to 'to' and path updated
            className="flex items-center gap-2 text-primary hover:text-accent mb-4 w-fit"
          >
            <ChevronLeft size={20} />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Link
              to="/shop" // <-- Changed to 'to' and path to '/shop'
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Map over real order data */}
            {orders.map((order) => (
              <div
                key={order._id} // <-- Use Mongoose _id
                className="bg-card rounded-lg border border-border p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {/* Use a shorter, user-friendly ID */}
                      Order ID: ...{order._id.substring(18).toUpperCase()}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Use orderStatus from Mongoose schema */}
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-sm font-medium">
                      {getStatusLabel(order.orderStatus)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-border pt-4 mb-4">
                  {/* Map over orderItems from Mongoose schema */}
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={item._id || idx} // <-- Use item _id
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {/* Calculate item total price */}
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


