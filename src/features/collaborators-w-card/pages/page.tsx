import CollaboratorTable from '@/features/collaborators-w-card/components/CollaboratorTable';
import { CollaboratorProvider } from '@/features/collaborators-w-card/context/CollaboratorContext';
import Navbar from '@/features/collaborators-w-card/components/navbar';
export default function Home() {
  return (
    <main className='min-h-screen bg-white'>
      <Navbar />
      <div className='max-w-6xl mx-auto mt-8 px-8'>
        <div className='bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(243,70,2,0.3)]'>
          <div className='bg-[#F34602] p-6 w-full'>
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
