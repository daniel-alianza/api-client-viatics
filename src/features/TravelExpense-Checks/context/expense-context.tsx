import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type {
  ExpenseVerification,
  PendingExpense,
} from '@/features/TravelExpense-Checks/interfaces/types';
import {
  solicitudesService,
  type Viatico,
} from '@/services/solicitudesService';

interface UserData {
  id: number;
  name: string;
  email: string;
  companyId: number;
  branchId: number;
  areaId: number;
  roleId: number;
  managerId: number;
  company: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
    companyId: number;
  };
  area: {
    id: number;
    name: string;
    branchId: number;
  };
  role: {
    id: number;
    name: string;
  };
  cards: Array<{
    id: number;
    cardNumber: string;
    userId: number;
    isActive: boolean;
    assignedAt: string;
    limite: string;
  }>;
}

interface ExpenseContextType {
  expenseData: ExpenseVerification;
  pendingExpenses: PendingExpense[];
  updateExpenseData: (data: Partial<ExpenseVerification>) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  loadPendingExpenses: () => Promise<void>;
  error: string | null;
}

const initialExpenseData: ExpenseVerification = {
  requestNumber: '',
  company: '',
  bank: '',
  transactionNumber: '',
  date: '',
  card: '',
  initialExpense: 0,
  description: '',
  totalToVerify: 0,
  documentType: 'invoice',
  files: [],
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenseData, setExpenseData] =
    useState<ExpenseVerification>(initialExpenseData);
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');

    if (!storedUserData) {
      setError('No se encontraron datos del usuario');
      return;
    }

    try {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
      setError('Error al cargar los datos del usuario');
    }
  }, []);

  const updateExpenseData = (data: Partial<ExpenseVerification>) => {
    setExpenseData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setExpenseData(initialExpenseData);
  };

  // ⚠️ Importante: quitamos isLoading de las dependencias
  const loadPendingExpenses = useCallback(async () => {
    const email = userData?.email;
    if (!email) {
      setError('No hay datos del usuario disponibles');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await solicitudesService.getViaticosPorEmail(email);

      if (response.status === 'success' && Array.isArray(response.data)) {
        const formattedExpenses: PendingExpense[] = response.data.map(
          (viatico: Viatico) => ({
            id: String(viatico.IdViaticos ?? ''),
            description: viatico.MotivoSolicitud || 'Sin descripción',
            date: viatico.FechaSolicitud
              ? new Date(viatico.FechaSolicitud).toLocaleDateString()
              : new Date().toLocaleDateString(),
            amount: Number(viatico.CantidadTotal) || 0,
          }),
        );

        setPendingExpenses(formattedExpenses);
      } else {
        const errorMessage = response.message || 'Error al cargar los viáticos';
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al cargar los viáticos: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.email]); // ✅ quitamos isLoading

  // ✅ Este useEffect se ejecuta UNA VEZ cuando ya se tenga el email del usuario
  useEffect(() => {
    if (userData?.email) {
      loadPendingExpenses();
    }
  }, [userData?.email, loadPendingExpenses]);

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      // Simulación de envío a una API
      await new Promise(resolve => setTimeout(resolve, 1500));
      resetForm();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenseData,
        pendingExpenses,
        updateExpenseData,
        resetForm,
        submitForm,
        isSubmitting,
        loadPendingExpenses,
        error,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
