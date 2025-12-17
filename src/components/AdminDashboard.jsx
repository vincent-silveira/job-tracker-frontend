import { useState, useEffect } from "react";
import { adminAPI, authAPI } from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const currentAdmin = authAPI.getCurrentUser();
      if (!currentAdmin || !authAPI.isAdmin()) {
        window.location.href = "/login";
        return;
      }

      setAdmin(currentAdmin);

      const statsData = await adminAPI.getStatistics();
      const usersData = await adminAPI.getAllUsers();

      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Admin dashboard error:", error);
      authAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    await adminAPI.makeUserAdmin(userId);
    fetchAdminData();
  };

  const handleRevokeAdmin = async (userId) => {
    await adminAPI.revokeAdminAccess(userId);
    fetchAdminData();
  };

  const handleDeactivateUser = async (userId) => {
    await adminAPI.deactivateUser(userId);
    fetchAdminData();
  };

  const handleActivateUser = async (userId) => {
    await adminAPI.activateUser(userId);
    fetchAdminData();
  };

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await adminAPI.deleteUser(userId);
      fetchAdminData();
    }
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  /* ✅ Chart Data */
  const userStatusData = [
    { name: "Active Users", value: stats?.activeUsers || 0, color: "#10b981" },
    { name: "Inactive Users", value: stats?.inactiveUsers || 0, color: "#ef4444" }
  ];

  const roleData = [
    {
      name: "Users",
      value: (stats?.totalUsers || 0) - (stats?.adminUsers || 0)
    },
    { name: "Admins", value: stats?.adminUsers || 0 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <nav className="bg-purple-600 px-6 py-4 flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{admin?.name}</span>
          <button onClick={handleLogout} className="text-sm underline">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats?.totalUsers} />
          <StatCard label="Active Users" value={stats?.activeUsers} />
          <StatCard label="Inactive Users" value={stats?.inactiveUsers} />
          <StatCard label="Admins" value={stats?.adminUsers} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="User Activity">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={userStatusData} dataKey="value" label>
                  {userStatusData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Role Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Users Table */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="font-bold text-lg mb-4">User Management</h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Name</th>
          <th className="text-left py-3 px-4">Email</th>
          <th className="text-left py-3 px-4">Role</th>
          <th className="text-left py-3 px-4">Status</th>
          <th className="text-left py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b hover:bg-slate-50">
            <td className="py-3 px-4">{u.name}</td>
            <td className="py-3 px-4">{u.email}</td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                u.role === "ADMIN" 
                  ? "bg-purple-100 text-purple-700" 
                  : "bg-slate-100 text-slate-700"
              }`}>
                {u.role}
              </span>
            </td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                u.isActive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {u.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-2">
                {u.role === "ADMIN" ? (
                  <button 
                    onClick={() => handleRevokeAdmin(u.id)}
                    className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  >
                    Revoke Admin
                  </button>
                ) : (
                  <button 
                    onClick={() => handleMakeAdmin(u.id)}
                    className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                  >
                    Make Admin
                  </button>
                )}
                {u.isActive ? (
                  <button 
                    onClick={() => handleDeactivateUser(u.id)}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button 
                    onClick={() => handleActivateUser(u.id)}
                    className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Activate
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteUser(u.id)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
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
</div>
</div>
  );
}

/* Reusable components */
const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="font-bold mb-4">{title}</h3>
    {children}
  </div>
);

export default AdminDashboard;
