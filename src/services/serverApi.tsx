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
                console.error("Error refreshing token:", refreshError);
            }
        }
        // If the error is not due to an expired access token, handle it normally
        return Promise.reject(error);
    }
);

export default api;
