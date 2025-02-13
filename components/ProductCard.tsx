import Link from 'next/link';
// import { Button } from "./ui/button"


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
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <img src={sneaker.image_url} alt={sneaker.name} className="w-full h-48 object-cover mb-4 hover:rotate-6 hover:scale-110 transition-all duration-300"/>
      <h2 className="text-xl font-semibold">{sneaker.name}</h2>
      <p className="text-gray-700">${sneaker.price}</p>
      <Link href={`/product/${sneaker.id}`}>
        <button className="btn relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-gray-900 rounded hover:bg-gray-600 group py-1.5 px-2.5">
          View Details
        </button>
      </Link>
    </div>
  );
}
