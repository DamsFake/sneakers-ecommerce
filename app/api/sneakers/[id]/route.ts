import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM sneakers WHERE id = $1', [params.id]);
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sneaker no encontrado' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el sneaker:', error);
    return NextResponse.json(
      { error: 'Error al obtener el sneaker' },
      { status: 500 }
    );
  }
}
