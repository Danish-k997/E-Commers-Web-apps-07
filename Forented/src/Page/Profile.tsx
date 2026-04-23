import { useContext, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext.tsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const context = useContext(ShopContext);
  const UserData = context?.UserData;
  const getUserData = context?.getUsersData;
  const address = context?.address;
  const fetchAddress = context?.fetchAddress;
  const addressLoading = context?.addressLoading;
  const navigate = useNavigate();

  const handleEditAddress = () => {
    if (address) {
      navigate("/update-address", { state: { address } });
    } else {
      navigate("/address");
    }
  };
  useEffect(() => {
    getUserData?.();
  }, [getUserData]);

  useEffect(() => {
    fetchAddress?.();
  }, [fetchAddress]);


  const isProfileLoading = !UserData;
  const isAddressLoading = Boolean(addressLoading);

  const addressItems = [
    { label: "Full Name", value: address?.name || "Not added" },
    { label: "Phone", value: address?.phone || "Not added" },
    { label: "Landmark", value: address?.landmark || "Not added" },
    { label: "City", value: address?.city || "Not added" },
    { label: "State", value: address?.state || "Not added" },
    { label: "Pincode", value: address?.pincode || "Not added" },
    { label: "Country", value: address?.country || "Not added" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
              Account Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">My Profile</h1>
            <p className="mt-2 text-orange-50">
              Manage your personal details and delivery address in one place.
            </p>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">
                Personal Information
              </h2>

              {isProfileLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="text-right font-medium text-slate-900">
                      {UserData?.name || "Not available"}
                    </p>
                  </div>
                  <div className="border-t border-slate-200" />
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-right font-medium text-slate-900 break-all">
                      {UserData?.email || "Not available"}
                    </p>
                  </div>
                  <div className="border-t border-slate-200" />
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-500">Role</p>
                    <p className="text-right font-medium text-slate-900 capitalize">
                      {UserData?.role || "User"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-semibold text-slate-900">
                  Delivery Address
                </h2>
                <button
                  onClick={handleEditAddress}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                >
                  {address ? "Edit Address" : "Add Address"}
                </button>
              </div>

              {isAddressLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                  <div className="h-4 bg-slate-200 rounded w-3/5" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ) : (
                <div className="space-y-3">
                  {addressItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-4"
                    >
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="text-right font-medium text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;