'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prestationService, Prestation } from './services/prestationService';
import PrestationCard from './components/PrestationCard';

export default function Home() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'femmes' | 'hommes' | 'enfants'>('femmes');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadPrestations();
    window.addEventListener('storage', loadPrestations);
    return () => window.removeEventListener('storage', loadPrestations);
  }, []);

  const loadPrestations = useCallback(() => {
    const allPrestations = prestationService.getPrestations();
    console.log('Chargement des prestations:', allPrestations);
    setPrestations(allPrestations);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log('Suppression de la prestation:', id);
    prestationService.deletePrestation(id);
    loadPrestations();
  }, [loadPrestations]);

  const filteredPrestations = prestations
    .filter(p => p.category === selectedCategory)
    .filter(p => !showPendingOnly || p.status === 'pending');

  const handleCategoryChange = useCallback((category: 'femmes' | 'hommes' | 'enfants') => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 pt-8 pb-24">
        <header className="flex justify-between items-center mb-8">
          <Image src="/ilea.png" alt="Iléa" width={80} height={40} />
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src="/avatar.png" alt="Avatar" width={32} height={32} />
          </div>
        </header>

        <h1 className="text-2xl font-semibold mb-6">Mes prestations</h1>

        <div className="flex gap-2 mb-6">
          {['femmes', 'hommes', 'enfants'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category as typeof selectedCategory)}
              className={`px-6 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-white text-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-600"
          >
            <span className="font-medium">Prestations</span>
            <svg className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className="flex gap-4">
            <Link
              href="/creation"
              className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              aria-label="Créer une prestation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            <Link
              href="/analyse"
              className="bg-white text-purple-600 px-4 py-1 rounded-full border border-purple-600 hover:bg-purple-50 transition-colors text-sm flex items-center"
            >
              Analyser un flyer
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <label className="flex items-center text-gray-600">
            <input
              type="checkbox"
              checked={showPendingOnly}
              onChange={(e) => setShowPendingOnly(e.target.checked)}
              className="mr-2 text-purple-600 rounded"
            />
            Afficher uniquement les prestations en attente
          </label>
        </div>

        <div className="space-y-3">
          {filteredPrestations.length > 0 ? (
            filteredPrestations.map((prestation) => (
              <PrestationCard
                key={`${prestation.id}-${prestation.name}`}
                prestation={prestation}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucune prestation trouvée dans cette catégorie.
            </p>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
                <span className="text-xs mt-1">RDV</span>
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
        </nav>
      </div>
    </div>
  );
}
