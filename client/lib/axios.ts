import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:4040/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
        'Access-Control-Allow-Origin': 'http://localhost:3000', 
        'Access-Control-Allow-Credentials' : true,
      },
    withCredentials : false,
});

export default instance