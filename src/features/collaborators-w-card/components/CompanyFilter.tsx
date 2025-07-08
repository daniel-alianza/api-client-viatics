import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Company } from '@/interfaces/infoInterface';

interface Props {
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  companies: Company[];
  disabled?: boolean;
}

export function CompanyFilter({
  selectedCompany,
  setSelectedCompany,
  companies,
  disabled = false,
}: Props) {
  return (
    <Select
      value={selectedCompany}
      onValueChange={setSelectedCompany}
      disabled={disabled || companies.length === 0}
    >
      <SelectTrigger className='border-[#F34602] text-[#F34602] min-w-[180px] cursor-pointer'>
        <SelectValue placeholder='Filtrar por compañía' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>Todas las compañías</SelectItem>
        {companies.map(company => (
          <SelectItem key={company.id} value={company.id.toString()}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
