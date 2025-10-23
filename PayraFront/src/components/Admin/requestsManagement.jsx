"use client"

import { useState, useEffect } from "react"
import { Trash2, Loader2, AlertTriangle, LinkIcon, Image as ImageIcon } from "lucide-react"
import API from '../../api';
import { useToast } from "../ToastSystem";

export default function RequestsManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get('/request');
        setRequests(data);
      } catch (err) {
        setError("Failed to fetch product requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [])


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await API.delete(`/request/${id}`);
        setRequests(prev => prev.filter(r => r._id !== id));
        addToast("Request deleted.", "success");
      } catch (err) {
        addToast("Failed to delete request.", "error");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-lg flex items-center gap-4">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Requests Management</h2>

      <div className="grid gap-4">
        {requests.length === 0 && !loading && (
           <p className="text-muted-foreground text-center py-4">No new product requests.</p>
        )}
        {requests.map((request) => (
          <div key={request._id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{request.itemName}</h3>
                <p className="text-sm text-muted-foreground">
                  From: {request.user?.username || 'N/A'} ({request.user?.email || 'N/A'})
                </p>
                <p className="text-sm text-muted-foreground">Quantity: {request.quantity}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                Request
              </span>
            </div>
            
            {request.externalLink && (
              <a 
                href={request.externalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline mb-2 text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                View Product Link
              </a>
            )}

            {request.itemPhoto?.url && (
               <a 
                href={request.itemPhoto.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline text-sm"
              >
                <ImageIcon className="w-4 h-4" />
                View Attached Image
              </a>
            )}
            
            <div className="flex justify-between items-center mt-4 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Received: {new Date(request.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-2">
                {/* Status select is removed as backend does not support it */}
                <button
                  onClick={() => handleDelete(request._id)}
                  className="p-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
