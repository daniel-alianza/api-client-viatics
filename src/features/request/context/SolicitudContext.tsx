/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useAuth } from '@/context/AuthContext';

interface UserRequestData {
  companyName: string;
  branchName: string;
  areaName: string;
  cardNumber: string;
}

interface SolicitudContextProps {
  userRequestData: UserRequestData | null;
  fetchUserRequestData: () => void;
}

interface SolicitudProviderProps {
  children: ReactNode;
}

const SolicitudContext = createContext<SolicitudContextProps | undefined>(
  undefined,
);

export const SolicitudProvider: React.FC<SolicitudProviderProps> = ({
  children,
}) => {
  const [userRequestData, setUserRequestData] =
    useState<UserRequestData | null>(null);
  const { user } = useAuth();

  const fetchUserRequestData = () => {
    if (user) {
      const requestData = {
        companyName: user.company?.name || 'N/A',
        branchName: user.branch?.name || 'N/A',
        areaName: user.area?.name || 'N/A',
        cardNumber: user.cards?.[0]?.cardNumber || 'N/A',
      };
      setUserRequestData(requestData);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRequestData();
    }
  }, [user]);

  return (
    <SolicitudContext.Provider
      value={{ userRequestData, fetchUserRequestData }}
    >
      {children}
    </SolicitudContext.Provider>
  );
};

export const useSolicitudContext = () => {
  const context = useContext(SolicitudContext);
  if (!context) {
    throw new Error(
      'useSolicitudContext must be used within a SolicitudProvider',
    );
  }
  return context;
};
