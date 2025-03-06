'use client';

import React from 'react';

interface ResponseDisplayProps {
  response: string;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(response);
  } catch (error) {
    console.error('Erreur lors du parsing de la réponse:', error);
    return (
      <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Erreur l&apos;analyse de la réponse</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Prestations détectées</h2>
      <div className="space-y-4">
        {parsedResponse.prestations?.map((prestation: any, index: number) => (
          <div key={index} className="p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{prestation.name}</h3>
                <p className="text-sm text-gray-600">
                  {prestation.category} - {prestation.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{prestation.price}€</p>
                {prestation.startingPrice && (
                  <p className="text-sm text-gray-500">À partir de</p>
                )}
              </div>
            </div>
            {prestation.duration && (
              <p className="text-sm text-gray-600 mt-2">
                Durée : {prestation.duration.hours > 0 ? `${prestation.duration.hours}h` : ''} 
                {prestation.duration.minutes > 0 ? `${prestation.duration.minutes}min` : ''}
              </p>
            )}
            {prestation.description && (
              <p className="text-sm text-gray-600 mt-2">{prestation.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 