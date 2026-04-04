import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminProperty,
  deleteAdminUser,
  getAdminProperties,
  getAdminStats,
  getAdminUsers,
  updateAdminProperty,
  updateAdminUser,
  getContactMessages,
  markMessageAsRead,
  resolveMessage,
  deleteContactMessage,
  suspendUser,
  activateUser,
  approveProperty,
  rejectProperty,
} from "../../lib/apiRequest";

const initialUserForm = {
  id: "",
  username: "",
  email: "",
  phoneNumber: "",
  userType: "buyer",
  isAdmin: false,
  password: "",
};

const initialPropertyForm = {
  id: "",
  title: "",
  price: "",
  city: "",
  address: "",
  bedroom: "",
  bathroom: "",
  type: "buy",
  property: "apartment",
  desc: "",
};

// Status Badge Component
const StatusBadge = ({ status, type = "user" }) => {
  const getStyles = () => {
    if (type === "user") {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800";
        case "suspended":
          return "bg-yellow-100 text-yellow-800";
        case "banned":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else if (type === "property") {
      switch (status) {
        case "approved":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else if (type === "message") {
      switch (status) {
        case "new":
          return "bg-blue-100 text-blue-800";
        case "read":
          return "bg-gray-100 text-gray-800";
        case "resolved":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${getStyles()}`}>
      {status}
    </span>
  );
};

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userForm, setUserForm] = useState(initialUserForm);
  const [propertyForm, setPropertyForm] = useState(initialPropertyForm);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [submittingProperty, setSubmittingProperty] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsData, usersData, propertiesData, contactsData] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminProperties(),
        getContactMessages(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setProperties(propertiesData);
      setContacts(contactsData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const statCards = useMemo(() => {
    if (!stats) return [];

    return [
      { label: "Total Users", value: stats.totalUsers },
      { label: "Buyers", value: stats.totalBuyers },
      { label: "Sellers", value: stats.totalSellers },
      { label: "Properties", value: stats.totalProperties },
      { label: "Bookings", value: stats.totalBookings },
      { label: "Pending Bookings", value: stats.pendingBookings },
    ];
  }, [stats]);

  const handleUserEditClick = (user) => {
    setUserForm({
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      userType: user.userType,
      isAdmin: Boolean(user.isAdmin),
      password: "",
    });
    setActiveTab("users");
  };

  const handlePropertyEditClick = (property) => {
    setPropertyForm({
      id: property.id,
      title: property.title,
      price: property.price,
      city: property.city,
      address: property.address,
      bedroom: property.bedroom,
      bathroom: property.bathroom,
      type: property.type,
      property: property.property,
      desc: property.postDetail?.desc || "",
    });
    setActiveTab("properties");
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.id) return;

    setSubmittingUser(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        username: userForm.username,
        email: userForm.email,
        phoneNumber: userForm.phoneNumber || null,
        userType: userForm.userType,
        isAdmin: userForm.isAdmin,
        ...(userForm.password ? { password: userForm.password } : {}),
      };

      const updatedUser = await updateAdminUser(userForm.id, payload);
      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
      setMessage("User updated successfully.");
      setUserForm(initialUserForm);
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Delete this user? This will also remove the seller's properties and related bookings.")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteAdminUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setMessage("User deleted successfully.");
      if (userForm.id === userId) {
        setUserForm(initialUserForm);
      }
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUserSuspend = async (userId) => {
    const reason = window.prompt("Enter suspension reason:");
    if (!reason) return;

    setMessage("");
    setError("");

    try {
      await suspendUser(userId, reason);
      setMessage("User suspended successfully.");
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to suspend user");
    }
  };

  const handleUserActivate = async (userId) => {
    if (!window.confirm("Activate this user account?")) return;

    setMessage("");
    setError("");

    try {
      await activateUser(userId);
      setMessage("User activated successfully.");
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to activate user");
    }
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    if (!propertyForm.id) return;

    setSubmittingProperty(true);
    setMessage("");
    setError("");

    try {
      const updatedProperty = await updateAdminProperty(propertyForm.id, {
        postData: {
          title: propertyForm.title,
          price: propertyForm.price,
          city: propertyForm.city,
          address: propertyForm.address,
          bedroom: propertyForm.bedroom,
          bathroom: propertyForm.bathroom,
          type: propertyForm.type,
          property: propertyForm.property,
        },
        postDetail: {
          desc: propertyForm.desc,
        },
      });

      setProperties((prev) =>
        prev.map((property) => (property.id === updatedProperty.id ? { ...property, ...updatedProperty } : property))
      );
      setMessage("Property updated successfully.");
      setPropertyForm(initialPropertyForm);
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update property");
    } finally {
      setSubmittingProperty(false);
    }
  };

  const handlePropertyDelete = async (propertyId) => {
    if (!window.confirm("Delete this property and its related booking/save data?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteAdminProperty(propertyId);
      setProperties((prev) => prev.filter((property) => property.id !== propertyId));
      setMessage("Property deleted successfully.");
      if (propertyForm.id === propertyId) {
        setPropertyForm(initialPropertyForm);
      }
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete property");
    }
  };

  const handlePropertyApprove = async (propertyId) => {
    if (!window.confirm("Approve this property? It will be visible to all users.")) return;

    setMessage("");
    setError("");

    try {
      await approveProperty(propertyId);
      setMessage("Property approved successfully.");
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to approve property");
    }
  };

  const handlePropertyReject = async (propertyId) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    setMessage("");
    setError("");

    try {
      await rejectProperty(propertyId, reason);
      setMessage("Property rejected successfully.");
      await loadAdminData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reject property");
    }
  };

  const handleMessageRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      setContacts((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "read" } : msg)));
      setMessage("Message marked as read.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to mark message as read");
    }
  };

  const handleMessageResolve = async (messageId) => {
    try {
      await resolveMessage(messageId);
      setContacts((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: "resolved" } : msg)));
      setMessage("Message resolved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to resolve message");
    }
  };

  const handleMessageDelete = async (messageId) => {
    if (!window.confirm("Delete this contact message?")) return;

    try {
      await deleteContactMessage(messageId);
      setContacts((prev) => prev.filter((msg) => msg.id !== messageId));
      setMessage("Message deleted successfully.");
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete message");
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#040404]">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review platform totals, manage users, properties, and contact messages from one place.
          </p>
        </div>

        {message && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#040404]">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${activeTab === "users" ? "bg-[#040404] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200"}`}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("properties")}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${activeTab === "properties" ? "bg-[#040404] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200"}`}
          >
            Properties
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${activeTab === "contacts" ? "bg-[#040404] text-white" : "bg-white text-gray-600 ring-1 ring-gray-200"}`}
          >
            Contact Messages
            {contacts.filter(c => c.status === 'new').length > 0 && (
              <span className="ml-2 inline-block rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {contacts.filter(c => c.status === 'new').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "users" && (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-[#040404]">Users</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Contact</th>
                      <th className="px-5 py-3 font-medium">Posts</th>
                      <th className="px-5 py-3 font-medium">Created</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-gray-100">
                        <td className="px-5 py-4">
                          <div className="font-medium text-[#040404]">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          {user.isAdmin && <div className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Admin</div>}
                        </td>
                        <td className="px-5 py-4 capitalize">{user.userType}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={user.accountStatus} type="user" />
                          {user.suspendReason && (
                            <div className="mt-1 text-xs text-gray-500">Reason: {user.suspendReason}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-600">{user.phoneNumber || "Not added"}</td>
                        <td className="px-5 py-4">{user._count?.posts || 0}</td>
                        <td className="px-5 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <button type="button" onClick={() => handleUserEditClick(user)} className="rounded-lg bg-[#fece51] px-3 py-2 text-xs font-semibold text-[#1a1a1a]">
                              Edit
                            </button>
                            {user.accountStatus === 'active' && !user.isAdmin && (
                              <button type="button" onClick={() => handleUserSuspend(user.id)} className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white">
                                Suspend
                              </button>
                            )}
                            {user.accountStatus === 'suspended' && (
                              <button type="button" onClick={() => handleUserActivate(user.id)} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white">
                                Activate
                              </button>
                            )}
                            <button type="button" onClick={() => handleUserDelete(user.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-semibold text-[#040404]">Edit User</h2>
              <p className="mt-1 text-sm text-gray-500">Select a user from the table to update details or admin access.</p>
              <form onSubmit={handleUserSubmit} className="mt-6 space-y-4">
                <input type="text" value={userForm.username} onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))} placeholder="Username" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!userForm.id} />
                <input type="email" value={userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!userForm.id} />
                <input type="text" value={userForm.phoneNumber} onChange={(e) => setUserForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="Phone number" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!userForm.id} />
                <input type="password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="New password (optional)" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!userForm.id} />
                <select value={userForm.userType} onChange={(e) => setUserForm((prev) => ({ ...prev, userType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!userForm.id}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input type="checkbox" checked={userForm.isAdmin} onChange={(e) => setUserForm((prev) => ({ ...prev, isAdmin: e.target.checked }))} disabled={!userForm.id} />
                  Grant admin access
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={!userForm.id || submittingUser} className="rounded-xl bg-[#040404] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {submittingUser ? "Saving..." : "Save User"}
                  </button>
                  <button type="button" onClick={() => setUserForm(initialUserForm)} className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-[#040404]">Seller Properties</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Property</th>
                      <th className="px-5 py-3 font-medium">Seller</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Price</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className="border-t border-gray-100">
                        <td className="px-5 py-4">
                          <div className="font-medium text-[#040404]">{property.title}</div>
                          <div className="text-xs text-gray-500">{property.city}, {property.address}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-[#040404]">{property.user?.username}</div>
                          <div className="text-xs text-gray-500">{property.user?.email}</div>
                        </td>
                        <td className="px-5 py-4 capitalize">{property.type} / {property.property}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={property.status} type="property" />
                          {property.rejectionReason && (
                            <div className="mt-1 text-xs text-gray-500">Reason: {property.rejectionReason}</div>
                          )}
                        </td>
                        <td className="px-5 py-4">₹{Number(property.price).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <button type="button" onClick={() => handlePropertyEditClick(property)} className="rounded-lg bg-[#fece51] px-3 py-2 text-xs font-semibold text-[#1a1a1a]">
                              Edit
                            </button>
                            {property.status !== 'approved' && (
                              <button type="button" onClick={() => handlePropertyApprove(property.id)} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white">
                                Approve
                              </button>
                            )}
                            {property.status !== 'rejected' && (
                              <button type="button" onClick={() => handlePropertyReject(property.id)} className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white">
                                Reject
                              </button>
                            )}
                            <button type="button" onClick={() => handlePropertyDelete(property.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-semibold text-[#040404]">Edit Property</h2>
              <p className="mt-1 text-sm text-gray-500">Select a property to adjust the seller listing details.</p>
              <form onSubmit={handlePropertySubmit} className="mt-6 space-y-4">
                <input type="text" value={propertyForm.title} onChange={(e) => setPropertyForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                <input type="number" value={propertyForm.price} onChange={(e) => setPropertyForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                <input type="text" value={propertyForm.city} onChange={(e) => setPropertyForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                <input type="text" value={propertyForm.address} onChange={(e) => setPropertyForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Address" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={propertyForm.bedroom} onChange={(e) => setPropertyForm((prev) => ({ ...prev, bedroom: e.target.value }))} placeholder="Bedrooms" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                  <input type="number" value={propertyForm.bathroom} onChange={(e) => setPropertyForm((prev) => ({ ...prev, bathroom: e.target.value }))} placeholder="Bathrooms" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                </div>
                <select value={propertyForm.type} onChange={(e) => setPropertyForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id}>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
                <select value={propertyForm.property} onChange={(e) => setPropertyForm((prev) => ({ ...prev, property: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
                <textarea value={propertyForm.desc} onChange={(e) => setPropertyForm((prev) => ({ ...prev, desc: e.target.value }))} placeholder="Description" rows="3" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none" disabled={!propertyForm.id} />
                <div className="flex gap-3">
                  <button type="submit" disabled={!propertyForm.id || submittingProperty} className="rounded-xl bg-[#040404] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {submittingProperty ? "Saving..." : "Save Property"}
                  </button>
                  <button type="button" onClick={() => setPropertyForm(initialPropertyForm)} className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-[#040404]">Contact Messages</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Subject</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className={`border-t border-gray-100 ${contact.status === 'new' ? 'bg-blue-50' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="font-medium text-[#040404]">{contact.name}</div>
                          <div className="text-xs text-gray-500">{contact.email}</div>
                        </td>
                        <td className="px-5 py-4">{contact.subject}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={contact.status} type="message" />
                        </td>
                        <td className="px-5 py-4 text-gray-600">{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 flex-wrap">
                            <button type="button" onClick={() => setSelectedMessage(contact)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                              View
                            </button>
                            {contact.status === 'new' && (
                              <button type="button" onClick={() => handleMessageRead(contact.id)} className="rounded-lg bg-gray-600 px-3 py-2 text-xs font-semibold text-white">
                                Mark Read
                              </button>
                            )}
                            {contact.status !== 'resolved' && (
                              <button type="button" onClick={() => handleMessageResolve(contact.id)} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white">
                                Resolve
                              </button>
                            )}
                            <button type="button" onClick={() => handleMessageDelete(contact.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="text-lg font-semibold text-[#040404]">Message Details</h2>
              {selectedMessage ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">From</label>
                    <p className="text-sm font-medium text-[#040404]">{selectedMessage.name}</p>
                    <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Subject</label>
                    <p className="text-sm text-[#040404]">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Message</label>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <StatusBadge status={selectedMessage.status} type="message" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Date</label>
                    <p className="text-sm text-gray-600">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">Select a message from the table to view details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
