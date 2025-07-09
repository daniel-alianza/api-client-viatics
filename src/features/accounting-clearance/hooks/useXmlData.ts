import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useXmlData = (
  comprobacionId: string,
  isOpen: boolean,
  comprobacionType?: string,
) => {
  const [xmlData, setXmlData] = useState<any>(null);
  const [isLoadingXml, setIsLoadingXml] = useState(false);

  const loadXmlData = async () => {
    // Solo cargar XML si es una factura
    if (!isOpen || xmlData || comprobacionType !== 'factura') return;

    setIsLoadingXml(true);
    try {
      const response = await api.get(`/xml/comprobacion/${comprobacionId}`);
      setXmlData(response.data);
    } catch (error: any) {
      setXmlData(null);
    } finally {
      setIsLoadingXml(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadXmlData();
    }
  }, [isOpen, comprobacionId, comprobacionType]);

  return {
    xmlData,
    isLoadingXml,
  };
};
