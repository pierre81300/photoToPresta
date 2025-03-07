'use client';

import React from 'react';
import Link from 'next/link';

export default function ActionButtons() {
  return (
    <div className="fixed bottom-20 right-6 flex flex-col gap-3">
      <Link
        href="/analyse"
        className="bg-card text-primary px-4 py-2 rounded-full border border-primary shadow-md hover:bg-secondary transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 14h.01M9 14h.01M15 8h.01M9 8h.01M4.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11A1.5 1.5 0 014.5 5z" />
        </svg>
        Analyser un flyer
      </Link>
      
      <Link
        href="/creation"
        className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-primary-hover transition-colors"
        aria-label="Créer une prestation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
} 