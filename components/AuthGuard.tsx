"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children, role }: { children: React.ReactNode; role?: string }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else if (role === 'admin') {
      // Verifica si el usuario es administrador
      const user = JSON.parse(atob(token.split('.')[1]));
      if (user.role !== 'admin') {
        router.push('/user');
      }
    }
  }, [router, role]);

  return <>{children}</>;
}
