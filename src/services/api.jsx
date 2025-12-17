const API_BASE_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Only redirect to login if unauthorized AND not already on login/register page
    if (response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    // Throw the error data (which includes validation errors)
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// ===== AUTH =====
export const authAPI = {
  login: async (credentials, isAdmin = false) => {
    const endpoint = isAdmin
      ? `${API_BASE_URL}/admin/login`
      : `${API_BASE_URL}/users/login`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(res);

    // Store token and user if successful
    if (data.token && data.user) {
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

  adminLogin: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(res);
    
    // Store token and user if successful
    if (data.success && data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
  },

  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");
  },
};

// ===== JOB =====
export const jobAPI = {
  getUserJobs: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/jobs/user/${userId}`, {
      headers: getAuthHeader(),
    });
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
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(jobData),
    });
    return handleResponse(res);
  },

  updateJob: async (jobId, jobData) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
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

// ===== ADMIN =====
export const adminAPI = {
  getAllUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeader(),
    });
    return handleResponse(res);
  },

  getStatistics: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/statistics`, {
      headers: getAuthHeader(),
    });
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

export default { auth: authAPI, job: jobAPI, admin: adminAPI };