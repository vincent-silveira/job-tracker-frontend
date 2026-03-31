import { Link, Navigate, useNavigate } from "react-router-dom";

function Dashboard() {
   const navigate = useNavigate(); // ✅ ADD THIS

   const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  return <Navigate to="/login" replace />;
}

const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/login");
};

const { username, userId } = user;
 
  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">
            Smart Job Tracker
          </h1>

          <button
            onClick={handleLogout}
            className="text-slate-600 hover:text-emerald-600 font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Dashboard
        </h2>

        {/* USER INFO CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-slate-700 mb-6">
            User Information
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Username</p>
              <p className="text-lg font-medium text-slate-800">
                {username}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">User ID</p>
              <p className="text-lg font-medium text-slate-800">
                {userId}
              </p>
            </div>
          </div>
        </div>

        {/* PLACEHOLDER SECTION */}
        <div className="mt-10 bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-700">
          <p className="font-medium">
            🚧 This is a temporary dashboard.
          </p>
          <p className="text-sm mt-1">
            Job applications, analytics, and tracking features will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
