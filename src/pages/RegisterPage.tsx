import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useFormUser } from '@/hooks/useFormUser';
import { RenderSelect } from '@/components/form/RenderSelect';
import { useRegisterUser } from '@/hooks/useRegisterUser';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [hasCheckedBranches, setHasCheckedBranches] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning'>(
    'error',
  );

  const {
    companies,
    branches,
    areas,
    managers,
    loadingCompanies,
    loadingBranches,
    loadingAreas,
    selectedCompany,
    selectedBranch,
    selectedArea,
    selectedManager,
    setSelectedCompany,
    setSelectedBranch,
    setSelectedArea,
    setSelectedManager,
  } = useFormUser();

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    success,
    handleSubmit,
  } = useRegisterUser({
    selectedCompany,
    selectedBranch,
    selectedArea,
    selectedManager,
    resetSelections: () => {
      setSelectedCompany('');
      setSelectedBranch('');
      setSelectedArea('');
      setSelectedManager('');
    },
  });

  // Limpiar selecciones cuando cambia la compañía
  useEffect(() => {
    if (selectedCompany) {
      setSelectedBranch('');
      setSelectedArea('');
      setSelectedManager('');
      setHasCheckedBranches(false);
    }
  }, [selectedCompany, setSelectedBranch, setSelectedArea, setSelectedManager]);

  // Verificar sucursales después de seleccionar compañía
  useEffect(() => {
    if (selectedCompany) {
      setHasCheckedBranches(true); // Solo marcamos como verificado, sin mostrar aviso
    }
  }, [selectedCompany, loadingBranches, branches, hasCheckedBranches]);

  useEffect(() => {
    if (error) {
      setErrorTitle('Error en el Registro');
      setErrorMessage(error);
      setModalType('error');
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setErrorTitle('Registro Exitoso');
      setErrorMessage(success);
      setModalType('success');
      setShowErrorModal(true);
    }
  }, [success]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  const getModalIcon = () => {
    switch (modalType) {
      case 'success':
        return <CheckCircle2 className='h-6 w-6 text-green-500' />;
      case 'error':
        return <XCircle className='h-6 w-6 text-red-500' />;
      case 'warning':
        return <AlertCircle className='h-6 w-6 text-yellow-500' />;
      default:
        return <XCircle className='h-6 w-6 text-red-500' />;
    }
  };

  const getModalTitleColor = () => {
    switch (modalType) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  const getModalButtonColor = () => {
    switch (modalType) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#02082C]'>
      <Card className='w-[90vw] max-w-4xl p-0'>
        <div className='flex w-full flex-col md:flex-row'>
          <div className='w-full flex flex-col items-start p-10 pt-4 space-y-6 justify-center'>
            <img
              src='/GrupoFG_Logo.png'
              alt='Grupo FG'
              className='h-52 w-40 mb-5'
            />
            <h1 className='text-2xl font-bold text-[#F34602] text-center w-full mb-5'>
              Regístrate
            </h1>

            <form
              onSubmit={handleFormSubmit}
              className='w-full grid grid-cols-1 md:grid-cols-2 gap-11'
            >
              <Input
                placeholder='Nombre completo'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                placeholder='Correo electrónico'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                placeholder='Contraseña'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                placeholder='Confirmar contraseña'
                type='password'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <RenderSelect
                placeholder='Selecciona tu Empresa'
                values={companies.map(c => ({
                  value: c.id.toString(),
                  label: c.name,
                }))}
                onChange={setSelectedCompany}
                selectedValue={selectedCompany}
                loading={loadingCompanies}
                label='Empresas'
                onError={(title, message) => {
                  setErrorTitle(title);
                  setErrorMessage(message);
                  setModalType('error');
                  setShowErrorModal(true);
                }}
              />

              <RenderSelect
                placeholder={
                  loadingBranches
                    ? 'Cargando sucursales...'
                    : 'Selecciona tu Sucursal'
                }
                values={branches.map(b => ({
                  value: b.id.toString(),
                  label: b.name,
                }))}
                onChange={setSelectedBranch}
                selectedValue={selectedBranch}
                loading={loadingBranches}
                label='Sucursales'
                disabled={!selectedCompany}
                onError={(title, message) => {
                  setErrorTitle(title);
                  setErrorMessage(message);
                  setModalType('error');
                  setShowErrorModal(true);
                }}
              />

              <RenderSelect
                placeholder={
                  loadingAreas ? 'Cargando áreas...' : 'Selecciona tu Área'
                }
                values={areas.map(a => ({
                  value: a.id.toString(),
                  label: a.name,
                }))}
                onChange={setSelectedArea}
                selectedValue={selectedArea}
                loading={loadingAreas}
                label='Áreas'
                disabled={!selectedBranch}
                onError={(title, message) => {
                  setErrorTitle(title);
                  setErrorMessage(message);
                  setModalType('error');
                  setShowErrorModal(true);
                }}
              />

              <RenderSelect
                placeholder='A quién reportas'
                values={managers.map(m => ({
                  value: m.id.toString(),
                  label: m.name,
                }))}
                onChange={setSelectedManager}
                selectedValue={selectedManager}
                label='Manager'
                disabled={!selectedArea}
                onError={(title, message) => {
                  setErrorTitle(title);
                  setErrorMessage(message);
                  setModalType('error');
                  setShowErrorModal(true);
                }}
              />

              <div className='md:col-span-2 flex gap-4'>
                <Button
                  type='submit'
                  className='w-100 rounded-[10px] bg-[#F34602] text-white hover:bg-[#02082C] transition-colors duration-300 cursor-pointer'
                >
                  Crear cuenta
                </Button>
                <Link
                  to='/login'
                  className='w-full text-center rounded-[10px] bg-[#F34602] text-white py-2 hover:bg-[#02082C] transition-colors duration-300'
                >
                  Regresar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Card>

      <AlertDialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <AlertDialogContent className='sm:max-w-md'>
          <AlertDialogHeader>
            <div className='flex items-center gap-2'>
              {getModalIcon()}
              <AlertDialogTitle className={getModalTitleColor()}>
                {errorTitle}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className='mt-2'>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                if (modalType === 'success' && success) {
                  window.location.href = '/login';
                }
              }}
              className={getModalButtonColor()}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
