const API_BASE_URL = "http://localhost:8080/api";

/* ================= AUTH HEADER ================= */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ================= RESPONSE HANDLER ================= */
let isRedirecting = false;

const handleResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    if (response.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    throw new Error(data.message || "Request failed");
  }

  return data;
};

/* ================= AUTH API ================= */
export const authAPI = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(res);

    if (data.success && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  logout: () => {
    localStorage.clear();
    window.location.replace("/login");
  },

  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  },

  isAuthenticated: () => Boolean(localStorage.getItem("token")),

  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  },
};

/* ================= ADMIN API ================= */
export const adminAPI = {
  getAllUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeader() });
    return handleResponse(res);
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/statistics`, { headers: getAuthHeader() });
    return handleResponse(res);
  },
  makeUserAdmin: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/make-admin`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
  revokeAdminAccess: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/revoke-admin`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
  deactivateUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/deactivate`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
  activateUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
      method: "PUT",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
  deleteUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
};

/* ================= JOB API ================= */
export const jobAPI = {
  getUserJobs: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/jobs/user/${userId}`, { headers: getAuthHeader() });
    return handleResponse(res);
  },
  getDashboardStats: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/jobs/user/${userId}/dashboard-stats`, {
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
  createJob: async (jobData) => {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },
  updateJob: async (jobId, jobData) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },
  deleteJob: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },
};
