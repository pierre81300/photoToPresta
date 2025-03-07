'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  backUrl?: string;
}

export default function Header({ showBackButton = false, title = "Iléa", backUrl = "/" }: HeaderProps) {
  const { theme } = useTheme();
  
  return (
    <header className="flex justify-between items-center py-4 mb-6">
      <div className="flex items-center">
        {showBackButton && (
          <Link href={backUrl} className="flex items-center text-primary hover:text-primary-hover mr-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="ml-1">Retour</span>
          </Link>
        )}
        <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
          {title}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
} 