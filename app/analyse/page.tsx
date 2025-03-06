'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhotoSelector from '../components/PhotoSelector';
import ResponseDisplay from '../components/ResponseDisplay';
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
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 mr-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="ml-1">Retour</span>
        </Link>
        <h1 className="text-2xl font-bold">Analyse de flyer</h1>
      </div>
      
      <PhotoSelector onPhotosSelected={setSelectedPhotos} />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || selectedPhotos.length === 0}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Analyse en cours...' : 'Analyser'}
        </button>
      </div>
      {response && <ResponseDisplay response={response} />}
    </div>
  );
} 