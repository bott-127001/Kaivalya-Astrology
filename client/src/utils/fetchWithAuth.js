import useAuth from '../store/auth';

const fetchWithAuth = async (url, options = {}) => {
  const token = useAuth.getState().token;

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    useAuth.getState().logout();
    // You might want to redirect to the login page here
    // window.location.href = '/login';
  }

  return response;
};

export default fetchWithAuth;
