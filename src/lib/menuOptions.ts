import {
  File,
  FileText,
  Sheet,
  CreditCard,
  FileCheck,
  ClipboardCheck,
} from 'lucide-react';

export const menuOptions = [
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
    id: 'accounting-authorization',
    label: 'Dispersión de Viaticos',
    icon: Sheet,
    color: '#F34602',
  },
  {
    id: 'accounting-clearance',
    label: 'Autorización Contable',
    icon: ClipboardCheck,
    color: '#F34602',
  },
  {
    id: 'collaborators-w-card',
    label: 'Asignación de Tarjeta',
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

export const subMenuOptions = {
  verification: [
    {
      id: 'expense-verification',
      label: 'Comprobacion de Viaticos por Colaborador',
    },
    {
      id: 'travel-verification',
      label: 'Mis comprobaciones',
    },
  ],
};
