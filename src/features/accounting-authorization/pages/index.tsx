import Layout from '@/features/accounting-authorization/components/layout';
import CardAssignmentTable from '@/features/accounting-authorization/components/card-assignment-table';

export default function HomePage() {
  return (
    <Layout
      content={
        <div className='container mx-auto py-8 px-4'>
          <CardAssignmentTable />
        </div>
      }
    />
  );
}
