import axios from "axios";
const Api = axios.create({
    baseURL: import.meta.env.VITE_BACKURL,
  })
  Api.interceptors.request.use(config => {
    const token = window.localStorage.getItem(import.meta.env.VITE_TOKENSTORAGENAME);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  })
export default Api;