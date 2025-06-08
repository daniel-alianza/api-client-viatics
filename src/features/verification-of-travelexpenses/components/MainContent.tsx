import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { solicitudesService } from '@/services/solicitudesService';
import MovimientosAccordion from './MovimientosAccordion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovementsByDateRange } from '@/services/movementsService';

interface User {
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

interface TravelExpense {
  id: string;
  fechaAutorizacion: string;
  solicitante: string;
  compania: string;
  cantidadSolicitada: number;
  tarjeta: string;
  fechaSalida: string;
  fechaRegreso: string;
  totalExtractos: number | string;
  faltantes: number | string;
  comprobados: number | string;
  diasRestantes: number | string;
  noSolicitud: string;
  sociedad: string;
  accountCode: string;
}

// Función para mapear tarjeta a accountCode
const getAccountCodeByCard = (cardNumber: string | undefined) => {
  if (!cardNumber) return '';
  // Mapea aquí tus tarjetas a accountCode
  if (cardNumber === '5161020004515435') return '1120-015-000';
  // Agrega más mapeos si tienes más tarjetas
  return '';
};

export default function MainContent() {
  const [travelExpenses, setTravelExpenses] = useState<TravelExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [errorMovimientos, setErrorMovimientos] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleRowClick = (id: string) => {
    if (selectedRowId === id) {
      setIsAccordionOpen(false);
      setSelectedRowId(null);
    } else {
      setSelectedRowId(id);
      setIsAccordionOpen(true);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return dateString.split('T')[0];
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/-/g, '');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('user');

        if (!userData) {
          setLoading(false);
          return;
        }

        const user: User = JSON.parse(userData);

        const viaticosResponse = await solicitudesService.getViaticosPorEmail(
          user.email,
        );

        if (viaticosResponse.status === 'success' && viaticosResponse.data) {
          const expensesWithExtractos = viaticosResponse.data.map(viatico => {
            const userCard = user.cards?.[0]?.cardNumber;
            const accountCode =
              viatico.accountCode || getAccountCodeByCard(userCard);
            return {
              id: viatico.id.toString(),
              fechaAutorizacion: formatDate(viatico.disbursementDate),
              solicitante: viatico.user.email,
              compania: viatico.user.company.name,
              cantidadSolicitada: viatico.totalAmount,
              tarjeta: userCard ? formatCardNumber(userCard) : '-',
              fechaSalida: formatDate(viatico.departureDate),
              fechaRegreso: formatDate(viatico.returnDate),
              totalExtractos: viatico.totalExtractos ?? 0,
              faltantes: viatico.faltantes ?? 0,
              comprobados: viatico.comprobados ?? 0,
              diasRestantes: viatico.daysRemaining ?? 0,
              noSolicitud: viatico.id.toString(),
              sociedad: viatico.user.company.name,
              accountCode,
            };
          });

          setTravelExpenses(expensesWithExtractos);
        } else {
          setTravelExpenses([]);
        }
      } catch (error) {
        setTravelExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hook para obtener movimientos del viático seleccionado
  const { isLoading: loadingMovimientos, error: movimientosError } = useQuery({
    queryKey: ['movimientos', selectedRowId],
    queryFn: async () => {
      if (!selectedRowId) return null;

      const selectedExpense = travelExpenses.find(
        expense => expense.id === selectedRowId,
      );
      if (!selectedExpense) return null;

      const response = await getMovementsByDateRange({
        accountCode: selectedExpense.accountCode,
        cardNumber: formatCardNumber(selectedExpense.tarjeta),
        startDate: new Date(selectedExpense.fechaSalida),
        endDate: new Date(selectedExpense.fechaRegreso),
      });

      return response;
    },
    enabled: !!selectedRowId && travelExpenses.length > 0,
    retry: false,
  });

  // Mostrar errores de la query en el estado local para mantener compatibilidad
  useEffect(() => {
    if (movimientosError) {
      setErrorMovimientos(movimientosError.message);
    }
  }, [movimientosError]);

  // Nueva función para refrescar movimientos usando React Query
  const refreshMovimientos = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['movimientos', selectedRowId],
    });
  };

  return (
    <div className='px-8 py-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          overflowX: 'auto',
        }}
      >
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#02082C] text-white'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                ID
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Fecha Autorización
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Solicitante
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Compañía
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Cantidad Solicitada
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Tarjeta
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Fecha Salida
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Fecha Regreso
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Días Restantes
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={9} className='px-6 py-4 text-center'>
                  Cargando datos...
                </td>
              </tr>
            ) : travelExpenses.length === 0 ? (
              <tr>
                <td colSpan={9} className='px-6 py-4 text-center'>
                  Aún no hay movimientos
                </td>
              </tr>
            ) : (
              travelExpenses.map(expense => (
                <React.Fragment key={expense.id}>
                  <tr
                    onClick={() => handleRowClick(expense.id)}
                    className='hover:bg-[#F34602]/5 cursor-pointer transition-colors duration-200'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-[#02082C]'>
                      {expense.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.fechaAutorizacion}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.solicitante}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.compania}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#F34602] font-medium'>
                      ${expense.cantidadSolicitada.toFixed(2)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.tarjeta}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.fechaSalida}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.fechaRegreso}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.diasRestantes}
                    </td>
                  </tr>
                  {selectedRowId === expense.id && (
                    <tr>
                      <td colSpan={9} className='px-6 py-4'>
                        {loadingMovimientos ? (
                          <div className='text-center py-4'>
                            <p className='text-gray-600'>
                              Cargando movimientos...
                            </p>
                          </div>
                        ) : errorMovimientos ? (
                          <div className='text-center py-4'>
                            <p className='text-red-600'>{errorMovimientos}</p>
                          </div>
                        ) : (
                          <MovimientosAccordion
                            isOpen={isAccordionOpen}
                            onToggle={() =>
                              setIsAccordionOpen(!isAccordionOpen)
                            }
                            noSolicitud={expense.noSolicitud}
                            sociedad={expense.sociedad}
                            onComprobacionExitosa={refreshMovimientos}
                            accountCode={expense.accountCode}
                            cardNumber={formatCardNumber(expense.tarjeta)}
                            startDate={new Date(expense.fechaSalida)}
                            endDate={new Date(expense.fechaRegreso)}
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
