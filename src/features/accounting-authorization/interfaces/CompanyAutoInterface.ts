export interface UseCompanyAutoFillProps {
  selectedCompany: string;
  companies: { id: number | string; name: string }[];
  onDataChange: (data: { clientNumber?: string; groupNumber?: string }) => void;
}
