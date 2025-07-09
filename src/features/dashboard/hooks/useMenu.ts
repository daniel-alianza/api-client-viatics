import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { menuOptions, subMenuOptions } from '@/lib/menuOptions';

const ROUTE_MAPPING = {
  'new-expense': '/request/page',
  'accounting-authorization': '/accounting-authorization/page',
  'travel-request': '/authorization/page',
  'collaborators-w-card': '/collaborators-w-card/page',
  'expense-verification': '/travel-expense-checks/page',
  'travel-verification': '/verification-of-travel/page',
  'accounting-clearance': '/accounting-clearance/page',
} as const;

export const useMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Permisos predeterminados
  const PERMISOS_PREDETERMINADOS = [
    'new-expense', // Crear Solicitud
    'verification', // Comprobaciones (menú principal)
  ];

  useEffect(() => {
    if (user) {
      setUserRole(user.roleId);
      // Si es admin, no filtrar nada
      if (user.email === 'admin@alianzaelectrica.com' || user.roleId === 1) {
        setPermisos(menuOptions.map(opt => opt.id));
      } else {
        // Consultar permisos del backend
        api
          .get(`/permissions/user/${user.id}`)
          .then(res => {
            const permisosBD = res.data.map((p: any) => p.viewName);
            setPermisos([...PERMISOS_PREDETERMINADOS, ...permisosBD]);
          })
          .catch(() => {
            setPermisos(PERMISOS_PREDETERMINADOS);
          });
      }
    }
  }, [user]);

  // Filtrar las opciones del menú según los permisos
  const filteredMenuOptions = menuOptions.filter(option =>
    permisos.includes(option.id),
  );

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
