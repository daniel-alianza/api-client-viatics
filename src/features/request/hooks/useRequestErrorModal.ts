import { useState } from 'react';

interface ModalState {
  showModal: boolean;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'success';
}

export const useRequestErrorModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showErrorModal = (title: string, message: string) => {
    setModalState({
      showModal: true,
      title,
      message,
      type: 'error',
    });
  };

  const showWarningModal = (title: string, message: string) => {
    setModalState({
      showModal: true,
      title,
      message,
      type: 'warning',
    });
  };

  const showSuccessModal = (title: string, message: string) => {
    setModalState({
      showModal: true,
      title,
      message,
      type: 'success',
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, showModal: false }));
  };

  return {
    modalState,
    showErrorModal,
    showWarningModal,
    showSuccessModal,
    closeModal,
  };
};
