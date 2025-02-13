import ProductCard from '../components/ProductCard';
// import { Button } from "@/components/ui/button"
// import { useCart } from "@/hooks/useCart"

type Sneaker = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

async function getSneakers() {
  const res = await fetch('http://localhost:3000/api/sneakers');
  if (!res.ok) {
    throw new Error('Error al obtener los sneakers');
  }
  return res.json();
}

export default async function Home() {
  const sneakers: Sneaker[] = await getSneakers()

  return (
    <div className="container mx-auto px-4">
      <div className="my-8">
      <img src="/images/logo.jpg" alt="Logo" className="rounded-full mx-auto w-32 h-32 hover:rotate-6 hover:scale-110 transition-all duration-300"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <nav></nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sneakers.map((sneaker) => (
          <ProductCard key={sneaker.id} sneaker={sneaker} />
        ))}
      </div>
    </div>
  );
}
