import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sentinel_token'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      localStorage.setItem('sentinel_token', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Connection failed. Check backend URL.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sentinel_token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, error, loading, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
