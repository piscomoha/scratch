import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  const signup = async (name, email, password, passwordConfirm, role) => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
        role,
      });
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role, user: data.user };
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      return { success: false, message, errors };
    }
  };

  const updateProfile = async (payload) => {
    try {
      const isMultipart = payload instanceof FormData;
      const { data } = isMultipart
        ? await api.post('/auth/profile', payload)
        : await api.put('/auth/profile', payload);
      setUser(data.user);
      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      return { success: false, message, errors };
    }
  };

  const updatePassword = async (payload) => {
    try {
      const { data } = await api.put('/auth/password', payload);
      return { success: true, message: data.message };
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe';
      return { success: false, message, errors };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setToken(null);
      setUser(null);
      toast.success('Déconnecté avec succès');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, updateProfile, updatePassword, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
