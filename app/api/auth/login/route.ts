import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
