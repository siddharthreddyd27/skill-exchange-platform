import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const profile = await userService.getMyProfile();
          setUser((prev) => ({ ...prev, ...profile }));
          localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    const data = await authService.login(usernameOrEmail, password);
    localStorage.setItem('token', data.token);
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      role: data.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    localStorage.setItem('token', data.token);
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      role: data.role,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
