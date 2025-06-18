// import axios from 'axios';

// // Assumes your API base URL is configured in your environment variables,
// // otherwise, it defaults to localhost.
// const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// const adminApi = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Interceptor to add the auth token to every request to the admin API
// adminApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default adminApi;



import axios from 'axios';

// Assumes your API base URL is configured in your environment variables,
// otherwise, it defaults to localhost.
// This configuration is correct and does not need changes.
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to add the auth token to every request to the admin API.
// This logic is correct and essential for your protected routes.
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;