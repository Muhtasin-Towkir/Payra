import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import API from '../api';//axios

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // State for handling submission feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Send the form data to the backend /api/v1/contact endpoint
      const { data } = await API.post('/contact', formData);
      
      // On success, set the success message and clear the form
      setSuccess(data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

    } catch (err) {
      // On failure, set the error message from the backend response
      setError(err.response?.data?.message || "Transmission failed. Please try again.");
    } finally {
      // This runs after the try or catch block is finished
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-[#0d261a] py-16 px-4 md:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info (no changes) */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-16 leading-tight">
              Send us Message
            </h1>
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#dff5e3] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-[#0d261a]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Phone</h3>
                  <p className="text-lg">+8801886520928</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#dff5e3] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-[#0d261a]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Email</h3>
                  <p className="text-lg">contact@payra.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#dff5e3] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-[#0d261a]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Address</h3>
                  <p className="text-lg">13/33, Rupnagar, Mirpur, Dhaka-1216</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input fields remain the same */}
              <div>
                <label htmlFor="name" className="block text-base mb-2">Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#dff5e3] text-[#0d261a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a9a5a]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-base mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#dff5e3] text-[#0d261a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a9a5a]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-base mb-2">Phone <span className="text-red-500">*</span></label>
                <input type="tel" id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#dff5e3] text-[#0d261a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a9a5a]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-base mb-2">Message</label>
                <textarea id="message" rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#dff5e3] text-[#0d261a] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#5a9a5a]"
                />
              </div>

              {/* Display Success or Error Messages */}
              {success && <p className="text-center text-green-600 font-medium">{success}</p>}
              {error && <p className="text-center text-red-600 font-medium">{error}</p>}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button type="submit" disabled={isSubmitting}
                  className="bg-[#85a554] hover:bg-[#aac77f] text-white font-medium px-10 py-3 rounded-full transition-colors duration-200 disabled:bg-gray-400"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
