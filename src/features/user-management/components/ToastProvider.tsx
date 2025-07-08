import React, { createContext, useContext, useState } from 'react';

interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState extends Toast {
  id: number;
}

interface ToastContextType {
  toast: (toast: Toast) => void;
  toasts: ToastState[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = ({ title, description, variant = 'default' }: Toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error('useToastContext debe usarse dentro de ToastProvider');
  return context;
}
