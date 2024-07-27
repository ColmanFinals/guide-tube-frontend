
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { generateOauth2Token } from "./guideService";

interface RetryableRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

export const youtubeAPI: AxiosInstance = axios.create({
    baseURL: 'https://youtube.googleapis.com',
});

youtubeAPI.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest: RetryableRequestConfig = error.config || {};
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            console.log(error.response)
            try {
                const googleOauth2AccessToken = await generateOauth2Token();
                localStorage.setItem('googleOauth2AccessToken', googleOauth2AccessToken);

                // Update the original request headers with the new access token
                if (originalRequest.headers != null) {
                    originalRequest.headers.authorization = `Bearer ${googleOauth2AccessToken}`;

                    // Retry the original request with the new access token
                    return youtubeAPI(originalRequest);
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError);
            }
        }
        // If the error is not due to an expired access token, handle it normally
        return Promise.reject(error);
    }
);