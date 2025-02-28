import React from 'react';

interface ResponseDisplayProps {
  response: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResponseDisplay({ response, isLoading, error }: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Analyse en cours...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 p-6 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Erreur</h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  // Fonction pour formater le texte avec support pour les tableaux et listes
  const formatText = (text: string): React.ReactNode[] => {
    // Détection des tableaux (lignes contenant plusieurs | )
    const lines = text.split('\n');
    const formattedLines: React.ReactNode[] = [];
    let inTable = false;
    let tableContent: string[] = [];
    let tableHeaders: string[] = [];
    let hasTableHeaders = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Détection de tableau
      if (line.includes('|')) {
        if (!inTable) {
          inTable = true;
          tableContent = [];
          tableHeaders = [];
          hasTableHeaders = false;
        }
        
        // Ignorer les lignes de séparation (contenant principalement des tirets)
        if (line.replace(/\|/g, '').trim().replace(/-/g, '').trim() === '') {
          // C'est une ligne de séparation, la ligne précédente contient probablement des en-têtes
          if (tableContent.length > 0) {
            tableHeaders = tableContent[tableContent.length - 1].split('|').map(cell => cell.trim());
            hasTableHeaders = true;
          }
          continue;
        }
        
        tableContent.push(line);
        
        // Si c'est la dernière ligne ou la ligne suivante n'est pas un tableau
        if (i === lines.length - 1 || !lines[i + 1].includes('|')) {
          formattedLines.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {hasTableHeaders && (
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      {tableHeaders.filter(header => header !== '').map((header, headerIndex) => (
                        <th key={headerIndex} className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tableContent.map((row, rowIndex) => {
                    // Ignorer la ligne d'en-tête si elle a été détectée
                    if (hasTableHeaders && rowIndex === tableContent.length - 2) {
                      return null;
                    }
                    
                    const cells = row.split('|').filter((_, index, array) => 
                      // Garder les cellules vides à l'intérieur du tableau, mais pas celles aux extrémités
                      index > 0 && index < array.length - 1 || array[index].trim() !== ''
                    );
                    
                    return (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                        {cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
        }
      } 
      // Détection de liste (lignes commençant par - ou * ou 1.)
      else if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        formattedLines.push(
          <li key={i} className="ml-6 text-gray-700 dark:text-gray-300">
            {line.replace(/^\s*[-*]\s+/, '').replace(/^\s*\d+\.\s+/, '')}
          </li>
        );
      } 
      // Paragraphe normal
      else if (line !== '') {
        formattedLines.push(
          <p key={i} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
            {line}
          </p>
        );
      }
    }

    return formattedLines;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16">
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Résultat de l'analyse</h3>
        <div className="prose dark:prose-invert max-w-none max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {formatText(response)}
        </div>
      </div>
    </div>
  );
} 