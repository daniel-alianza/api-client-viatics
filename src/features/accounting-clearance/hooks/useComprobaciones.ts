import { useEffect, useState } from 'react';
import { getComprobaciones } from '@/services/comprobacionesService';
import { getExpenseRequests } from '@/services/expenseService';
import { getTaxCodes } from '@/services/TaxcodeService';
import { getFactorDescriptions } from '@/services/distribrepService';
import { toast } from 'sonner';
import { Comprobacion } from '../interfaces/comprobacionestable.Interface';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';

interface SelectOption {
  value: string;
  label: string;
}

interface OptionsState {
  categoryOptions: SelectOption[];
  taxIndicatorOptions: SelectOption[];
  distributionRuleOptions: SelectOption[];
}

// Función helper para detectar tipo de comprobación
const detectComprobacionType = (
  comprobacion: Comprobacion,
): 'factura' | 'ticket' | 'vale' => {
  // Si ya tiene un tipo definido, usarlo
  if (comprobacion.type) {
    return comprobacion.type as 'factura' | 'ticket' | 'vale';
  }

  // Si tiene archivos XML, es factura
  if (
    comprobacion.files?.some((file: any) =>
      file.name?.toLowerCase().endsWith('.xml'),
    )
  ) {
    return 'factura';
  }

  // Si tiene archivos PDF o imágenes, puede ser ticket/vale
  if (
    comprobacion.files?.some(
      (file: any) =>
        file.name?.toLowerCase().endsWith('.pdf') ||
        file.name?.toLowerCase().endsWith('.jpg') ||
        file.name?.toLowerCase().endsWith('.png'),
    )
  ) {
    return 'ticket';
  }

  // Por defecto, asumir ticket si no se puede determinar
  return 'ticket';
};

export const useComprobaciones = () => {
  const { id } = useParams();
  const [comprobaciones, setComprobaciones] = useState<Comprobacion[]>([]);
  const [xmlDataMap, setXmlDataMap] = useState<Record<string, any>>({});
  const [options, setOptions] = useState<OptionsState>({
    categoryOptions: [],
    taxIndicatorOptions: [],
    distributionRuleOptions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener comprobaciones pendientes de SAP y solicitudes de gastos
        const [comprobacionesData, expenseRequestsData] = await Promise.all([
          getComprobaciones(true), // Solo comprobaciones pendientes de SAP
          getExpenseRequests(),
        ]);

        const comprobacionesFiltradas = comprobacionesData
          .filter((comp: Comprobacion) => comp.viaticoId === id)
          .filter((comp: Comprobacion) => comp.status !== 'rechazada');

        const comprobacionesEnriquecidas = comprobacionesFiltradas.map(
          (comp: Comprobacion) => {
            const expenseRequest = expenseRequestsData.find(
              exp => exp.id === comp.viaticoId,
            );
            // Detectar automáticamente el tipo de comprobación
            const detectedType = detectComprobacionType(comp);
            return {
              ...comp,
              empresa: expenseRequest?.company || comp.company,
              type: comp.type || detectedType, // Usar tipo existente o detectado
            };
          },
        );

        // Obtener la empresa de la primera comprobación para cargar las opciones
        const company =
          comprobacionesEnriquecidas[0]?.empresa ||
          comprobacionesEnriquecidas[0]?.company;

        // Cargar todas las opciones y XML de todas las comprobaciones en paralelo
        const promises: Promise<any>[] = [];

        // Agregar promesas para las opciones
        if (company) {
          promises.push(
            api.get('/wholesale-accounts', { params: { empresa: company } }),
            getTaxCodes(company),
            getFactorDescriptions(),
          );
        }

        // Agregar promesas para cargar XML solo de comprobaciones tipo 'factura'
        const xmlPromises = comprobacionesEnriquecidas
          .filter((comp: Comprobacion) => comp.type === 'factura') // Solo facturas
          .map(async (comp: Comprobacion) => {
            try {
              const response = await api.get(`/xml/comprobacion/${comp.id}`);
              return { id: comp.id, data: response.data };
            } catch (error) {
              return { id: comp.id, data: null };
            }
          });

        promises.push(...xmlPromises);

        // Ejecutar todas las promesas en paralelo
        const results = await Promise.all(promises);

        // Procesar resultados de opciones
        if (company) {
          const [categoriesResponse, taxCodes, rulesResponse, ...xmlResults] =
            results;

          const categoryOptions: SelectOption[] = (
            categoriesResponse.data?.data || []
          ).map((cat: { name: string; code: string }) => ({
            value: cat.name,
            label: cat.name,
          }));

          let taxCodesArray: any[] = [];
          if (
            taxCodes &&
            typeof taxCodes === 'object' &&
            Array.isArray((taxCodes as any).data)
          ) {
            taxCodesArray = (taxCodes as any).data;
          } else if (Array.isArray(taxCodes)) {
            taxCodesArray = taxCodes;
          }

          const taxIndicatorOptions: SelectOption[] = taxCodesArray.map(
            (taxCode: any) => ({
              value: taxCode.code?.name || '',
              label: taxCode.code?.name || '',
            }),
          );

          const distributionRuleOptions: SelectOption[] = (
            rulesResponse?.data || []
          ).map((rule: string) => ({
            value: rule,
            label: rule,
          }));

          setOptions({
            categoryOptions,
            taxIndicatorOptions,
            distributionRuleOptions,
          });

          // Procesar resultados de XML
          const xmlMap: Record<string, any> = {};
          xmlResults.forEach((result: any) => {
            if (result && result.id) {
              xmlMap[result.id] = result.data;
            }
          });
          setXmlDataMap(xmlMap);
        } else {
          // Si no hay empresa, solo procesar XML
          const xmlMap: Record<string, any> = {};
          results.forEach((result: any) => {
            if (result && result.id) {
              xmlMap[result.id] = result.data;
            }
          });
          setXmlDataMap(xmlMap);
        }

        setComprobaciones(comprobacionesEnriquecidas);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Error al cargar las comprobaciones';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]);

  return { comprobaciones, xmlDataMap, options, isLoading, error };
};
