import { useState } from 'react';
import xmlInfoService from '@/services/xmlinfoService';
import { documentService } from '@/services/documentService';

interface UseDocumentFetchReturn {
  previewUrl: string | null;
  showXmlInfo: boolean;
  isLoadingXmlInfo: boolean;
  xmlInfo: any;
  isPdfFile: boolean;
  handlePreviewDocument: (
    documentId: number,
    fileName?: string,
  ) => Promise<void>;
  closePreview: () => void;
}

export const useDocumentFetch = (): UseDocumentFetchReturn => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showXmlInfo, setShowXmlInfo] = useState(false);
  const [isLoadingXmlInfo, setIsLoadingXmlInfo] = useState(false);
  const [xmlInfo, setXmlInfo] = useState<any>(null);
  const [isPdfFile, setIsPdfFile] = useState(false);

  const handlePreviewDocument = async (
    documentId: number,
    fileName?: string,
  ) => {
    try {
      // Verificar si es un archivo XML
      if (fileName && fileName.toLowerCase().endsWith('.xml')) {
        // Para archivos XML, mostrar información en lugar de vista previa
        setPreviewUrl(null);
        setShowXmlInfo(true);
        setIsLoadingXmlInfo(true);

        try {
          // Aquí documentId es comprobacionId
          const xmlData = await xmlInfoService.getXmlInfo(documentId);
          setXmlInfo(xmlData);
        } catch (xmlError) {
          setXmlInfo(null);
        } finally {
          setIsLoadingXmlInfo(false);
        }
      } else {
        // Para PDF y otros archivos, mostrar vista previa normal
        const documentResponse = await documentService.getDocument(documentId);
        // Detectar si es un archivo PDF
        const isPdf = Boolean(
          fileName && fileName.toLowerCase().endsWith('.pdf'),
        );
        let blobToUse = documentResponse.data;
        // Si es un PDF pero el servidor devuelve contentType incorrecto, crear un nuevo Blob
        if (isPdf && documentResponse.contentType !== 'application/pdf') {
          blobToUse = new Blob([documentResponse.data], {
            type: 'application/pdf',
          });
        }
        const url = documentService.createObjectURL(blobToUse);
        setPreviewUrl(url);
        setShowXmlInfo(false);
        setIsPdfFile(isPdf);
      }
    } catch (error) {
      setIsLoadingXmlInfo(false);
      setShowXmlInfo(false);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      documentService.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setXmlInfo(null);
    setShowXmlInfo(false);
    setIsPdfFile(false);
  };

  return {
    previewUrl,
    showXmlInfo,
    isLoadingXmlInfo,
    xmlInfo,
    isPdfFile,
    handlePreviewDocument,
    closePreview,
  };
};
