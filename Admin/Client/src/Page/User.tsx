import { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

const User = () => {
  const context = useContext(AdminContext);
  const alluser = context.alluser;
  const fetchUser = context.fetchUser;

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const users = alluser.filter((user): user is NonNullable<typeof user> => user !== null);
  const admins = users.filter((user) => user.role?.toLowerCase() === "admin").length;
  const customers = users.length - admins;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-sm text-gray-500">
          Review all registered users, roles, and account details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-2 text-2xl font-semibold text-gray-800">{users.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-2 text-2xl font-semibold text-indigo-600">{admins}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Customers</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{customers}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
        </div>

        {users.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((user, index) => (
                  <tr key={user._id ?? `user-${index}`} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          user.role?.toLowerCase() === "admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role || "unknown"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">{user._id || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;