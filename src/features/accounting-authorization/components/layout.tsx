import type { ReactNode } from 'react';
import { CardAssignmentProvider } from '@/features/accounting-authorization/context/card-assignment-context';

interface LayoutProps {
  content: ReactNode;
  title?: string;
}

export default function Layout({
  content,
  title = 'Autorizaciones de Viaticos',
}: LayoutProps) {
  return (
    <CardAssignmentProvider>
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-[#F34602] text-white py-4 px-6 shadow-md'>
          <div className='container mx-auto'>
            <h1 className='text-2xl font-bold'>{title}</h1>
          </div>
        </header>
        <main>{content}</main>
      </div>
    </CardAssignmentProvider>
  );
}
