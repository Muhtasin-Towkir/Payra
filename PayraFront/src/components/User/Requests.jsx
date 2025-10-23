import React, { useState, useEffect } from 'react';
import API from '/src/api.js'; 
import { useToast } from '../ToastSystem';
import { Loader2, AlertTriangle, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMyRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        // This endpoint is secured by 'protect' and finds requests by user ID
        const { data } = await API.get('/request/my-requests');
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          throw new Error("Unexpected data format received.");
        }
      } catch (err) {
        console.error("Failed to fetch user requests:", err);
        setError("Could not retrieve your product requests.");
        addToast("Failed to fetch requests", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMyRequests();
  }, [addToast]);

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
      <h2 className="text-3xl font-bold text-gray-900">My Product Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You have not made any product requests.</p>
          <p className="text-sm mt-2">Go to the "Request" page in the navbar to submit one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center border">
                  {request.itemPhoto && request.itemPhoto.url ? (
                    <img 
                      src={request.itemPhoto.url} 
                      alt={request.itemName}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => e.target.src = 'https://placehold.co/96x96/eee/ccc?text=?'}
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{request.itemName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested on: {formatDate(request.createdAt)}
                  </p>
                  
                  {request.externalLink && (
                    <a 
                      href={request.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <LinkIcon className="w-4 h-4" />
                      View Product Link
                    </a>
                  )}
                  
                  <p className="text-md text-gray-700 mt-2">
                    Quantity Requested: <span className="font-medium">{request.quantity}</span>
                  </p>
                </div>
                
                {/* Status (Placeholder, as we did not build status tracking for requests) */}
                <div className="flex-shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Submitted
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
