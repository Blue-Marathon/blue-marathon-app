/* eslint-disable no-undef */
import { toast } from 'react-toastify';
import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  timeout: 200000,
});

// interceptops
instance.interceptors.response.use(null, error => {
  if (error.response.message) { // no session
    toast.error(error.response.message);
    return Promise.reject(error);
  }
});

// default methods
const downloadFile = async (url, mimetype) => {
  try {
    const response = await instance.get(url, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: mimetype });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const post = (url, payload) => instance.post(url, payload);
const get = url => instance.get(url);

// list translation models
const getLanguages = () => get('/api/talk/languages');

export default {
  downloadFile,
  post,
  get,
  getLanguages
};
