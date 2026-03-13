import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';
const POLL_INTERVAL = 15_000; // 15 seconds

export function useStatus() {
  const { token, logout } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError('Cannot reach server');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchStatus]);

  return { status, loading, error, lastUpdated, refetch: fetchStatus };
}
