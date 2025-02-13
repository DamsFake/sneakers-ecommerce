import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: Request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    request.user = decoded;

    // Verificar si el usuario es administrador
    if (request.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
