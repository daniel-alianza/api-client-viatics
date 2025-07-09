import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExpenseSearchProps } from '../interfaces/expenseSearchInterface';

export function ExpenseSearch({ onSearch }: ExpenseSearchProps) {
  return (
    <motion.div
      className='relative'
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-white/70' />
      <Input
        type='search'
        placeholder='Buscar por nombre, ID o compañía...'
        className='bg-white/20 pl-9 text-white placeholder:text-white/70 focus:bg-white/30 transition-all duration-300 focus:shadow-md'
        onChange={e => onSearch(e.target.value)}
      />
    </motion.div>
  );
}
