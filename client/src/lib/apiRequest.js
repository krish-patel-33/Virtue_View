import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add a request interceptor to handle token
apiRequest.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiRequest;

export const getAdminStats = async () => {
  const response = await apiRequest.get('/admin/stats');
  return response.data;
};

export const getAdminBookings = async () => {
  const response = await apiRequest.get('/admin/bookings');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await apiRequest.get('/admin/users');
  return response.data;
};

export const updateAdminUser = async (userId, payload) => {
  const response = await apiRequest.put(`/admin/users/${userId}`, payload);
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await apiRequest.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminProperties = async () => {
  const response = await apiRequest.get('/admin/properties');
  return response.data;
};

export const updateAdminProperty = async (propertyId, payload) => {
  const response = await apiRequest.put(`/admin/properties/${propertyId}`, payload);
  return response.data;
};

export const deleteAdminProperty = async (propertyId) => {
  const response = await apiRequest.delete(`/admin/properties/${propertyId}`);
  return response.data;
};

// Contact Messages
export const getContactMessages = async () => {
  const response = await apiRequest.get('/admin/contacts');
  return response.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await apiRequest.put(`/admin/contacts/${messageId}/read`);
  return response.data;
};

export const resolveMessage = async (messageId) => {
  const response = await apiRequest.put(`/admin/contacts/${messageId}/resolve`);
  return response.data;
};

export const deleteContactMessage = async (messageId) => {
  const response = await apiRequest.delete(`/admin/contacts/${messageId}`);
  return response.data;
};

// User Suspension
export const suspendUser = async (userId, reason) => {
  const response = await apiRequest.post(`/admin/users/${userId}/suspend`, { reason });
  return response.data;
};

export const activateUser = async (userId) => {
  const response = await apiRequest.post(`/admin/users/${userId}/activate`);
  return response.data;
};

// Property Approval
export const approveProperty = async (propertyId) => {
  const response = await apiRequest.post(`/admin/properties/${propertyId}/approve`);
  return response.data;
};

export const rejectProperty = async (propertyId, reason) => {
  const response = await apiRequest.post(`/admin/properties/${propertyId}/reject`, { reason });
  return response.data;
};
