import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  getMovimientosByViatico,
  Movimiento,
} from '../../../services/movimientosService';
import MovimientosAccordion from './MovimientosAccordion';

interface TravelExpenseDetail {
  noSolicitud: string;
  solicitante: string;
  sociedad: string;
  sucursal: string;
  area: string;
  numeroTarjeta: string;
  fechaSalida: string;
  fechaRegreso: string;
  detalles: {
    transporte: number;
    casetas: number;
    hospedaje: number;
    alimentos: number;
    fletes: number;
    herramientas: number;
    mensajeria: number;
    diversos: number;
  };
  fechaDispersion: string;
  cantidadTotal: number;
  comentariosSolicitante: string;
  aprobacionJefe: {
    aprobado: boolean;
    comentarios: string;
    fecha: string;
  };
  autorizacion: {
    autorizado: boolean;
    comentarios: string;
    fecha: string;
  };
  saldoPendiente: number;
  movimientos: Array<{
    fecha: string;
    descripcion: string;
    tarjeta: string;
    gasto: number;
  }>;
}

export default function Layout() {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleRowClick = async (idViatico: string) => {
    if (selectedRowId === idViatico) {
      // Si ya está seleccionada la misma fila, solo toggle el acordeón
      setIsAccordionOpen(!isAccordionOpen);
      return;
    }

    // Si es una fila diferente, cargar nuevos datos
    setSelectedRowId(idViatico);
    setIsAccordionOpen(true);
    setLoading(true);
    setError(null);

    try {
      const response = await getMovimientosByViatico(idViatico);
      if (response.status === 'success' && response.data) {
        setMovimientos(response.data);
      } else {
        setError(response.message || 'Error al cargar los movimientos');
      }
    } catch {
      setError('Error al cargar los movimientos');
    } finally {
      setLoading(false);
    }
  };

  // Aquí iría la lógica para obtener los datos de la solicitud específica
  const solicitud: TravelExpenseDetail = {
    noSolicitud: '001',
    solicitante: 'Juan Pérez',
    sociedad: 'Grupo FG',
    sucursal: 'Central',
    area: 'Ventas',
    numeroTarjeta: '**** 1234',
    fechaSalida: '2024-01-20',
    fechaRegreso: '2024-01-25',
    detalles: {
      transporte: 5000,
      casetas: 1000,
      hospedaje: 4000,
      alimentos: 3000,
      fletes: 0,
      herramientas: 0,
      mensajeria: 0,
      diversos: 2000,
    },
    fechaDispersion: '2024-01-18',
    cantidadTotal: 15000,
    comentariosSolicitante:
      'Visita a cliente importante para presentación de nuevos productos',
    aprobacionJefe: {
      aprobado: true,
      comentarios: 'Aprobado, el viaje es necesario para el negocio',
      fecha: '2024-01-16',
    },
    autorizacion: {
      autorizado: true,
      comentarios: 'Autorizado, presupuesto dentro de lo esperado',
      fecha: '2024-01-17',
    },
    saldoPendiente: 5000,
    movimientos: [
      {
        fecha: '2024-01-20',
        descripcion: 'Gasolina',
        tarjeta: '**** 1234',
        gasto: 1000,
      },
      {
        fecha: '2024-01-21',
        descripcion: 'Hotel',
        tarjeta: '**** 1234',
        gasto: 2000,
      },
    ],
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header con botón de regreso */}
      <header className='bg-white shadow-sm'>
        <div className='px-8 py-4 flex items-center'>
          <button
            onClick={() => navigate('/verification-of-travel/page')}
            className='flex items-center text-[#02082C] hover:text-[#F34602] transition-colors'
          >
            <ArrowLeft
              className='h-6 w-6 mr-2 transform transition-all duration-200 ease-in-out hover:scale-110 hover:-translate-x-1 hover:text-[#F34602]'
              cursor='pointer'
            />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}
      >
        {/* Información general */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C] mb-4'>
            Información General
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>No. Solicitud</p>
              <p className='font-medium'>{solicitud.noSolicitud}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Solicitante</p>
              <p className='font-medium'>{solicitud.solicitante}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Sociedad</p>
              <p className='font-medium'>{solicitud.sociedad}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Sucursal</p>
              <p className='font-medium'>{solicitud.sucursal}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Área</p>
              <p className='font-medium'>{solicitud.area}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Número de Tarjeta</p>
              <p className='font-medium'>{solicitud.numeroTarjeta}</p>
            </div>
          </div>
        </div>

        {/* Detalles del viaje */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C] mb-4'>
            Detalles del Viaje
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <div></div>
            <div>
              <p className='text-sm text-gray-600'>
                Comentarios del Solicitante
              </p>
              <p className='font-medium'>{solicitud.comentariosSolicitante}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Fecha de Salida</p>
              <p className='font-medium'>{solicitud.fechaSalida}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Fecha de Regreso</p>
              <p className='font-medium'>{solicitud.fechaRegreso}</p>
            </div>
          </div>
        </div>

        {/* Desglose de gastos */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C] mb-4'>
            Desglose de Gastos
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>Transporte</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.transporte}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Casetas</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.casetas}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Hospedaje</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.hospedaje}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Alimentos</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.alimentos}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Fletes</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.fletes}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Herramientas/Equipos</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.herramientas}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Mensajería</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.mensajeria}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Diversos</p>
              <p className='font-medium text-[#F34602]'>
                ${solicitud.detalles.diversos}
              </p>
            </div>
          </div>
          <div className='mt-4 pt-4 border-t'>
            <div className='flex justify-between items-center'>
              <p className='text-lg font-medium'>Total Solicitado</p>
              <p className='text-xl font-bold text-[#F34602]'>
                ${solicitud.cantidadTotal}
              </p>
            </div>
            <div className='flex justify-between items-center mt-2'>
              <p className='text-lg font-medium'>Saldo Pendiente</p>
              <p className='text-xl font-bold text-[#02082C]'>
                ${solicitud.saldoPendiente}
              </p>
            </div>
          </div>
        </div>

        {/* Aprobaciones */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C] mb-4'>
            Aprobaciones
          </h2>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-medium mb-2'>
                Aprobación Jefe Inmediato
              </h3>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>Estado</p>
                <p
                  className={`font-medium ${
                    solicitud.aprobacionJefe.aprobado
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {solicitud.aprobacionJefe.aprobado ? 'Aprobado' : 'Rechazado'}
                </p>
                <p className='text-sm text-gray-600'>Comentarios</p>
                <p className='font-medium'>
                  {solicitud.aprobacionJefe.comentarios}
                </p>
                <p className='text-sm text-gray-600'>Fecha</p>
                <p className='font-medium'>{solicitud.aprobacionJefe.fecha}</p>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-medium mb-2'>Autorización</h3>
              <div className='space-y-2'>
                <p className='text-sm text-gray-600'>Estado</p>
                <p
                  className={`font-medium ${
                    solicitud.autorizacion.autorizado
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {solicitud.autorizacion.autorizado
                    ? 'Autorizado'
                    : 'No Autorizado'}
                </p>
                <p className='text-sm text-gray-600'>Comentarios</p>
                <p className='font-medium'>
                  {solicitud.autorizacion.comentarios}
                </p>
                <p className='text-sm text-gray-600'>Fecha</p>
                <p className='font-medium'>{solicitud.autorizacion.fecha}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla principal con filas clickeables */}
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C] mb-4'>
            Solicitudes de Viáticos
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    No. Solicitud
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Solicitante
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Fecha Salida
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Fecha Regreso
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {/* Aquí deberías mapear tus datos reales */}
                <tr
                  className='hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => handleRowClick('34204')}
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    001
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    Juan Pérez
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    2024-01-20
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    2024-01-25
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-[#F34602] font-medium'>
                    $15,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Acordeón de movimientos */}
        {selectedRowId && (
          <div className='bg-white rounded-lg shadow-lg p-6'>
            {loading ? (
              <div className='text-center py-4'>
                <p className='text-gray-600'>Cargando movimientos...</p>
              </div>
            ) : error ? (
              <div className='text-center py-4'>
                <p className='text-red-600'>{error}</p>
              </div>
            ) : (
              <MovimientosAccordion
                movimientos={movimientos}
                isOpen={isAccordionOpen}
                onToggle={() => setIsAccordionOpen(!isAccordionOpen)}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
