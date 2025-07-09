import { useEffect } from 'react';
import {
  companyClientGroupMap,
  normalizeCompanyName,
  companyNameMap,
} from '@/helpers/companyMap';
import { UseCompanyAutoFillProps } from '../interfaces/CompanyAutoInterface';

export function useCompanyAutoFill({
  selectedCompany,
  companies,
  onDataChange,
}: UseCompanyAutoFillProps) {
  useEffect(() => {
    if (selectedCompany && selectedCompany !== 'all') {
      const companyObj = companies.find(
        c => c.id.toString() === selectedCompany,
      );
      if (companyObj) {
        const normalizedName = normalizeCompanyName(companyObj.name);
        const exactName = companyNameMap[normalizedName];
        if (exactName) {
          const map = companyClientGroupMap[exactName];
          if (map) {
            onDataChange({ clientNumber: map.cliente, groupNumber: map.grupo });
            return;
          }
        }
      }
    }

    onDataChange({ clientNumber: '', groupNumber: '' });
  }, [selectedCompany, companies]);
}
