import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jobAPI, authAPI } from "../services/api";

function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser) {
        authAPI.logout();
        return;
      }
      setUser(currentUser);

      const statsData = await jobAPI.getDashboardStats(currentUser.id);
      const jobsData = await jobAPI.getUserJobs(currentUser.id);

      setStats(statsData);
      setJobs(jobsData.slice(0, 5)); // show recent 5 jobs
    } catch (err) {
      console.error("Dashboard error:", err);
      if (err.message.includes("Unauthorized")) {
        authAPI.logout();
      } else {
        showToast("error", err.message || "Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await jobAPI.deleteJob(jobId);
      showToast("success", "Application deleted successfully!");
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Delete job error:", err);
      showToast("error", err.message || "Failed to delete application");
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
            <span>{toast.message}</span>
            <button
              type="button"
              className="ml-2 text-white/80 hover:text-white"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Smart Job Tracker</h1>
              <p className="text-xs text-slate-500">User Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/add-job"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
            >
              + Add Job
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
            >
              Logout
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
          </h2>
          <p className="text-emerald-50">Track your job applications and land your dream job</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats?.totalJobs || 0}
            color="blue"
          />
          <StatCard
            title="Interviews Scheduled"
            value={stats?.statusCounts?.INTERVIEW || 0}
            color="amber"
          />
          <StatCard
            title="Offers Received"
            value={stats?.statusCounts?.OFFER || 0}
            color="emerald"
          />
          <StatCard
            title="Rejections"
            value={stats?.statusCounts?.REJECTED || 0}
            color="red"
          />
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
            <Link
              to="/add-job"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            >
              Add New →
            </Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-600">
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Position</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Applied On</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="py-3 font-medium text-slate-800">{job.company}</td>
                      <td className="py-3 text-slate-700">{job.position}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 text-sm">
                        {new Date(job.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 flex gap-2">
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Stats Card
function StatCard({ title, value, color }) {
  const colors = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-50 text-blue-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-600", badge: "bg-amber-50 text-amber-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600", badge: "bg-red-50 text-red-600" },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors[color].bg} rounded-xl flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${colors[color].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className={`text-xs font-semibold ${colors[color].badge} px-3 py-1 rounded-full`}>{title}</span>
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
}

// Helper: Empty State
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h4 className="text-lg font-semibold text-slate-700 mb-2">No applications yet</h4>
      <p className="text-slate-500 mb-4">Start tracking your job applications</p>
      <Link
        to="/add-job"
        className="inline-block px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
      >
        Add Your First Job
      </Link>
    </div>
  );
}

export default UserDashboard;
