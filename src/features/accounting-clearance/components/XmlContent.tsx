import React from 'react';
import { XmlInfoTable } from './XmlInfoTable';
import { ConceptosTable } from './ConceptosTable';
import { TrasladosTable } from './TrasladosTable';
import { XmlContentProps } from '../interfaces/comprobacionestable.Interface';
import { Eye } from 'lucide-react';

export const XmlContent: React.FC<XmlContentProps> = ({
  xmlData,
  isLoadingXml,
  category,
  taxIndicator,
  comprobacionType,
  responsable,
  motivo,
  descripcion,
  importe,
  pdfFile,
  onPreviewPdf,
}) => {
  const getPdfFileName = () => {
    if (pdfFile?.documents && Array.isArray(pdfFile.documents)) {
      const pdfDocument = pdfFile.documents.find(
        (doc: any) =>
          doc.mimeType === 'application/pdf' || doc.type === 'factura_pdf',
      );
      return pdfDocument?.fileName || 'No hay documento PDF';
    }
    return 'No hay documento PDF';
  };

  if (comprobacionType && comprobacionType !== 'factura') {
    return (
      <div className='space-y-4'>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Información del Vale/Ticket
          </h3>

          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Responsable
              </label>
              <input
                type='text'
                value={responsable || 'No especificado'}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
                placeholder='Responsable de la comprobación'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Motivo
              </label>
              <input
                type='text'
                value={motivo || 'No especificado'}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
                placeholder='Motivo de la comprobación'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <textarea
                value={descripcion || 'No especificado'}
                disabled
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed resize-none'
                placeholder='Descripción de la comprobación'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Importe
              </label>
              <input
                type='text'
                value={
                  importe
                    ? `$${importe.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : 'No especificado'
                }
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
                placeholder='Importe de la comprobación'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Documento PDF
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={getPdfFileName()}
                  disabled
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
                  placeholder='Documento PDF de la comprobación'
                />
                {pdfFile?.documents &&
                  Array.isArray(pdfFile.documents) &&
                  pdfFile.documents.some(
                    (doc: any) =>
                      doc.mimeType === 'application/pdf' ||
                      doc.type === 'factura_pdf',
                  ) && (
                    <button
                      onClick={onPreviewPdf}
                      className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                      title='Ver documento PDF'
                    >
                      <Eye className='w-5 h-5' />
                    </button>
                  )}
              </div>
            </div>

            <div className='text-sm text-gray-500 italic'>
              Esta comprobación es un vale/ticket. No requiere información XML.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingXml) {
    return (
      <div className='text-center py-8'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
        <p className='mt-2 text-gray-600'>Cargando información del XML...</p>
      </div>
    );
  }

  if (!xmlData) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-600'>
          No se pudo cargar la información del XML
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <XmlInfoTable xmlData={xmlData} />
      <ConceptosTable
        conceptos={xmlData.conceptos}
        category={category}
        taxIndicator={taxIndicator}
      />
      <TrasladosTable
        conceptos={xmlData.conceptos}
        category={category}
        taxIndicator={taxIndicator}
      />
    </div>
  );
};
