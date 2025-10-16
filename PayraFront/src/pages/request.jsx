import { useState } from "react";
import API from '../api'; // axios 

const RequestProductForm = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    externalLink: "",
    quantity: "",
    itemPhoto: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, itemPhoto: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    else if (isNaN(Number(formData.quantity)) || Number.parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validateForm()) {
      setIsSubmitting(true);
      
      const submissionData = new FormData();
      submissionData.append('itemName', formData.itemName);
      submissionData.append('externalLink', formData.externalLink);
      submissionData.append('quantity', formData.quantity);
      if (formData.itemPhoto) {
        submissionData.append('itemPhoto', formData.itemPhoto);
      }

      try {
        const { data } = await API.post('/request', submissionData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSuccessMessage(data.message);
        setTimeout(() => {
          setFormData({ itemName: "", externalLink: "", quantity: "", itemPhoto: null });
          setSuccessMessage("");
        }, 3000);

      } catch (err) {
        setErrorMessage(err.response?.data?.message || "Transmission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#004C04] text-center mb-8">Request A Product</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-[#72A274] mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="Enter name for a product you are looking for..."
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.itemName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.itemName && <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>}
          </div>

          {/* External Link */}
          <div>
            <label htmlFor="externalLink" className="block text-sm font-medium text-[#72A274] mb-2">
              External Link
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleInputChange}
              placeholder="Enter Product links from other sites here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-[#72A274] mb-2">
              Enter Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Please Enter how many pieces would you prefer..."
              min="1"
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>
          
          {/* Item Photo Input */}
          <div>
            <label className="block text-sm font-medium text-[#72A274] mb-2">Item Photo</label>
            <div className="relative">
              <input type="file" id="itemPhoto" name="itemPhoto" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between">
                <span className={`${formData.itemPhoto ? "text-gray-900" : "text-gray-500"}`}>
                  {formData.itemPhoto ? formData.itemPhoto.name : "Take a picture of the item and upload here..."}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-3xl sm:w-auto bg-[#4805] hover:bg-[#94BC96] text-gray-900 font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestProductForm;

