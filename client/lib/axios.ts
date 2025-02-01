import axios from "axios";

const localApi = "http://localhost:4040/api/v1/"
const mainApi = "https://perfit-erp.onrender.com/api/v1/"

const instance = axios.create({
  baseURL: localApi,
  withCredentials: true,
});

export default instance;
