import axios from "axios";

// import { getItemFromStore } from "./utils";

export const API_BASE_URL = import.meta.env.VITE_BASENAME_API;
// const AUTH_TOKEN_KEY = "auth_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // const token = getItemFromStore(AUTH_TOKEN_KEY);

  // if (typeof token === "string" && token) {
  //   config.headers = config.headers ?? {};
  //   config.headers.Authorization = token;
  // }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiClient;
