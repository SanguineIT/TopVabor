import axios from "axios";
import { baseURL } from "./Api";


axios.defaults.baseURL = baseURL;

const handleResponse = (response) => {
  if (response.status === 401) {
    window.location.href = "/admin/login";
    localStorage.removeItem("adminData")
  }
  return response;
};

const post = async (url, data) => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const token = adminData && adminData?.token ? adminData?.token : "";

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
};

const getAll = async (url) => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const token = adminData && adminData?.token ? adminData?.token : "";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
};

const getOne = async (url) => {
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const token = adminData && adminData?.token ? adminData?.token : "";

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    return handleResponse(error.response);
  }
};

const ApiService = { post, getAll, getOne };
export default ApiService;