import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();

    // If 401 and not already retried
    const isExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED";
    const isLoginRequest = originalRequest.url.includes("/auth/login");

    if (
      (error.response?.status === 401 || isExpired) &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      originalRequest._retry = true;

      if (refreshToken) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = res.data.data;

          setAccessToken(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Clients Service
export const clientService = {
  getAll: () => api.get("/clients"),
  create: (data) => api.post("/clients", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Products Service
export const productService = {
  getAll: () => api.get("/products"),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Templates Service
export const templateService = {
  getAll: () => api.get("/templates"),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  uploadLogo: (formData) =>
    api.post("/templates/upload-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// Invoices Service
export const invoiceService = {
  getAll: () => api.get("/invoices"),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  updateStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  sendEmail: (id, formData) =>
    api.post(`/invoices/${id}/send`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAuditLogs: (id) => api.get(`/invoices/${id}/audit`),
};

// Auth Service
export const authService = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
};

// User Service
export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadLogo: (formData) =>
    api.post("/users/upload-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
