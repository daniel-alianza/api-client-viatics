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
  Comprobacion,
  Document,
  ApiResponse,
} from '@/features/TravelExpense-Checks/interfaces/types';
import { solicitudesService } from '@/services/solicitudesService';
import type { Viatico } from '@/interfaces/applicationInterface';

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
  verifiedExpenses: PendingExpense[];
  comprobaciones: Comprobacion[];
  updateExpenseData: (data: Partial<ExpenseVerification>) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  loadPendingExpenses: () => Promise<void>;
  loadVerifiedExpenses: () => Promise<void>;
  loadComprobaciones: () => Promise<void>;
  error: string | null;
  approveComprobacion: (id: number, comment?: string) => Promise<void>;
  rejectComprobacion: (id: number, comment: string) => Promise<void>;
  getComprobacionDocuments: (id: number) => Promise<Document[]>;
  downloadDocument: (documentId: number) => Promise<void>;
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
  documentType: 'factura',
  files: [],
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [expenseData, setExpenseData] =
    useState<ExpenseVerification>(initialExpenseData);
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [verifiedExpenses, setVerifiedExpenses] = useState<PendingExpense[]>(
    [],
  );
  const [comprobaciones, setComprobaciones] = useState<Comprobacion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Cargar usuario desde sessionStorage al montar el componente
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');

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

  const loadPendingExpenses = useCallback(async () => {
    const email = userData?.email;
    if (!email) {
      setError('No hay datos del usuario disponibles');
      return;
    }

    try {
      setError(null);
      const response = await solicitudesService.getViaticosPorEmail(email);

      if (response.status === 'success' && Array.isArray(response.data)) {
        const formattedExpenses: PendingExpense[] = response.data.map(
          (viatico: Viatico) => ({
            id: String(viatico.id),
            description: viatico.travelReason || 'Sin descripción',
            date: viatico.departureDate
              ? new Date(viatico.departureDate).toLocaleDateString()
              : new Date().toLocaleDateString(),
            amount: Number(viatico.totalAmount) || 0,
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
    }
  }, [userData?.email]);

  // ✅ Este useEffect se ejecuta UNA VEZ cuando ya se tenga el email del usuario
  useEffect(() => {
    if (userData?.email) {
      loadPendingExpenses();
    }
  }, [userData?.email, loadPendingExpenses]);

  const loadVerifiedExpenses = useCallback(async () => {
    const email = userData?.email;
    if (!email) {
      setError('No hay datos del usuario disponibles');
      return;
    }

    try {
      setError(null);
      const response = await solicitudesService.getViaticosPorEmail(email);

      if (response.status === 'success' && Array.isArray(response.data)) {
        // Filtrar solo los viáticos verificados (status === 'comprobada')
        const verifiedViaticos = response.data.filter(
          (viatico: Viatico) => viatico.status === 'comprobada',
        );

        const formattedExpenses: PendingExpense[] = verifiedViaticos.map(
          (viatico: Viatico) => ({
            id: String(viatico.id),
            description: viatico.travelReason || 'Sin descripción',
            date: viatico.departureDate
              ? new Date(viatico.departureDate).toLocaleDateString()
              : new Date().toLocaleDateString(),
            amount: Number(viatico.totalAmount) || 0,
          }),
        );

        setVerifiedExpenses(formattedExpenses);
      } else {
        const errorMessage =
          response.message || 'Error al cargar los viáticos verificados';
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al cargar los viáticos verificados: ${errorMessage}`);
    }
  }, [userData?.email]);

  // Cargar las comprobaciones verificadas cuando tengamos el email del usuario
  useEffect(() => {
    if (userData?.email) {
      loadVerifiedExpenses();
    }
  }, [userData?.email, loadVerifiedExpenses]);

  const loadComprobaciones = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/comprobaciones');
      const data: ApiResponse<Comprobacion[]> = await response.json();

      if (data.status === 'success' && data.data) {
        setComprobaciones(data.data);
      } else {
        setError(data.message || 'Error al cargar las comprobaciones');
      }
    } catch (error) {
      setError('Error al cargar las comprobaciones');
      console.error('Error:', error);
    }
  }, []);

  // Cargar las comprobaciones al montar el componente
  useEffect(() => {
    loadComprobaciones();
  }, [loadComprobaciones]);

  const approveComprobacion = async (id: number, comment?: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/comprobaciones/${id}/status?approverId=${
          userData?.id
        }${comment ? `&comment=${encodeURIComponent(comment)}` : ''}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'aprobada',
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al aprobar la comprobación',
        );
      }

      await loadComprobaciones();
    } catch (error) {
      setError('Error al aprobar la comprobación');
      console.error('Error:', error);
    }
  };

  const rejectComprobacion = async (id: number, comment: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/comprobaciones/${id}/status?approverId=${
          userData?.id
        }&comment=${encodeURIComponent(comment)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'rechazada',
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al rechazar la comprobación',
        );
      }

      await loadComprobaciones();
    } catch (error) {
      setError('Error al rechazar la comprobación');
      console.error('Error:', error);
    }
  };

  const getComprobacionDocuments = async (id: number): Promise<Document[]> => {
    try {
      const response = await fetch(
        `http://localhost:4000/comprobaciones/${id}/documents`,
      );
      const data: ApiResponse<Document[]> = await response.json();

      if (data.status === 'success' && data.data) {
        return data.data;
      }
      throw new Error(data.message || 'Error al obtener los documentos');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const downloadDocument = async (documentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/comprobaciones/documents/${documentId}`,
      );

      if (!response.ok) {
        throw new Error('Error al descargar el documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento-${documentId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Error al descargar el documento');
      console.error('Error:', error);
    }
  };

  const submitForm = async () => {
    if (!userData) {
      setError('No hay datos del usuario disponibles');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('comprobacionId', expenseData.requestNumber);
      formData.append('type', expenseData.documentType);
      formData.append('description', expenseData.description);
      formData.append('responsable', userData.name);
      formData.append('motivo', expenseData.description);
      formData.append('descripcion', expenseData.description);
      formData.append('importe', expenseData.totalToVerify.toString());
      formData.append('userId', userData.id.toString());

      expenseData.files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(
        'http://localhost:4000/comprobaciones/upload',
        {
          method: 'POST',
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        resetForm();
        await loadComprobaciones();
      } else {
        throw new Error(data.message || 'Error al subir los documentos');
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Error al procesar la solicitud',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenseData,
        pendingExpenses,
        verifiedExpenses,
        comprobaciones,
        updateExpenseData,
        resetForm,
        submitForm,
        isSubmitting,
        loadPendingExpenses,
        loadVerifiedExpenses,
        loadComprobaciones,
        error,
        approveComprobacion,
        rejectComprobacion,
        getComprobacionDocuments,
        downloadDocument,
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
