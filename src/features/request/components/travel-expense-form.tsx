import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelExpenseForm } from '@/features/request/hooks/useTravelExpenseForm';
import CompanyInfo from './CompanyInfo';
import TripReason from './TripReason';
import TravelDates from './TravelDates';
import EstimatedExpenses from './EstimatedExpenses';
import TripObjectives from './TripObjectives';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Send } from 'lucide-react';
import {
  SolicitudProvider,
  useSolicitudContext,
} from '../context/SolicitudContext';
import { useRequestErrorModal } from '@/features/request/hooks/useRequestErrorModal';
import { RequestErrorModal } from '@/features/request/components/RequestErrorModal';
import { ArrowLeft } from 'lucide-react';
const TravelExpenseFormContent = () => {
  const navigate = useNavigate();
  const { userRequestData } = useSolicitudContext();
  const {
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    distributionDate,
    setDistributionDate,
    travelReason,
    setTravelReason,
    travelObjectives,
    setTravelObjectives,
    updateExpense,
    totalExpenses,
    getFormData,
  } = useTravelExpenseForm();

  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    branch: '',
    area: '',
    cardNumber: '',
    travelReason: '',
    departureDate: '',
    returnDate: '',
    expenses: {
      transport: '0',
      tolls: '0',
      lodging: '0',
      food: '0',
      freight: '0',
      tools: '0',
      shipping: '0',
      misc: '0',
    },
    disbursementDate: '',
    totalAmount: '0',
    travelObjectives: '',
  });
  const [completedSections, setCompletedSections] = useState({
    basicInfo: false,
    travelReason: false,
    dates: false,
    expenses: false,
    disbursement: false,
    objectives: false,
  });
  const [visibleSections, setVisibleSections] = useState({
    basicInfo: true,
    travelReason: false,
    dates: false,
    expenses: false,
    disbursement: false,
    objectives: false,
  });
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    travelReason: false,
    dates: false,
    expenses: false,
    disbursement: false,
    objectives: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const hasCardNumber =
    userRequestData?.cardNumber && userRequestData.cardNumber !== 'N/A';

  const {
    modalState,
    showErrorModal,
    showWarningModal,
    showSuccessModal,
    closeModal,
  } = useRequestErrorModal();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  const validateForm = () => {
    if (!hasCardNumber) {
      showErrorModal(
        'Error de Validación',
        'No se encontró un número de tarjeta válido. Por favor, contacte al administrador.',
      );
      return false;
    }

    if (!departureDate || !returnDate || !distributionDate) {
      showErrorModal(
        'Error de Validación',
        'Por favor, complete todas las fechas requeridas',
      );
      return false;
    }

    if (
      isNaN(departureDate.getTime()) ||
      isNaN(returnDate.getTime()) ||
      isNaN(distributionDate.getTime())
    ) {
      showErrorModal(
        'Error de Validación',
        'Por favor, ingrese fechas válidas',
      );
      return false;
    }

    if (returnDate < departureDate) {
      showErrorModal(
        'Error de Validación',
        'La fecha de retorno debe ser posterior a la fecha de salida',
      );
      return false;
    }

    if (!distributionDate || isNaN(distributionDate.getTime())) {
      showErrorModal(
        'Error de Validación',
        'Por favor, ingrese una fecha de distribución válida',
      );
      return false;
    }

    if (!travelReason.trim()) {
      showErrorModal(
        'Error de Validación',
        'Por favor, ingrese el motivo del viaje',
      );
      return false;
    }

    if (!travelObjectives.trim()) {
      showErrorModal(
        'Error de Validación',
        'Por favor, ingrese los objetivos del viaje',
      );
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const formDataValues = getFormData();
      const requestData = {
        userId: user.id,
        totalAmount: totalExpenses,
        travelReason: formDataValues.travelReason,
        departureDate: formDataValues.departureDate,
        returnDate: formDataValues.returnDate,
        disbursementDate: formDataValues.distributionDate,
        travelObjectives: formDataValues.travelObjectives,
        details: Object.entries(formDataValues.expenses).map(
          ([concept, amount]) => ({
            concept,
            amount: amount,
          }),
        ),
      };

      const response = await fetch('http://localhost:4000/expense-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la solicitud');
      }

      const responseData = await response.json();
      showSuccessModal(
        'Solicitud Creada',
        'La solicitud de viáticos ha sido creada exitosamente',
      );
      console.log('Solicitud creada:', responseData);

      // Reinicia el formulario después de enviar
      setFormData({
        company: '',
        branch: '',
        area: '',
        cardNumber: '',
        travelReason: '',
        departureDate: '',
        returnDate: '',
        expenses: {
          transport: '0',
          tolls: '0',
          lodging: '0',
          food: '0',
          freight: '0',
          tools: '0',
          shipping: '0',
          misc: '0',
        },
        disbursementDate: '',
        totalAmount: '0',
        travelObjectives: '',
      });

      setCompletedSections({
        basicInfo: false,
        travelReason: false,
        dates: false,
        expenses: false,
        disbursement: false,
        objectives: false,
      });

      setVisibleSections({
        basicInfo: true,
        travelReason: false,
        dates: false,
        expenses: false,
        disbursement: false,
        objectives: false,
      });

      setExpandedSections({
        basicInfo: true,
        travelReason: false,
        dates: false,
        expenses: false,
        disbursement: false,
        objectives: false,
      });
    } catch (error) {
      console.error('Error:', error);
      showErrorModal(
        'Error al Crear Solicitud',
        error instanceof Error
          ? error.message
          : 'Error al crear la solicitud de viáticos',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className='min-h-screen p-4 md:p-8'
      style={{
        background: `linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)`,
      }}
    >
      <motion.div
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        as='div'
      >
        <header className='relative z-10 px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
          <div className='flex items-center'>
            <div
              className='relative w-12 h-12 cursor-pointer group'
              onClick={() => navigate('/dashboard')}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <ArrowLeft
                  className='h-8 w-8 text-[#02082C] transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1'
                  strokeWidth={2}
                />
              </div>
            </div>
            <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
              Portal Grupo FG{' '}
            </h1>
          </div>
        </header>
        <Card className='w-full max-w-7xl mx-auto shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm'>
          <div
            className='h-2 w-full'
            style={{
              background: `linear-gradient(5deg,rgb(14, 37, 188) 0%, #F34602 100%)`,
            }}
          ></div>
          <CardHeader className='pb-4 pt-8 px-8'>
            <CardTitle
              className='text-2xl font-bold'
              style={{ color: '#02082C' }}
            >
              Detalles de Gastos
            </CardTitle>
            <CardDescription className='text-slate-600'>
              Proporcione toda la información requerida para su viaje.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-8 px-8'>
              <CompanyInfo />
              <Separator className='bg-slate-200' />
              <TripReason
                travelReason={travelReason}
                setTravelReason={setTravelReason}
                disabled={!hasCardNumber}
              />
              <Separator className='bg-slate-200' />
              <TravelDates
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
                distributionDate={distributionDate}
                setDistributionDate={setDistributionDate}
                disabled={!hasCardNumber}
              />
              <Separator className='bg-slate-200' />
              <EstimatedExpenses
                updateExpense={updateExpense}
                totalExpenses={totalExpenses}
                disabled={!hasCardNumber}
              />
              <Separator className='bg-slate-200' />
              <TripObjectives
                travelObjectives={travelObjectives}
                setTravelObjectives={setTravelObjectives}
                disabled={!hasCardNumber}
              />
            </CardContent>
            <CardFooter className='px-8 py-6 bg-slate-50 border-t border-slate-200'>
              <motion.div
                className='w-full'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                as='div'
              >
                <Button
                  type='submit'
                  className='w-full py-6 text-lg font-medium transition-all duration-300 rounded-md'
                  style={{
                    background: `linear-gradient( #F34602 0%, #F34602 100%)`,
                    boxShadow: '0 10px 15px -3px rgba(243, 70, 2, 0.2)',
                  }}
                  disabled={!hasCardNumber || isSubmitting}
                >
                  <Send className='mr-2 h-5 w-5' /> Solicitar Viáticos
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      <RequestErrorModal modalState={modalState} onClose={closeModal} />
    </div>
  );
};

const TravelExpenseForm = () => {
  return (
    <SolicitudProvider>
      <TravelExpenseFormContent />
    </SolicitudProvider>
  );
};

export default TravelExpenseForm;
