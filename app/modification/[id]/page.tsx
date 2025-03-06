'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { prestationService, Prestation } from '../../services/prestationService';

type Category = 'femmes' | 'hommes' | 'enfants';
type PrestationType = 'prestation' | 'forfait';

export default function ModificationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: 'femmes' as Category,
    type: 'prestation' as PrestationType,
    name: '',
    price: '',
    startingPrice: false,
    duration: {
      hours: '00',
      minutes: '35'
    },
    description: '',
    photos: [] as File[]
  });

  useEffect(() => {
    const prestation = prestationService.getPrestations().find(p => p.id === params.id);
    if (prestation) {
      setFormData({
        category: prestation.category,
        type: prestation.type,
        name: prestation.name,
        price: prestation.price,
        startingPrice: prestation.startingPrice,
        duration: prestation.duration,
        description: prestation.description,
        photos: [] // On ne peut pas récupérer les photos existantes car elles sont en base64
      });
    }
  }, [params.id]);

  const handleCategoryChange = (category: Category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleTypeChange = (type: PrestationType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, e.target.files![0]]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir les photos en base64
    const photoPromises = formData.photos.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const photoUrls = await Promise.all(photoPromises);
      
      // Mettre à jour la prestation
      const updatedPrestation: Prestation = {
        id: params.id,
        category: formData.category,
        type: formData.type,
        name: formData.name,
        price: formData.price,
        startingPrice: formData.startingPrice,
        duration: formData.duration,
        description: formData.description,
        photos: photoUrls
      };

      // Sauvegarder la prestation
      prestationService.updatePrestation(updatedPrestation);
      
      // Rediriger vers la page des prestations
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 pt-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/" className="mr-4 text-purple-600">
              <span className="text-purple-600">Retour</span>
            </Link>
            <Image src="/ilea.png" alt="Iléa" width={80} height={40} />
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </header>

        <h1 className="text-2xl font-semibold text-center mb-8">Modifier la prestation</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-lg mb-4">Catégorie</h2>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="femmes"
                  checked={formData.category === 'femmes'}
                  onChange={() => handleCategoryChange('femmes')}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-full ${
                  formData.category === 'femmes' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Femmes
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="hommes"
                  checked={formData.category === 'hommes'}
                  onChange={() => handleCategoryChange('hommes')}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-full ${
                  formData.category === 'hommes' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Hommes
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="enfants"
                  checked={formData.category === 'enfants'}
                  onChange={() => handleCategoryChange('enfants')}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-full ${
                  formData.category === 'enfants' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Enfants
                </span>
              </label>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm p-6">
            <h2 className="text-lg mb-4">Type de prestation</h2>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="prestation"
                  checked={formData.type === 'prestation'}
                  onChange={() => handleTypeChange('prestation')}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-full ${
                  formData.type === 'prestation' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Prestation
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="forfait"
                  checked={formData.type === 'forfait'}
                  onChange={() => handleTypeChange('forfait')}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-full ${
                  formData.type === 'forfait' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Forfait
                </span>
              </label>
            </div>
          </section>

          <div className="space-y-4">
            <div>
              <label className="block text-lg mb-2">
                Nom de la prestation ou du forfait
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Ex: Coupe femme"
              />
            </div>

            <div>
              <label className="block text-lg mb-2">Prix</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.startingPrice}
                    onChange={e => setFormData({...formData, startingPrice: e.target.checked})}
                    className="mr-2"
                  />
                  À partir de
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-20 px-4 py-2 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="ml-2">€</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg mb-2">Durée de prestation</label>
              <div className="bg-purple-50 rounded-full p-2 flex justify-between">
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    value={formData.duration.hours}
                    onChange={e => setFormData({
                      ...formData,
                      duration: {...formData.duration, hours: e.target.value}
                    })}
                    className="w-16 bg-transparent text-center"
                    min="0"
                    max="23"
                  />
                  <span>h</span>
                </div>
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    value={formData.duration.minutes}
                    onChange={e => setFormData({
                      ...formData,
                      duration: {...formData.duration, minutes: e.target.value}
                    })}
                    className="w-16 bg-transparent text-center"
                    min="0"
                    max="59"
                  />
                  <span>min</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={4}
                placeholder="Ex: Coupe femme pour faire jalouser les copines"
              />
            </div>

            <div>
              <label className="block text-lg mb-2">Galerie photo de la prestation</label>
              <div className="space-y-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        photos: formData.photos.filter((_, i) => i !== index)
                      })}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById('photo-input')?.click()}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:border-purple-500 hover:text-purple-500"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter plus de photos
                </button>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors mt-8 mb-24"
          >
            Enregistrer les modifications
          </button>
        </form>

        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <Link href="/calendrier" className="flex flex-col items-center p-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs mt-1">Calendrier</span>
              </Link>

              <Link href="/rdv" className="flex flex-col items-center p-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs mt-1">RDV en attente</span>
              </Link>

              <Link href="/" className="flex flex-col items-center p-2 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs mt-1">Prestations</span>
              </Link>

              <Link href="/clients" className="flex flex-col items-center p-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-xs mt-1">Clients</span>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 