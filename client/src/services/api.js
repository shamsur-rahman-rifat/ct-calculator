import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9090/api/',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['token'] = token;
  } else {
    delete API.defaults.headers.common['token'];
  }
};

export default API;
