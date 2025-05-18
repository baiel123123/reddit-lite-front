import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  withCredentials: true,  // Чтобы cookie с токеном передавались
});

export default api;
