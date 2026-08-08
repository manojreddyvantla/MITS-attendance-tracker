import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // Clear old localStorage if any to avoid auto-login
    localStorage.removeItem('mits_token');
    return sessionStorage.getItem('mits_token') || null;
  });
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Session expired or invalid:", err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (rollNumber, password) => {
    const res = await axios.post('/api/auth/login', { rollNumber, password });
    if (res.data.success) {
      const newToken = res.data.token;
      setToken(newToken);
      sessionStorage.setItem('mits_token', newToken);
      localStorage.removeItem('mits_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (rollNumber, password, fullName, email) => {
    const res = await axios.post('/api/auth/register', { rollNumber, password, fullName, email });
    if (res.data.success) {
      const newToken = res.data.token;
      setToken(newToken);
      sessionStorage.setItem('mits_token', newToken);
      localStorage.removeItem('mits_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('mits_token');
    localStorage.removeItem('mits_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
