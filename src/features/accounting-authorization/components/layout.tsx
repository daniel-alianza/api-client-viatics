import type { ReactNode } from 'react';
import { CardAssignmentProvider } from '@/features/accounting-authorization/context/card-assignment-context';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  content: ReactNode;
  title?: string;
}

export default function Layout({ content }: LayoutProps) {
  const navigate = useNavigate();
  return (
    <CardAssignmentProvider>
      <div className='min-h-screen bg-gray-50'>
        <header className='relative z-10 px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
          <div className='flex items-center'>
            <div
              className='relative w-12 h-12 cursor-pointer group'
              onClick={() => navigate('/dashboard')}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <ArrowLeft
                  className='h-8 w-8 text-[#02082C] transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1'
                  strokeWidth={2}
                />
              </div>
            </div>
            <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
              Portal Grupo FG{' '}
            </h1>
          </div>
        </header>
        <main>{content}</main>
      </div>
    </CardAssignmentProvider>
  );
}
