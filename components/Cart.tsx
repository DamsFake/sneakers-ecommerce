"use client"; // Asegúrate de que este archivo sea un Client Component

import { useState, useEffect } from 'react'; // Importa useEffect
import { useCart } from '../context/CartContext';
import { Transition } from '@headlessui/react';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar si el dropdown está abierto
  const [isAnimating, setIsAnimating] = useState(false); // Estado para controlar la animación del botón

  // Efecto para activar la animación cuando se agrega un producto
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 100); // Duración de la animación
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  return (
    <div className="fixed right-4 top-4 z-50">
      {/* Ícono del carrito con animación */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-transparent text-white px-4 py-2 rounded hover:bg-zinc-800 duration-700 ${
          isAnimating ? 'animate-shake' : ''
        } text-sm sm:text-base`}
      >
        🛒 Cart ({totalItems})
      </button>

      {/* Dropdown del carrito con animación */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-2 bg-gradient-to-bl from-neutral-900 to-zinc-600 shadow-lg rounded-lg w-80 sm:w-96 p-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Cart ({totalItems})</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p>${item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-500 text-xs sm:text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <button
                  onClick={clearCart}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </Transition>
    </div>
  );
}
