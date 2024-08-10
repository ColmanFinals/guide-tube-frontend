import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig,} from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER + "/",
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
            config.headers = config.headers || {} as AxiosRequestHeaders;
            (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${accessToken} ${refreshToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest: RetryableRequestConfig = error.config || {};
        // If the error is due to an expired access token
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                // Refresh the access token using your refresh token

                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await api.post(
                    import.meta.env.VITE_SERVER_GET_REFRESH_TOKEN,
                    null,
                    {
                        headers: {
                            authorization: `Bearer ${accessToken} ${refreshToken}`,
                        },
                    }
                );
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('accessToken', response.data.refreshToken)
                console.log(response.data.accessToken);
                console.log(response.data.refreshToken);


                // Update the original request headers with the new access token
                if (originalRequest.headers != null) {
                    originalRequest.headers.authorization = `Bearer ${response.data.accessToken} ${response.data.refreshToken}`;

                    // Retry the original request with the new access token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        // If the error is not due to an expired access token, handle it normally
        return Promise.reject(error);
    }
);

export const fetchMyCompanies = async () => {
    const response = await api.get('/company/fetchMyCompanies');
    return response.data;
};

export const getCompanyById = async (companyId: string) => {
    const response = await api.get(`/company/getCompanyById/${companyId}`);
    return response.data;
};

// export const addAdmin = async (companyId: string, userId: string) => {
//     const response = await api.put(`/company/add-admin`, { companyId, adminId: userId });
//     return response.data;
// };

// export const removeAdmin = async (companyId: string, userId: string) => {
//     const response = await api.put(`/company/remove-admin`, { companyId, adminId: userId });
//     return response.data;
// };

export const removeUser = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/removeUser`, { companyId, userId });
    return response.data;
};

export const addUser = async (companyId: string, userId: string) => {
    const response = await api.put(`/company/addUser`, { companyId, userId });
    return response.data;
};

export const fetchAllUsers = async () => {
    const response = await api.get('/user/fetch');
    return response.data;
};

export default api;