import React from 'react';
import { ExpenseProvider } from '@/features/TravelExpense-Checks/context/expense-context';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import { useDocumentFetch } from '@/features/TravelExpense-Checks/hooks/useDocumentFetch';
import { useComprobacionesFilter } from '@/features/TravelExpense-Checks/hooks/useComprobacionesFilter';
import { useComprobacionActions } from '@/features/TravelExpense-Checks/hooks/useComprobacionActions';
import { ComprobacionesP } from '@/features/TravelExpense-Checks/components/ComprobacionesP';
import { ComprobacionesR } from '@/features/TravelExpense-Checks/components/ComprobacionesR';
import { ComprobacionesV } from '@/features/TravelExpense-Checks/components/ComprobacionesV';
import { DocumentDialog } from '@/features/TravelExpense-Checks/components/DocumentDialog';
import Navbar from '@/features/collaborators-w-card/components/navbar';

const ExpenseVerificationTable: React.FC = () => {
  const {
    comprobaciones,
    error,
    loadComprobaciones,
    approveComprobacion,
    rejectComprobacion,
    getComprobacionDocuments,
  } = useExpense();

  const {
    previewUrl,
    showXmlInfo,
    isLoadingXmlInfo,
    xmlInfo,
    isPdfFile,
    handlePreviewDocument,
    closePreview,
  } = useDocumentFetch();

  const {
    pendingComprobaciones,
    rejectedComprobaciones,
    verifiedComprobaciones,
    pendingCount,
    rejectedCount,
    verifiedCount,
  } = useComprobacionesFilter(comprobaciones);

  const {
    selectedComprobacion,
    isDialogOpen,
    isRejecting,
    comment,
    documents,
    handleViewDocuments,
    handleApprove,
    handleReject,
    closeDialog,
    setComment,
    setIsRejecting,
  } = useComprobacionActions();

  React.useEffect(() => {
    loadComprobaciones();
  }, [loadComprobaciones]);

  if (error) {
    return <div className='text-center text-red-500 py-8'>{error}</div>;
  }

  const onViewDocuments = (comprobacionId: number) => {
    handleViewDocuments(comprobacionId, getComprobacionDocuments);
  };

  const onApprove = (comprobacionId: number) => {
    handleApprove(comprobacionId, approveComprobacion, loadComprobaciones);
  };

  const onReject = (comprobacionId: number) => {
    handleReject(comprobacionId, rejectComprobacion, loadComprobaciones);
  };

  const handleCloseDialog = () => {
    closeDialog();
    closePreview();
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Comprobaciones de Gastos</h1>

      {/* Tabla de Comprobaciones Pendientes */}
      <ComprobacionesP
        comprobaciones={pendingComprobaciones}
        count={pendingCount}
        onViewDocuments={onViewDocuments}
      />

      {/* Tabla de Comprobaciones Rechazadas */}
      <ComprobacionesR
        comprobaciones={rejectedComprobaciones}
        count={rejectedCount}
      />

      {/* Tabla de Comprobaciones Verificadas */}
      <ComprobacionesV
        comprobaciones={verifiedComprobaciones}
        count={verifiedCount}
      />

      {/* Diálogo para ver documentos */}
      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        isRejecting={isRejecting}
        selectedComprobacion={selectedComprobacion}
        comment={comment}
        documents={documents}
        previewUrl={previewUrl}
        showXmlInfo={showXmlInfo}
        isLoadingXmlInfo={isLoadingXmlInfo}
        xmlInfo={xmlInfo}
        isPdfFile={isPdfFile}
        onPreviewDocument={handlePreviewDocument}
        onClosePreview={closePreview}
        onCommentChange={setComment}
        onSetRejecting={setIsRejecting}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
};

const ExpenseVerificationPageContent: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='py-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gestión de Comprobaciones
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Administra y verifica las comprobaciones de gastos
            </p>
          </div>
          <ExpenseVerificationTable />
        </div>
      </main>
    </div>
  );
};

export const ExpenseVerificationPage: React.FC = () => {
  return (
    <ExpenseProvider>
      <ExpenseVerificationPageContent />
    </ExpenseProvider>
  );
};
