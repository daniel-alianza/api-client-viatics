import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Vista previa del PDF</DialogTitle>
        </DialogHeader>

        {pdfUrl && (
          <div className='relative w-full h-[70vh]'>
            <object
              data={pdfUrl}
              type='application/pdf'
              className='w-full h-full border-0'
            >
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <p className='text-gray-600 mb-4'>
                  Tu navegador no puede mostrar PDFs.
                </p>
                <a
                  href={pdfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:text-blue-800 hover:underline'
                >
                  Haz clic aquí para abrir en nueva pestaña
                </a>
              </div>
            </object>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
