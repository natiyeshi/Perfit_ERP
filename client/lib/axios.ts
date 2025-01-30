import axios from "axios";

const mainApi = "https://perfit-erp.onrender.com/api/v1/"
const localApi = "http://localhost:4040/api/v1/"

const instance = axios.create({
  baseURL: mainApi,
  // headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
  //     'Access-Control-Allow-Origin': 'http://localhost:3000',
  //     'Access-Control-Allow-Credentials' : true,
  //   },
  withCredentials: true,
});

export default instance;
