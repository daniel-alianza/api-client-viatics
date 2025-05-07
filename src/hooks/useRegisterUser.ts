/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { registerUser } from '@/services/authService';

interface UseRegisterUserProps {
  selectedCompany: string;
  selectedBranch: string;
  selectedArea: string;
  selectedManager: string;
  resetSelections: () => void;
}

export const useRegisterUser = ({
  selectedCompany,
  selectedBranch,
  selectedArea,
  selectedManager,
  resetSelections,
}: UseRegisterUserProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        companyId: selectedCompany ? parseInt(selectedCompany) : undefined,
        branchId: selectedBranch ? parseInt(selectedBranch) : undefined,
        areaId: selectedArea ? parseInt(selectedArea) : undefined,
        managerId: selectedManager ? parseInt(selectedManager) : undefined,
      });

      setSuccess('Usuario registrado exitosamente');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      resetSelections();
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit,
  };
};
