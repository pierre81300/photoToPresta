import { Suspense } from 'react';
import ValidationContent from './ValidationContent';

export default async function ValidationPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Chargement...</div>
        </div>
      </div>
    }>
      <ValidationContent id={params.id} />
    </Suspense>
  );
} 