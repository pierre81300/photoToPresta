'use client';

import { useState } from 'react';
import PhotoSelector from './components/PhotoSelector';
import ResponseDisplay from './components/ResponseDisplay';
import { analyzePhotos, MistralError } from './services/mistralService';

// Prompt prédéfini à utiliser pour toutes les analyses (invisible pour l'utilisateur)
const DEFAULT_PROMPT = `Analyse cette image de flyer/document publicitaire et crée un tableau structuré des prestations de beauté avec les colonnes suivantes : "Nom de la prestation", "À partir de (0 ou 1)", "Prix (€)", "Durée (en minutes)", "Description".

Instructions précises :
1. Extraction fidèle : Extrais UNIQUEMENT les prestations visibles sur l'image, sans ajout ni omission.
2. Format des données :
   - Nom : Copie exacte du nom sur le flyer, sans reformulation
   - À partir de : 1 si prix minimum/fourchette, 0 si prix fixe
   - Prix : Uniquement le prix de départ en euros (le plus bas si fourchette)
   - Durée : Convertie en minutes (ex: 1h30 → 90), vide si non mentionnée
   - Description : Détails complémentaires (options, conditions, spécifications)
3. Cas spéciaux :
   - Prix fourchette (ex: "30€-50€") : Mettre 1 dans "À partir de", 30€ dans "Prix", et "Prix variable jusqu'à 50€" dans "Description"
   - Informations illisibles : Indiquer "Non spécifié" ou "Illisible"
   - Déclinaisons : Créer une ligne distincte pour chaque variante (ex: cheveux courts/longs)
4. Présentation :
   - Respecter l'ordre d'apparition des prestations sur le flyer
   - Conserver les catégories originales (Hommes, Femmes, etc.)
   - Ne pas deviner d'informations manquantes

Vérifie soigneusement que toutes les prestations sont correctement extraites avec leurs prix exacts avant de finaliser le tableau.`;

export default function Home() {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotosSelected = (photos: File[]) => {
    setSelectedPhotos(photos);
    // Réinitialiser la réponse et l'erreur lorsque de nouvelles photos sont sélectionnées
    setResponse(null);
    setError(null);
  };

  const handleAnalyzeClick = async () => {
    if (selectedPhotos.length === 0) {
      setError('Veuillez sélectionner au moins une photo');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await analyzePhotos(selectedPhotos, DEFAULT_PROMPT);
      setResponse(result.response);
    } catch (err) {
      const mistralError = err as MistralError;
      setError(mistralError.error || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analyse de Flyers avec Mistral AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sélectionnez des photos de flyers ou documents publicitaires et laissez Mistral AI extraire automatiquement un tableau structuré des prestations avec leurs prix et détails.
          </p>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              1. Sélectionnez vos photos
            </h2>
            <PhotoSelector onPhotosSelected={handlePhotosSelected} />
          </section>

          {selectedPhotos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                2. Analysez vos photos
              </h2>
              <div className="mb-6">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Analyse en cours...' : 'Analyser les photos'}
                </button>
              </div>
            </section>
          )}

          <ResponseDisplay response={response} isLoading={isLoading} error={error} />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Photo Analyzer - Propulsé par Mistral AI</p>
        </footer>
      </div>
    </div>
  );
}
