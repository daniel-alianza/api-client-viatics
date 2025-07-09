import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelExpenseForm } from '@/features/request/hooks/useTravelExpenseForm';
import CompanyInfo from './CompanyInfo';
import TripReason from './TripReason';
import TravelDates from './TravelDates';
import EstimatedExpenses from './EstimatedExpenses';
import TripObjectives from './TripObjectives';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRequestErrorModal } from '@/features/request/hooks/useRequestErrorModal';
import { RequestErrorModal } from '@/features/request/components/RequestErrorModal';
import Navbar from './navbar';
import { createTravelExpense } from '@/services/requestService';
import type { TravelExpenseFormData } from '../interfaces/solicitud.types';

const TravelExpenseFormContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    setExpenses,
  } = useTravelExpenseForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const hasCards = user?.cards && user.cards.length > 0;

  useEffect(() => {
    if (user?.cards && user.cards.length > 0 && !selectedCardId) {
      setSelectedCardId(user.cards[0].id.toString());
    }
  }, [user?.cards, selectedCardId]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  const { modalState, showErrorModal, closeModal, showSuccessModal } =
    useRequestErrorModal();

  const validateForm = () => {
    if (!hasCards) {
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

  const transformFormData = (formData: TravelExpenseFormData) => {
    const details = Object.entries(formData.expenses).map(
      ([concept, amount]) => ({
        concept,
        amount,
      }),
    );

    return {
      userId: formData.userId,
      totalAmount: formData.totalAmount,
      departureDate: formData.departureDate
        ? new Date(formData.departureDate).toISOString()
        : undefined,
      returnDate: formData.returnDate
        ? new Date(formData.returnDate).toISOString()
        : undefined,
      disbursementDate: formData.distributionDate
        ? new Date(formData.distributionDate).toISOString()
        : undefined,
      travelReason: formData.travelReason,
      travelObjectives: formData.travelObjectives,
      details,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = getFormData();
      const payload = transformFormData(formData);
      await createTravelExpense(payload, user?.token ?? '');
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setDistributionDate(undefined);
      setTravelReason('');
      setTravelObjectives('');
      setExpenses({
        transportation: 0,
        tolls: 0,
        lodging: 0,
        food: 0,
        freight: 0,
        tools: 0,
        shipping: 0,
        miscellaneous: 0,
      });
      showSuccessModal('Éxito', 'La solicitud se ha enviado correctamente');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al enviar la solicitud.';
      showErrorModal('Error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg'>
          <div className='p-8'>
            <h1 className='text-2xl font-bold text-[#02082C] mb-8'>
              Solicitud de Gastos de Viaje
            </h1>
            <form onSubmit={handleSubmit} className='space-y-8'>
              <CompanyInfo
                selectedCardId={selectedCardId}
                setSelectedCardId={setSelectedCardId}
              />
              <Separator className='my-8' />
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <TripReason
                  travelReason={travelReason}
                  setTravelReason={setTravelReason}
                  disabled={!hasCards}
                />
                <TravelDates
                  departureDate={departureDate}
                  setDepartureDate={setDepartureDate}
                  returnDate={returnDate}
                  setReturnDate={setReturnDate}
                  distributionDate={distributionDate}
                  setDistributionDate={setDistributionDate}
                  disabled={!hasCards}
                />
              </div>
              <Separator className='my-8' />
              <EstimatedExpenses
                totalExpenses={totalExpenses}
                updateExpense={updateExpense}
                disabled={!hasCards}
              />
              <Separator className='my-8' />
              <TripObjectives
                travelObjectives={travelObjectives}
                setTravelObjectives={setTravelObjectives}
                disabled={!hasCards}
              />
              <div className='flex justify-end mt-12'>
                <Button
                  type='submit'
                  disabled={isSubmitting || !hasCards}
                  className='flex items-center gap-2 bg-[#F34602] hover:bg-[#02082C] text-white'
                >
                  <Send className='w-4 h-4' />
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <RequestErrorModal modalState={modalState} onClose={closeModal} />
    </div>
  );
};

const TravelExpenseForm = () => {
  return <TravelExpenseFormContent />;
};

export default TravelExpenseForm;
