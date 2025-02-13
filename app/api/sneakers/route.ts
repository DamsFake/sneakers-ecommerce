import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// GET: Listar todos los sneakers
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

// POST: Crear un nuevo sneaker
export async function POST(request: Request) {
  const { name, price, image_url, description } = await request.json();

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO sneakers (name, price, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, image_url, description]
    );
    client.release();
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al agregar el sneaker:', error);
    return NextResponse.json(
      { error: 'Error al agregar el sneaker' },
      { status: 500 }
    );
  }
}
