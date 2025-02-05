import axios from "axios";
import Cookies from "js-cookie";

const localApi = "http://localhost:4040/api/v1/"
const mainApi = "https://perfit-erp.onrender.com/api/v1/"

const instance = axios.create({
  baseURL: localApi,
});


instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
