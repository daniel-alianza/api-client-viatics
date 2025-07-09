import type React from 'react';
import { motion } from 'framer-motion';
import { InputField } from '@/components/ui/input-field';
import { SelectField } from '@/components/ui/select-field';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import type { DocumentType } from '@/features/TravelExpense-Checks/interfaces/types';

export const ExpenseForm: React.FC = () => {
  const { expenseData, updateExpenseData, submitForm, isSubmitting } =
    useExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const documentTypeOptions = [
    { value: 'ticket', label: 'Ticket' },
    { value: 'factura', label: 'Factura' },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      className='bg-white rounded-lg shadow-lg p-6 md:p-8'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className='text-2xl font-bold mb-6 text-[#02082C]'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Comprobacion de Gastos de Viaje
      </motion.h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
        <InputField
          id='requestNumber'
          label='Numero de Solicitud'
          value={expenseData.requestNumber}
          onChange={value => updateExpenseData({ requestNumber: value })}
          required
          disabled={true}
        />

        <InputField
          id='company'
          label='Compañía'
          value={expenseData.company}
          onChange={value => updateExpenseData({ company: value })}
          required
          disabled={true}
        />

        <InputField
          id='bank'
          label='Banco'
          value={expenseData.bank}
          onChange={value => updateExpenseData({ bank: value })}
          required
          disabled={true}
        />

        <InputField
          id='transactionNumber'
          label='Movimiento / Transacción'
          value={expenseData.transactionNumber}
          onChange={value => updateExpenseData({ transactionNumber: value })}
          required
          disabled={true}
        />

        <InputField
          id='date'
          label='Fecha'
          type='date'
          value={expenseData.date}
          onChange={value => updateExpenseData({ date: value })}
          required
          disabled={true}
        />

        <InputField
          id='card'
          label='Tarjeta'
          value={expenseData.card}
          onChange={value => updateExpenseData({ card: value })}
          required
          disabled={true}
        />

        <InputField
          id='initialExpense'
          label='Gasto Inicial'
          type='number'
          value={expenseData.initialExpense}
          onChange={value =>
            updateExpenseData({ initialExpense: Number.parseFloat(value) || 0 })
          }
          required
          disabled={true}
        />

        <InputField
          id='totalToVerify'
          label='Total a Verificar'
          type='number'
          value={expenseData.totalToVerify}
          onChange={value =>
            updateExpenseData({ totalToVerify: Number.parseFloat(value) || 0 })
          }
          required
          disabled={true}
        />
      </div>

      <InputField
        id='description'
        label='Descripción'
        value={expenseData.description}
        onChange={value => updateExpenseData({ description: value })}
        required
        className='mt-2'
        disabled={true}
      />

      <div className='mt-4'>
        <SelectField
          id='documentType'
          label='Tipo de Documento'
          options={documentTypeOptions}
          value={expenseData.documentType}
          onChange={value =>
            updateExpenseData({ documentType: value as DocumentType })
          }
          required
          disabled={false}
        />
      </div>

      <FileUpload
        id='files'
        label='Subir Documentos'
        acceptedFileTypes={['xml', 'pdf']}
        files={expenseData.files}
        onChange={files => updateExpenseData({ files })}
        required
        className='mt-4'
        disabled={false}
      />

      <div className='mt-8 flex justify-end'>
        <Button type='submit' disabled={isSubmitting} size='lg'>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </motion.form>
  );
};
