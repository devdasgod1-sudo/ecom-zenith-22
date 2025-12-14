import axios, { AxiosHeaders } from "axios";

const remote = {
    address: "http://127.0.0.1:8000/api/", // Update this with your backend URL
};

const api = axios.create({
    baseURL: remote.address,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (refreshToken) {
                    const response = await axios.post(`${remote.address}accounts/token/refresh/`, {
                        refresh: refreshToken
                    });
                    const newAccessToken = response.data.access;
                    localStorage.setItem("access_token", newAccessToken);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                // Handle refresh token failure (e.g., logout user)
                console.error("Session expired", err);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

const getRequest = async (endpoint: string) =>
    api.get(endpoint).then(res => res);

const postRequest = async (endpoint: string, data: any, config?: any) =>
    api.post(endpoint, data, config).then(res => res);

const patchRequest = async (endpoint: string, data: any, config?: any) =>
    api.patch(endpoint, data, config).then(res => res);

const deleteRequest = async (endpoint: string) =>
    api.delete(endpoint).then(res => res);

const AdminService = {
    Login: (data: { email: string; password: string }) =>
        postRequest(`accounts/admin/login/`, data).then(res => {
            const { access_token, refresh_token } = res.data;

            const token = access_token;
            if (token) {
                localStorage.setItem("access_token", token);
                if (refresh_token) {
                    localStorage.setItem("refresh_token", refresh_token);
                }
            }
            return res.data;
        }),

    // Category CRUD Operations
    CategoryCreate: (data: FormData) =>
        postRequest(`collections/categories/`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => res.data),

    CategoryList: () =>
        getRequest(`collections/categories/`).then(res => res.data),

    CategoryUpdate: (id: string, data: FormData) =>
        patchRequest(`collections/categories/${id}/`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(res => res.data),

    CategoryDelete: (id: string) =>
        deleteRequest(`collections/categories/${id}/`).then(res => res.data),
};

export { api };
export default AdminService;
