import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ExpenseFilterProps } from '../interfaces/expensefilterInterface';

export function ExpenseFilter({ onFilterChange }: ExpenseFilterProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Select defaultValue='all' onValueChange={onFilterChange}>
        <SelectTrigger className='bg-white/20 text-white hover:bg-white/30 transition-colors duration-300'>
          <SelectValue placeholder='Filtrar por estado' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todas las solicitudes</SelectItem>
          <SelectItem value='Pending'>Pendientes</SelectItem>
          <SelectItem value='Approved'>Aprobadas</SelectItem>
          <SelectItem value='Rejected'>Rechazadas</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
