'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoSelector from '../components/PhotoSelector';
import ResponseDisplay from '../components/ResponseDisplay';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { analyzePhotos } from '../services/mistralService';

export default function AnalysePage() {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!selectedPhotos.length) {
      setError('Veuillez sélectionner au moins une photo à analyser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzePhotos(selectedPhotos);
      setResponse(result.response);
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setError(error instanceof Error ? error.message : 'Une erreur inattendue est survenue lors de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-8 pb-24">
        <Header title="Analyse de flyer" showBackButton={true} backUrl="/" />
        
        <div className="mb-8">
          <PhotoSelector onPhotosSelected={setSelectedPhotos} />
          
          {error && (
            <div className="mt-4 p-4 bg-error bg-opacity-10 border border-error text-error rounded-lg" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading || selectedPhotos.length === 0}
              className={`btn ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyse en cours...
                </div>
              ) : 'Analyser'}
            </button>
          </div>
        </div>
        
        {response && <ResponseDisplay response={response} />}
        
        <BottomNav />
      </div>
    </div>
  );
} 