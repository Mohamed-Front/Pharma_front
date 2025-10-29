import axios from 'axios';
import router from '@/router';
import { useAuthStore } from './stores/Auth';

axios.defaults.baseURL = import.meta.env.VITE_URI || 'http://localhost:8000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept-Language'] = localStorage.getItem('appLang') || 'en';

// Request interceptor
axios.interceptors.request.use((config) => {
  try {
    const currentRoute = router.currentRoute.value;
    console.log(currentRoute.path); // Logs /warehouse/anthername
    const authStore = useAuthStore();
    let token = null;

    // Determine the appropriate token based on the route
    if (currentRoute.path.startsWith('/admin')) {
      token = localStorage.getItem('admintoken');
    } else if (currentRoute.path.startsWith('/warehouse')) {
      token = localStorage.getItem('warehoustoken');
    } else if (currentRoute.path.startsWith('/')) {
      token = localStorage.getItem('pharmacytoken');
    }

    // Set Authorization header if token exists
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure headers are set for every request
    config.headers = config.headers || {};
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json';
    config.headers['local'] = localStorage.getItem('appLang') || 'en';
  } catch (error) {
    console.error('Request interceptor error:', error);
  }

  return config;
});

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    const currentRoute = router.currentRoute.value;

    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (currentRoute.path.startsWith('/admin')) {
       authStore.adminhandleLogout();
        router.push({ name: 'login' });
      } else if (currentRoute.path.startsWith('/')) {
        authStore.pharmacyhandleLogout();
        router.push({ name: 'login' });
      } else if (currentRoute.path.startsWith('/warehouse')) {;
        authStore.warehoushandleLogout();
        router.push({ name: 'login' });
      } else {

        router.push({ name: 'login' });
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      if (authStore.type === '1') {
        router.push({ name: 'dashboard' }); // Admin dashboard
      } else if (authStore.type === '2') {
        router.push({ name: 'warehouse_dashboard' }); // Warehouse dashboard
      } else if (authStore.type === '3') {
        router.push({ name: 'home' }); // Pharmacy home
      } else {
        router.push({ name: 'login' });
      }
    }

    // Enhanced error logging
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;
