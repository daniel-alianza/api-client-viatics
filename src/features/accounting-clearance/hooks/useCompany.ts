import { useAuth } from '@/context/AuthContext';

export const useCompany = () => {
  const { user } = useAuth();

  const company = user?.company?.name || 'Alianza Electrica'; // Fallback por defecto
  const companyId = user?.company?.id;

  return {
    company,
    companyId,
    userCompany: user?.company,
  };
};
