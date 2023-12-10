import axios, { AxiosError } from "axios";
import { API_URL } from "../useApi/apiUrl";
import Swal from "sweetalert2";

// Next we make an 'instance' of it
const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      window.location.href = "/";
    }
    Swal.fire({
      icon: "error",
      text: error.message,
    });
  }
);

export { axiosClient };
