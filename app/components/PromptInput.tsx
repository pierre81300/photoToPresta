import { useState, useEffect } from 'react';

interface PromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  isLoading: boolean;
  initialPrompt?: string;
  onPromptChange?: (prompt: string) => void;
}

export default function PromptInput({ 
  onPromptSubmit, 
  isLoading, 
  initialPrompt = '', 
  onPromptChange 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState<string>(initialPrompt);

  // Mettre à jour le prompt local lorsque initialPrompt change
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-2">
        <label htmlFor="prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Votre question à propos des photos
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Exemple: Décris ces photos et donne-moi des informations sur ce qu'elles représentent."
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[100px]"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className={`mt-4 py-2 px-6 rounded-lg font-medium transition-colors w-full ${
          !prompt.trim() || isLoading
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading ? 'Traitement en cours...' : 'Analyser les photos'}
      </button>
    </form>
  );
} 