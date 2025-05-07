/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { getUserData } from '@/services/requestService';

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

const SolicitudContext = createContext<SolicitudContextProps | undefined>(
  undefined,
);

export const SolicitudProvider: React.FC = ({ children }) => {
  const [userRequestData, setUserRequestData] =
    useState<UserRequestData | null>(null);

  const fetchUserRequestData = () => {
    const userData = getUserData();
    // console.log('User data fetched from getUserData:', userData); // Debug log
    if (userData) {
      const requestData = {
        companyName: userData.company?.name || 'N/A',
        branchName: userData.branch?.name || 'N/A',
        areaName: userData.area?.name || 'N/A',
        cardNumber: userData.cards?.[0]?.cardNumber || 'N/A',
      };
      // console.log('Request data being set in context:', requestData); // Debug log
      setUserRequestData(requestData);
    }
  };

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
