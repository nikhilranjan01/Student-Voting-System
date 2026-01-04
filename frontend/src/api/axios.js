import axios from "axios";

const api = axios.create({
  baseURL: "https://voting-system-zcs7.onrender.com",
  withCredentials: true,
});

export default api;
