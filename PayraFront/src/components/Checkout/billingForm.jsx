import React from 'react';

const BillingForm = ({ formData, handleInputChange }) => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-border">Billing details</h2>
      
      <div className="space-y-6">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First name *</label>
            <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last name *</label>
            <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-2">Country / Region *</label>
          <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent">
            <option>Bangladesh</option><option>India</option><option>Pakistan</option><option>United States</option><option>United Kingdom</option>
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium mb-2">Street address *</label>
          <input type="text" name="streetAddress" required placeholder="House number and street name" value={formData.streetAddress} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"/>
          <input type="text" name="apartment" placeholder="Apartment, suite, unit, etc. (optional)" value={formData.apartment} onChange={handleInputChange} className="w-full mt-4 px-4 py-2 bg-input border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"/>
        </div>

        {/* Town / City, District, Postcode */}
        <div><label className="block text-sm font-medium mb-2">Town / City *</label><input type="text" required name="townCity" value={formData.townCity} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div>
        <div><label className="block text-sm font-medium mb-2">District *</label><select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"><option>Dhaka</option><option>Chittagong</option><option>Sylhet</option><option>Khulna</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Postcode / ZIP (optional)</label><input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div>

        {/* Phone & Email */}
        <div><label className="block text-sm font-medium mb-2">Phone *</label><input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div>
        <div><label className="block text-sm font-medium mb-2">Email address *</label><input type="email" required name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"/></div>

        {/* Ship to Different Address Checkbox */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="shipDifferent" name="shipDifferent" checked={formData.shipDifferent} onChange={handleInputChange} className="w-4 h-4 rounded border-border bg-input cursor-pointer accent-accent"/>
          <label htmlFor="shipDifferent" className="text-sm font-medium cursor-pointer">Ship to a different address?</label>
        </div>

        {/* Conditional Shipping Form */}
        {formData.shipDifferent && (
          <div className="space-y-6 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">First name *</label><input type="text" name="shippingFirstName" required value={formData.shippingFirstName} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg"/></div>
              <div><label className="block text-sm font-medium mb-2">Last name *</label><input type="text" name="shippingLastName" required value={formData.shippingLastName} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border border-border rounded-lg"/></div>
            </div>
            <div><label className="block text-sm font-medium mb-2">Country / Region *</label><select name="shippingCountry" value={formData.shippingCountry} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border rounded-lg"><option>Bangladesh</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Street address *</label><input type="text" name="shippingStreet" required placeholder="House number and street name" value={formData.shippingStreet} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border rounded-lg"/><input type="text" name="shippingApartment" placeholder="Apartment, suite, unit, etc. (optional)" value={formData.shippingApartment} onChange={handleInputChange} className="w-full mt-4 px-4 py-2 bg-input border rounded-lg"/></div>
            <div><label className="block text-sm font-medium mb-2">Town / City *</label><input type="text" required name="shippingTown" value={formData.shippingTown} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border rounded-lg"/></div>
            <div><label className="block text-sm font-medium mb-2">District *</label><select name="shippingDistrict" value={formData.shippingDistrict} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border rounded-lg"><option>Dhaka</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Postcode / ZIP (optional)</label><input type="text" name="shippingPostcode" value={formData.shippingPostcode} onChange={handleInputChange} className="w-full px-4 py-2 bg-input border rounded-lg"/></div>
          </div>
        )}

        {/* Order Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Order notes (optional)</label>
          <textarea name="orderNotes" placeholder="Notes about your order, e.g. special notes for delivery." value={formData.orderNotes} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 bg-input border border-border rounded-lg resize-none placeholder-muted-foreground"/>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;

