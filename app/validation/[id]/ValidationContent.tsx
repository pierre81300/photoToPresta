'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { prestationService, Prestation } from '../../services/prestationService';

type Category = 'femmes' | 'hommes' | 'enfants';
type PrestationType = 'prestation' | 'forfait';

export default function ValidationContent({ id }: { id: string }) {
  const router = useRouter();
  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [formData, setFormData] = useState({
    category: 'femmes' as Category,
    type: 'prestation' as PrestationType,
    name: '',
    price: '',
    startingPrice: false,
    duration: {
      hours: '00',
      minutes: '30'
    },
    description: '',
  });

  useEffect(() => {
    const loadPrestation = () => {
      try {
        console.log('Chargement de la prestation avec ID:', id);
        const prestations = prestationService.getPrestations();
        console.log('Toutes les prestations:', prestations);
        
        const foundPrestation = prestations.find(p => {
          console.log('Comparaison:', { prestationId: p.id, searchId: id, match: p.id === id });
          return p.id === id;
        });
        
        console.log('Prestation trouvée:', foundPrestation);
        
        if (foundPrestation) {
          setPrestation(foundPrestation);
          setFormData({
            category: foundPrestation.category,
            type: foundPrestation.type,
            name: foundPrestation.name,
            price: foundPrestation.price,
            startingPrice: foundPrestation.startingPrice,
            duration: foundPrestation.duration,
            description: foundPrestation.description || '',
          });
        } else {
          console.error('Prestation non trouvée');
          router.push('/');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la prestation:', error);
        router.push('/');
      }
    };

    loadPrestation();
  }, [id, router]);

  const handleValidate = () => {
    if (prestation) {
      console.log('Validation de la prestation:', prestation.id);
      const updatedPrestation: Prestation = {
        ...prestation,
        ...formData,
        status: 'active'
      };
      prestationService.updatePrestation(updatedPrestation);
      router.push('/');
      router.refresh();
    }
  };

  const handleReject = () => {
    if (prestation) {
      if (window.confirm('Êtes-vous sûr de vouloir refuser cette prestation ? Elle sera supprimée définitivement.')) {
        console.log('Rejet de la prestation:', prestation.id);
        prestationService.deletePrestation(prestation.id);
        console.log('Prestation rejetée et supprimée, redirection...');
        router.push('/');
        router.refresh();
      }
    }
  };

  const handleDelete = () => {
    if (prestation) {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ? Cette action est irréversible.')) {
        console.log('Suppression de la prestation:', prestation.id);
        prestationService.deletePrestation(prestation.id);
        router.push('/');
        router.refresh();
      }
    }
  };

  if (!prestation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Chargement...</div>
          <Link href="/" className="text-purple-600">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 pt-8">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 mr-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="ml-1">Retour</span>
            </Link>
            <div className="text-xl font-bold">Iléa</div>
          </div>
        </header>

        <h1 className="text-2xl font-semibold text-center mb-8">Validation de la prestation</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-6">
            {/* Formulaire de modification */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <div className="flex gap-4">
                  {['femmes', 'hommes', 'enfants'].map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={formData.category === cat}
                        onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                        className="sr-only"
                      />
                      <span className={`px-4 py-2 rounded-full ${
                        formData.category === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex gap-4">
                  {['prestation', 'forfait'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as PrestationType})}
                        className="sr-only"
                      />
                      <span className={`px-4 py-2 rounded-full ${
                        formData.type === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la prestation
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.startingPrice}
                      onChange={(e) => setFormData({...formData, startingPrice: e.target.checked})}
                      className="mr-2"
                    />
                    À partir de
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <span className="ml-2">€</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.duration.hours}
                    onChange={(e) => setFormData({
                      ...formData,
                      duration: { ...formData.duration, hours: e.target.value }
                    })}
                    className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <span>h</span>
                  <input
                    type="number"
                    value={formData.duration.minutes}
                    onChange={(e) => setFormData({
                      ...formData,
                      duration: { ...formData.duration, minutes: e.target.value }
                    })}
                    className="w-20 px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <span>min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
            </div>

            {prestation.photos && prestation.photos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {prestation.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-24">
          <button
            onClick={handleDelete}
            className="flex-1 py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-4 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={handleValidate}
            className="flex-1 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
} 