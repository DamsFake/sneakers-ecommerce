import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function POST(request: Request) {
  const { email, password, role = 'user' } = await request.json();

  try {
    const client = await pool.connect();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );
    client.release();

    const user = result.rows[0];
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
