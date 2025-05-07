import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { File, FileText, Sheet, Settings, CreditCard } from 'lucide-react';

const ROUTE_MAPPING = {
  'new-expense': '/request/page',
  'accounting-auth': '/accounting-authorization/page',
  'travel-request': '/authorization/page',
  'collab-w-card': '/collaborators-w-card/page',
} as const;

export const useMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

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
    { id: 'settings', label: 'Settings', icon: Settings, color: '#F34602' },
  ];

  const handleMenuHover = (menuId: string) => setActiveMenu(menuId);
  const handleMenuLeave = () => setActiveMenu(null);

  const handleOptionClick = (optionId: string) => {
    const route = ROUTE_MAPPING[optionId as keyof typeof ROUTE_MAPPING];
    if (route) {
      navigate(route);
    } else {
      setSelectedOption(optionId);
    }
  };

  const closePanel = () => setSelectedOption(null);

  return {
    activeMenu,
    selectedOption,
    searchFocused,
    setSearchFocused,
    menuOptions,
    handleMenuHover,
    handleMenuLeave,
    handleOptionClick,
    closePanel,
  };
};
