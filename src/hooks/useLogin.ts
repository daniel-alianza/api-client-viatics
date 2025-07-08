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
      sessionStorage.setItem('user', JSON.stringify(response)); // Save user data in sessionStorage
      navigate('/dashboard');
      return response; // Ensure user data is returned
    } catch (err: any) {
      let friendlyMessage =
        'Error al iniciar sesión. Por favor, verifica tus credenciales o intenta más tarde.';
      if (err?.response?.data?.message) {
        // Si el backend manda un mensaje personalizado, lo usamos
        friendlyMessage = err.response.data.message;
      }
      setError(friendlyMessage);
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
