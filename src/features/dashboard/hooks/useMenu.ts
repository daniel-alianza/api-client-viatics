import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { File, FileText, Sheet, CreditCard, FileCheck } from 'lucide-react';

const ROUTE_MAPPING = {
  'new-expense': '/request/page',
  'accounting-auth': '/accounting-authorization/page',
  'travel-request': '/authorization/page',
  'collab-w-card': '/collaborators-w-card/page',
  'expense-verification': '/travel-expense-checks/page',
  'travel-verification': '/verification-of-travel/page',
} as const;

export const useMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.roleId);
    }
  }, []);

  const menuOptions = [
    {
      id: 'new-expense',
      label: 'Crear Solicitud',
      icon: File,
      color: '#F34602',
    },
    {
      id: 'travel-request',
      label: 'Solicitudes de Viaticos',
      icon: FileText,
      color: '#F34602',
    },
    {
      id: 'accounting-auth',
      label: 'Autorizaciones de Contabilidad',
      icon: Sheet,
      color: '#F34602',
    },
    {
      id: 'collab-w-card',
      label: 'Colaboradores Sin Asignacion a Tarjeta',
      icon: CreditCard,
      color: '#F34602',
    },
    {
      id: 'verification',
      label: 'Comprobaciones de Viaticos',
      icon: FileCheck,
      color: '#F34602',
    },
  ];

  // Filtrar las opciones del menú según el rol del usuario
  const filteredMenuOptions = menuOptions.filter(option => {
    if (userRole === 4) {
      // Si es colaborador
      return ['new-expense', 'verification'].includes(option.id);
    }
    return true; // Para otros roles, mostrar todas las opciones
  });

  const subMenuOptions = {
    verification: [
      {
        id: 'expense-verification',
        label: 'Verificación de Gastos',
      },
      {
        id: 'travel-verification',
        label: 'Verificación de Viajes',
      },
    ],
  };

  const handleMenuHover = (menuId: string) => setActiveMenu(menuId);
  const handleMenuLeave = () => setActiveMenu(null);

  const handleOptionClick = (optionId: string) => {
    if (optionId === 'verification') {
      if (userRole === 4) {
        // Si es colaborador
        navigate('/verification-of-travel/page');
      } else {
        setSelectedOption(optionId);
      }
    } else {
      const route = ROUTE_MAPPING[optionId as keyof typeof ROUTE_MAPPING];
      if (route) {
        navigate(route);
      } else {
        setSelectedOption(optionId);
      }
    }
  };

  const handleSubOptionClick = (subOptionId: string) => {
    const route = ROUTE_MAPPING[subOptionId as keyof typeof ROUTE_MAPPING];
    if (route) {
      navigate(route);
    }
    setSelectedOption(null);
  };

  const closePanel = () => setSelectedOption(null);

  return {
    activeMenu,
    selectedOption,
    searchFocused,
    setSearchFocused,
    menuOptions: filteredMenuOptions, // Usar las opciones filtradas
    subMenuOptions,
    handleMenuHover,
    handleMenuLeave,
    handleOptionClick,
    handleSubOptionClick,
    closePanel,
  };
};
