import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['token'] = token;
  } else {
    delete API.defaults.headers.common['token'];
  }
};

export default API;
