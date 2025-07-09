import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { getTaxCodes } from '@/services/TaxcodeService';
import { getFactorDescriptions } from '@/services/distribrepService';
import { SelectOption } from '../interfaces/comprobacionestable.Interface';

export const useOptions = (company: string) => {
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [taxIndicatorOptions, setTaxIndicatorOptions] = useState<
    SelectOption[]
  >([]);
  const [distributionRuleOptions, setDistributionRuleOptions] = useState<
    SelectOption[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesResponse, taxCodes, rulesResponse] = await Promise.all(
          [
            api.get('/wholesale-accounts', { params: { empresa: company } }),
            getTaxCodes(company),
            getFactorDescriptions(),
          ],
        );

        setCategoryOptions(
          (categoriesResponse.data?.data || []).map(
            (cat: { name: string; code: string }) => ({
              value: cat.name,
              label: cat.name,
            }),
          ),
        );

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
        setTaxIndicatorOptions(
          taxCodesArray.map((taxCode: any) => ({
            value: taxCode.code?.name || '',
            label: taxCode.code?.name || '',
          })),
        );

        setDistributionRuleOptions(
          (rulesResponse?.data || []).map((rule: string) => ({
            value: rule,
            label: rule,
          })),
        );
      } catch (error) {
        console.error('Error al cargar opciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [company]);

  return {
    categoryOptions,
    taxIndicatorOptions,
    distributionRuleOptions,
    isLoading,
  };
};
