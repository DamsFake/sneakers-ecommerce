"use client"; // Marca este archivo como un Client Component

// import Link from 'next/link';
import { useCart } from '../context/CartContext';

type Sneaker = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

type ProductCardProps = {
  sneaker: Sneaker;
};

export default function ProductCard({ sneaker }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <img src={sneaker.image_url} alt={sneaker.name} className="w-full h-48 object-cover mb-4 hover:rotate-6 hover:scale-200 transition-all duration-300" />
      <h2 className="text-xl font-semibold">{sneaker.name}</h2>
      <p className="text-gray-700">${sneaker.price}</p>
      <button
        onClick={() => addToCart(sneaker)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 duration-300"
      >
        Add to Cart
      </button>
      {/* <Link href={`/product/${sneaker.id}`}>
        <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
          View Details
        </button>           // CRASHEA AL DAR CLIC  !!!
      </Link>] */}
    </div>
  );
}
