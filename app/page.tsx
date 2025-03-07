'use client';

import { useState, useEffect, useCallback } from 'react';
import { prestationService, Prestation } from './services/prestationService';
import PrestationCard from './components/PrestationCard';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ActionButtons from './components/ActionButtons';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-8 pb-24">
        <Header title="Iléa" />

        <h1 className="text-2xl font-semibold mb-6">Mes prestations</h1>

        <div className="flex gap-2 mb-6">
          {['femmes', 'hommes', 'enfants'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category as typeof selectedCategory)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-card text-foreground'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-foreground"
          >
            <span className="font-medium">Prestations</span>
            <svg className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="card mb-6">
          <label className="flex items-center text-card-foreground">
            <input
              type="checkbox"
              checked={showPendingOnly}
              onChange={(e) => setShowPendingOnly(e.target.checked)}
              className="mr-2 text-primary rounded"
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
            <div className="card text-center py-6">
              <p className="text-card-foreground opacity-70">
                Aucune prestation trouvée dans cette catégorie.
              </p>
            </div>
          )}
        </div>
        
        <ActionButtons />
        
        <BottomNav />
      </div>
    </div>
  );
}
