'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Prestation } from '../services/prestationService';

interface PrestationCardProps {
  prestation: Prestation;
  onDelete?: (id: string) => void;
}

export default function PrestationCard({ prestation, onDelete }: PrestationCardProps) {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ? Cette action est irréversible.')) {
      onDelete?.(prestation.id);
    }
  }, [onDelete, prestation.id]);

  const getDurationText = () => {
    const hasHours = prestation.duration.hours && prestation.duration.hours !== '0' && prestation.duration.hours !== '00';
    const hasMinutes = prestation.duration.minutes && prestation.duration.minutes !== '0' && prestation.duration.minutes !== '00';
    
    if (!hasHours && !hasMinutes) return '';
    if (hasHours && !hasMinutes) return `${prestation.duration.hours}h`;
    if (!hasHours && hasMinutes) return `${prestation.duration.minutes}min`;
    return `${prestation.duration.hours}h${prestation.duration.minutes}min`;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{prestation.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                prestation.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {prestation.status === 'pending' ? 'En attente' : 'Validée'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>{prestation.price}€{prestation.startingPrice ? ' (à partir de)' : ''}</span>
              {getDurationText() && (
                <>
                  <span>-</span>
                  <span>{getDurationText()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/validation/${prestation.id}`}
            className="text-purple-600 text-sm hover:underline"
          >
            Modifier
          </Link>
          {prestation.status === 'active' && onDelete && (
            <button
              onClick={handleDelete}
              className="text-red-600 text-sm hover:underline"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 