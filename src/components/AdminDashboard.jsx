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
          <h3 className="font-bold mb-4">User Management</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? "Active" : "Inactive"}</td>
                  <td className="space-x-2">
                    {u.role === "ADMIN" ? (
                      <button onClick={() => handleRevokeAdmin(u.id)}>Revoke</button>
                    ) : (
                      <button onClick={() => handleMakeAdmin(u.id)}>Make Admin</button>
                    )}
                    {u.isActive ? (
                      <button onClick={() => handleDeactivateUser(u.id)}>Deactivate</button>
                    ) : (
                      <button onClick={() => handleActivateUser(u.id)}>Activate</button>
                    )}
                    <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
