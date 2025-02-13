import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM sneakers');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los sneakers:', error);
    return NextResponse.json(
      { error: 'Error al obtener los sneakers' },
      { status: 500 }
    );
  }
}
