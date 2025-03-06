import Link from 'next/link';

export default function AnalyseButton() {
  return (
    <Link 
      href="/analyse"
      className="flex items-center justify-center w-full p-4 mb-4 text-base font-medium text-gray-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors duration-200"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
        />
      </svg>
      Analyser un flyer
    </Link>
  );
} 