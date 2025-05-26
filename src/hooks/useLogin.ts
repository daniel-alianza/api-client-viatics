/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/authService';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('user', JSON.stringify(response)); // Save user data in localStorage
      navigate('/dashboard');
      return response; // Ensure user data is returned
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      console.error('Error during login:', err); // Debug log
      return undefined; // Explicitly return undefined on error
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError, // Added setError to the return object
    handleLogin,
  };
};
