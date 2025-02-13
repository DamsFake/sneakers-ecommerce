"use client"; // Marca este archivo como un Client Component

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';


type Sneaker = {
  id?: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
};

export default function AdminPage() {
  const { register, handleSubmit, reset, setValue } = useForm<Sneaker>();
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [editingSneaker, setEditingSneaker] = useState<Sneaker | null>(null);

  // Cargar la lista de sneakers al iniciar
  useEffect(() => {
    fetchSneakers();
  }, []);

  // Función para cargar los sneakers desde la API
  const fetchSneakers = async () => {
    try {
      const response = await fetch('/api/sneakers');
      const data = await response.json();
      setSneakers(data);
    } catch (error) {
      console.error('Error al cargar los sneakers:', error);
    }
  };

  // Función para manejar el envío del formulario (agregar/editar)
  const onSubmit: SubmitHandler<Sneaker> = async (data) => {
    try {
      const url = editingSneaker
        ? `/api/sneakers/${editingSneaker.id}` // Editar
        : '/api/sneakers'; // Agregar
      const method = editingSneaker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchSneakers(); // Recargar la lista de sneakers
        reset(); // Limpiar el formulario
        setEditingSneaker(null); // Salir del modo edición
      } else {
        alert('Error al guardar el sneaker');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  // Función para editar un sneaker
  const handleEdit = (sneaker: Sneaker) => {
    setEditingSneaker(sneaker);
    setValue('name', sneaker.name);
    setValue('price', sneaker.price);
    setValue('image_url', sneaker.image_url);
    setValue('description', sneaker.description);
  };

  // Función para eliminar un sneaker
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sneakers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSneakers(); // Recargar la lista de sneakers
      } else {
        alert('Error al eliminar el sneaker');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 ">Panel de Administración</h1>

      {/* Formulario para agregar/editar sneakers */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              {...register('name', { required: 'El nombre es obligatorio' })}
              className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 duration-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 duration-700">Precio</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'El precio es obligatorio' })}
              className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 duration-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
            <input
              type="text"
              {...register('image_url', { required: 'La URL de la imagen es obligatoria' })}
              className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 duration-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              {...register('description')}
              className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 duration-700"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 duration-700"
        >
          {editingSneaker ? 'Actualizar Sneaker' : 'Agregar Sneaker'}
        </button>
        {editingSneaker && (
          <button
            type="button"
            onClick={() => {
              reset();
              setEditingSneaker(null);
            }}
            className="mt-4 ml-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 duration-700"
          >
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Lista de sneakers */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Lista de Sneakers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> {/*AQUÍ PODEMOS MANIPULAR CUANTOS SNEAKERS QUEREMOS VER !!!*/}
          {sneakers.map((sneaker) => (
            <div key={sneaker.id} className="border p-4 rounded-lg shadow-lg">
              <img src={sneaker.image_url} alt={sneaker.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-semibold">{sneaker.name}</h3>
              <p className="text-gray-700">${sneaker.price}</p>
              <p className="text-sm text-gray-600">{sneaker.description}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(sneaker)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sneaker.id!)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
