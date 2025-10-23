"use client"

import { useState, useEffect } from "react"
import { Trash2, Mail, Loader2, AlertTriangle } from "lucide-react"
import API from '../../api'; // Assuming you have an axios instance at src/api.js
import { useToast } from "../ToastSystem";

export default function MessagesManagement() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await API.get('/contact');
        setMessages(data);
      } catch (err) {
        setError("Failed to fetch transmissions. Contact command.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transmission?")) {
      try {
        await API.delete(`/contact/${id}`);
        setMessages(prev => prev.filter(m => m._id !== id));
        setSelectedMessage(null);
        addToast("Transmission deleted.", "success");
      } catch (err) {
        addToast("Failed to delete transmission.", "error");
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
      <h2 className="text-3xl font-bold text-foreground">Contact Messages</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {messages.length === 0 && !loading && (
             <p className="text-muted-foreground text-center py-4">No new transmissions.</p>
          )}
          {messages.map((msg) => (
            <button
              key={msg._id}
              onClick={() => setSelectedMessage(msg)}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selectedMessage?._id === msg._id
                  ? "bg-primary border-primary"
                  : "bg-card border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-2">
                <Mail className={`w-4 h-4 mt-1 flex-shrink-0 ${selectedMessage?._id === msg._id ? "text-primary-foreground" : "text-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium truncate ${selectedMessage?._id === msg._id ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {msg.name}
                  </p>
                  <p
                    className={`text-xs truncate ${selectedMessage?._id === msg._id ? "text-primary-foreground opacity-80" : "text-muted-foreground"}`}
                  >
                    {msg.message.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMessage.email} {selectedMessage.phone && `| ${selectedMessage.phone}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center h-full flex flex-col justify-center items-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
