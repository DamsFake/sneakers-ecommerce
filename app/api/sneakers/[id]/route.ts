import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// GET: Obtener un sneaker por ID
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

// PUT: Actualizar un sneaker por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name, price, image_url, description } = await request.json();

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE sneakers SET name = $1, price = $2, image_url = $3, description = $4 WHERE id = $5 RETURNING *',
      [name, price, image_url, description, params.id]
    );
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el sneaker:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el sneaker' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un sneaker por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM sneakers WHERE id = $1', [params.id]);
    client.release();
    return NextResponse.json({ message: 'Sneaker eliminado' });
  } catch (error) {
    console.error('Error al eliminar el sneaker:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el sneaker' },
      { status: 500 }
    );
  }
}
