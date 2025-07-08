import { createContext, useContext, ReactNode } from 'react';
import { AccountingClearanceState } from '../interfaces';

interface AccountingClearanceContextType extends AccountingClearanceState {
  refreshComprobaciones: () => Promise<void>;
}

const AccountingClearanceContext = createContext<
  AccountingClearanceContextType | undefined
>(undefined);

export const useAccountingClearance = () => {
  const context = useContext(AccountingClearanceContext);
  if (!context) {
    throw new Error(
      'useAccountingClearance debe ser usado dentro de un AccountingClearanceProvider',
    );
  }
  return context;
};

interface AccountingClearanceProviderProps {
  children: ReactNode;
  value: AccountingClearanceContextType;
}

export const AccountingClearanceProvider = ({
  children,
  value,
}: AccountingClearanceProviderProps) => {
  return (
    <AccountingClearanceContext.Provider value={value}>
      {children}
    </AccountingClearanceContext.Provider>
  );
};
