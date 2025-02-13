"use client"; // Asegúrate de que este archivo sea un Client Component

import { useCart } from '../../../context/CartContext'; // Ruta corregida

type Sneaker = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

async function getSneaker(id: string) {
  const res = await fetch(`http://localhost:3000/api/sneakers/${id}`);
  if (!res.ok) {
    throw new Error('Error al obtener el sneaker');
  }
  return res.json();
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const sneaker: Sneaker = await getSneaker(params.id);
  const { addToCart } = useCart(); // Usa el hook useCart

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={sneaker.image_url} alt={sneaker.name} className="w-full rounded-lg shadow-lg" />
        <div>
          <h1 className="text-3xl font-bold mb-4">{sneaker.name}</h1>
          <p className="text-gray-700 mb-4">{sneaker.description}</p>
          <p className="text-2xl font-semibold mb-4">${sneaker.price}</p>
          <button
            onClick={() => addToCart(sneaker)} // Agrega el producto al carrito
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
