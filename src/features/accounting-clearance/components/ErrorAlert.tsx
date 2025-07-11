interface Props {
  message: string;
}

export const ErrorAlert = ({ message }: Props) => (
  <div
    className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
    role='alert'
  >
    <strong className='font-bold'>Error: </strong>
    <span className='block sm:inline'>{message}</span>
  </div>
);
