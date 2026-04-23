import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { updateAddress } from "../Servers/ProducteServer.ts";
import { ShopContext } from "../Context/ShopContext.tsx";

interface AddressFormData {
  name: string;
  phone: string;
  city: string;
  state: string;
  landmark?: string;
  pincode: string;
}

const UpdateAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(ShopContext);
  const user = context?.user as { id?: string } | null;

  const existingAddress = location.state?.address;
  const addressData = Array.isArray(existingAddress)
    ? existingAddress[0]
    : existingAddress;
  const addressId = addressData?._id;

  const [formData, setFormData] = useState<AddressFormData>({
    name: addressData?.name || "",
    phone: String(addressData?.phone || ""),
    city: addressData?.city || "",
    state: addressData?.state || "",
    landmark: addressData?.landmark || "",
    pincode: String(addressData?.pincode || ""),
  });

  const [errors, setErrors] = useState<Partial<AddressFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!addressData) {
      toast.error("Address data not found");
      navigate(-1); 
    }
  }, [navigate, addressData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressFormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.state.trim()) newErrors.state = "State required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    if (!addressId) {
      toast.error("Address ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAddress(addressId, formData);
      toast.success("Address updated successfully!");
      navigate("/order-summary");
    } catch (error) {
      console.log(error);
      toast.error("Update failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Bihar",
    "Delhi",
    "Gujarat",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Jammu and Kashmir",
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Update Address
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 
                  focus:ring-orange-500 ${errors.name ? "border-red-300" : "border-slate-300"}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 
                  focus:ring-orange-500 ${errors.phone ? "border-red-300" : "border-slate-300"}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Landmark
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl 
                  focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city} // ✅ pehle se bhara hoga
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 
                    focus:ring-orange-500 ${errors.city ? "border-red-300" : "border-slate-300"}`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state} // ✅ pehle se select hoga
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 
                    focus:ring-orange-500 ${errors.state ? "border-red-300" : "border-slate-300"}`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode} // ✅ pehle se bhara hoga
                onChange={handleInputChange}
                maxLength={6}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 
                  focus:ring-orange-500 ${errors.pincode ? "border-red-300" : "border-slate-300"}`}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 
                text-white font-semibold py-4 rounded-xl transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Address"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAddress;
