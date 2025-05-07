import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
import { setUserData } from '@/services/requestService';
import { useEffect } from 'react';

export const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    handleLogin,
  } = useLogin();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('Datos del usuario encontrados en localStorage:', user); // Depuración
      setUserData(JSON.parse(user));
    } else {
      console.log('No se encontraron datos del usuario en localStorage.'); // Depuración
    }
  }, []);

  const handleLoginWithUserData = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await handleLogin(e); // Pass the event object to handleLogin
      // console.log('User data after login:', user); // Debug log
      if (user) {
        setUserData(user); // Store user data globally
        // console.log('User data set successfully'); // Debug log
      }
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#02082C]'>
      <Card className='w-[90vw] max-w-4xl p-0'>
        <div className='flex w-full flex-col md:flex-row'>
          <div className='w-full md:w-1/2 flex flex-col items-start p-10 pt-4 space-y-6 justify-center'>
            <img
              src='/GrupoFG_Logo.png'
              alt='Grupo FG'
              className='h-40 w-40 mb-5'
            />
            <h1 className='text-2xl font-bold text-[#F34602]'>Inicia sesión</h1>
            <div className='flex items-center gap-2'>
              <span>¿No tienes cuenta?</span>
              <Link
                to='/register'
                className='text-[#F34602] hover:text-[#02082C] transition-colors duration-300'
              >
                Regístrate
              </Link>
            </div>

            {error && <p className='text-red-500'>{error}</p>}

            <form
              className='w-full flex flex-col space-y-6'
              onSubmit={handleLoginWithUserData}
            >
              <Input
                className='w-full'
                placeholder='Correo Electrónico'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                className='w-full'
                placeholder='Contraseña'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                type='submit'
                className='w-full rounded-[10px] bg-[#F34602] text-white hover:bg-[#02082C] transition-colors duration-300'
              >
                Iniciar sesión
              </Button>
            </form>
          </div>

          <div className='w-1/2 hidden md:block'>
            <img
              src='https://st.depositphotos.com/1629291/3390/i/950/depositphotos_33905299-stock-photo-electricians-in-blue-overalls-working.jpg'
              alt='Decoración'
              className='h-full w-full object-cover rounded-r-lg'
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
