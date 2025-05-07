import CollaboratorTable from '@/features/collaborators-w-card/components/CollaboratorTable';
import { CollaboratorProvider } from '@/features/collaborators-w-card/context/CollaboratorContext';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-950 to-[#0A1A4D] p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(243,70,2,0.3)]'>
          <div className='bg-[#F34602] p-6'>
            <h1 className='text-2xl font-bold text-white'>
              Asignacion de Tarjetas
            </h1>
            <p className='text-orange-100 mt-2'>
              Asignacion de tarjetas a colaboradores
            </p>
          </div>
          <div className='p-6'>
            <CollaboratorProvider>
              <CollaboratorTable />
            </CollaboratorProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
