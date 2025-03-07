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

  const getCategoryIcon = () => {
    switch (prestation.category) {
      case 'femmes':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'hommes':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      case 'enfants':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-secondary text-primary">
            {getCategoryIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{prestation.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                prestation.status === 'pending' 
                  ? 'bg-warning bg-opacity-20 text-warning'
                  : 'bg-success bg-opacity-20 text-success'
              }`}>
                {prestation.status === 'pending' ? 'En attente' : 'Validée'}
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-80">
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
            className="text-primary hover:text-primary-hover text-sm transition-colors"
          >
            Modifier
          </Link>
          {prestation.status === 'active' && onDelete && (
            <button
              onClick={handleDelete}
              className="text-error text-sm hover:text-opacity-80 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 