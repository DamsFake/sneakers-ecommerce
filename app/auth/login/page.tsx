"use client"; // Marca este archivo como un Client Component

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token); // Guarda el token en localStorage
        if (user.role === 'admin') {
          router.push('/admin'); // Redirige al panel de administración
        } else {
          router.push('/user'); // Redirige a la vista de usuario
        }
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'El email es obligatorio' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'La contraseña es obligatoria' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <a href="/auth/register" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
