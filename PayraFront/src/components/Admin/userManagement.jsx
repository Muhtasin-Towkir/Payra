import { useState, useEffect } from "react";
import { Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";
import API from "../../api";
import { useToast } from "../ToastSystem";

// Helper to format the date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/users");
        
        // ---
        // CORRECTED: Check if data is an array directly.
        // The API sends `[...]` but the component was expecting `{ users: [...] }`
        // ---
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users); // Fallback for other formats
        } else {
          throw new Error("Unexpected data format received from API.");
        }

      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch user data.");
        addToast("Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [addToast]);

  const handleRoleChange = async (id, newRole) => {
    try {
      const { data } = await API.put(`/users/${id}`, { role: newRole });

      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      addToast("User role updated", "success");

    } catch (err) {
      console.error("Failed to update role:", err);
      addToast("Failed to update role", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
        addToast("User deleted successfully", "success");
      } catch (err) {
        console.error("Failed to delete user:", err);
        addToast("Failed to delete user", "error");
      }
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
      <h2 className="text-3xl font-bold text-foreground">Users Management</h2>

      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Role</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Joined</th>
                <th className="text-left py-3 px-4 text-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-border hover:bg-muted transition">
                  <td className="py-3 px-4 text-foreground font-medium">{user.username}</td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-input border border-border rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4 flex gap-2">
                    {/* The Edit button is not functional yet, as we did not build a "GetSingleUser" modal */}
                    <button className="p-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition opacity-50 cursor-not-allowed">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
           <div className="text-center py-12 text-muted-foreground">
             <p>No users found in the registry.</p>
           </div>
        )}
      </div>
    </div>
  );
}

