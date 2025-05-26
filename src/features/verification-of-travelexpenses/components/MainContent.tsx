import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { solicitudesService } from '@/services/solicitudesService';
import { getMovements } from '@/services/extractosService';
import {
  getMovimientosByViatico,
  Movimiento,
} from '@/services/movimientosService';
import MovimientosAccordion from './MovimientosAccordion';

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
}

export default function MainContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [travelExpenses, setTravelExpenses] = useState<TravelExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [errorMovimientos, setErrorMovimientos] = useState<string | null>(null);

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
        // Obtener los datos del usuario desde localStorage
        const userData = localStorage.getItem('user');

        if (!userData) {
          console.error('No se encontraron datos del usuario en localStorage');
          setLoading(false);
          return;
        }

        const user: User = JSON.parse(userData);
        console.log('Datos del usuario:', user);

        // Obtener viáticos
        const viaticosResponse = await solicitudesService.getViaticosPorEmail(
          user.email,
        );
        console.log('Respuesta de viáticos:', viaticosResponse);

        if (viaticosResponse.status === 'success' && viaticosResponse.data) {
          // Para cada viático, obtener la información de extractos
          const expensesWithExtractos = await Promise.all(
            viaticosResponse.data.map(async viatico => {
              try {
                // Verificar si el usuario tiene tarjetas
                const userCard = user.cards?.[0]?.cardNumber;
                let extractosData = {
                  totalExtractos: '-' as string | number,
                  faltantes: '-' as string | number,
                  comprobados: '-' as string | number,
                  diasRestantes: '-' as string | number,
                };

                if (userCard) {
                  const extractosResponse = await getMovements(
                    formatCardNumber(userCard),
                    viatico.departureDate,
                    viatico.returnDate,
                  );
                  console.log(
                    'Respuesta de extractos para viático',
                    viatico.id,
                    ':',
                    extractosResponse,
                  );

                  if (extractosResponse?.data) {
                    extractosData = {
                      totalExtractos:
                        extractosResponse.data.TotalExtractos ?? '-',
                      faltantes:
                        extractosResponse.data.TotalComprobacionesFaltantes ??
                        '-',
                      comprobados:
                        extractosResponse.data.TotalComprobacionesRealizadas ??
                        '-',
                      diasRestantes:
                        extractosResponse.data.DiasRestantesParaComprobar ??
                        '-',
                    };
                  }
                }

                return {
                  id: viatico.id.toString(),
                  fechaAutorizacion: formatDate(viatico.disbursementDate),
                  solicitante: viatico.user.email,
                  compania: viatico.user.company.name,
                  cantidadSolicitada: viatico.totalAmount,
                  tarjeta: userCard ? formatCardNumber(userCard) : '-',
                  fechaSalida: formatDate(viatico.departureDate),
                  fechaRegreso: formatDate(viatico.returnDate),
                  ...extractosData,
                  noSolicitud: viatico.id.toString(),
                  sociedad: viatico.user.company.name,
                };
              } catch (error) {
                console.error(
                  'Error al obtener extractos para viático',
                  viatico.id,
                  ':',
                  error,
                );
                return {
                  id: viatico.id.toString(),
                  fechaAutorizacion: formatDate(viatico.disbursementDate),
                  solicitante: viatico.user.email,
                  compania: viatico.user.company.name,
                  cantidadSolicitada: viatico.totalAmount,
                  tarjeta: userCard ? formatCardNumber(userCard) : '-',
                  fechaSalida: formatDate(viatico.departureDate),
                  fechaRegreso: formatDate(viatico.returnDate),
                  totalExtractos: '-',
                  faltantes: '-',
                  comprobados: '-',
                  diasRestantes: '-',
                  noSolicitud: viatico.id.toString(),
                  sociedad: viatico.user.company.name,
                };
              }
            }),
          );

          console.log('Datos procesados:', expensesWithExtractos);
          setTravelExpenses(expensesWithExtractos);
        } else {
          console.warn('No se encontraron viáticos para el usuario');
          setTravelExpenses([]);
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setTravelExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredExpenses = travelExpenses.filter(expense =>
    expense.solicitante.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRowClick = async (id: string) => {
    if (selectedRowId === id) {
      // Si ya está seleccionada la misma fila, cerrar el acordeón y limpiar selección
      setIsAccordionOpen(false);
      setSelectedRowId(null);
      return;
    }

    // Si es una fila diferente, cargar nuevos datos
    setSelectedRowId(id);
    setIsAccordionOpen(true);
    setLoadingMovimientos(true);
    setErrorMovimientos(null);

    try {
      // Obtener los datos del usuario desde localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setErrorMovimientos('No se encontraron datos del usuario');
        return;
      }

      const user: User = JSON.parse(userData);
      const userCard = user.cards?.[0]?.cardNumber;

      if (!userCard) {
        setErrorMovimientos('No se encontró una tarjeta asociada al usuario');
        return;
      }

      // Encontrar el viático seleccionado
      const selectedExpense = travelExpenses.find(expense => expense.id === id);
      if (!selectedExpense) {
        setErrorMovimientos('No se encontró el viático seleccionado');
        return;
      }

      const response = await getMovimientosByViatico(
        userCard,
        selectedExpense.fechaSalida,
        selectedExpense.fechaRegreso,
      );

      if (response.status === 'success' && response.data) {
        if (response.data.length === 0) {
          setErrorMovimientos('No hay movimientos aún para este viático');
        } else {
          setMovimientos(response.data);
        }
      } else {
        setErrorMovimientos(
          response.message === 'El viático no existe'
            ? 'No hay movimientos aún para este viático'
            : response.message || 'Error al cargar los movimientos',
        );
      }
    } catch (error) {
      console.error('Error al cargar los movimientos:', error);
      setErrorMovimientos('Error al cargar los movimientos');
    } finally {
      setLoadingMovimientos(false);
    }
  };

  return (
    <div className='px-8 py-6'>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar por nombre del solicitante...'
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F34602]/50'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
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
                Total Extractos
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Faltantes
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
              >
                Comprobados
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
                <td colSpan={12} className='px-6 py-4 text-center'>
                  Cargando datos...
                </td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={12} className='px-6 py-4 text-center'>
                  Aún no hay movimientos
                </td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <>
                  <tr
                    key={expense.id}
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
                      {expense.totalExtractos}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#F34602]'>
                      {expense.faltantes}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.comprobados}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {expense.diasRestantes}
                    </td>
                  </tr>
                  {selectedRowId === expense.id && (
                    <tr>
                      <td colSpan={12} className='px-6 py-4'>
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
                            movimientos={movimientos}
                            isOpen={isAccordionOpen}
                            onToggle={() =>
                              setIsAccordionOpen(!isAccordionOpen)
                            }
                            noSolicitud={expense.noSolicitud}
                            sociedad={expense.sociedad}
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
