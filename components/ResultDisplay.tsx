
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, ClipboardCheckIcon, SparklesIcon } from './icons';

interface ResultDisplayProps {
  result: string;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
    <SparklesIcon className="w-12 h-12 text-indigo-400 animate-pulse" />
    <p className="text-lg font-semibold">AI is analyzing...</p>
    <p className="text-sm text-center">This may take a few moments.</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
    <SparklesIcon className="w-16 h-16" />
    <h3 className="text-xl font-bold text-gray-300">Analysis Result</h3>
    <p className="text-center">Your AI-powered analysis will appear here.</p>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
    }
  };

  const formattedResult = result.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-4 mb-2 text-indigo-300">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-5 mb-3 text-indigo-300">{line.substring(2)}</h1>;
    }
    if (line.startsWith('* ')) {
      return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
     if (line.startsWith('- ')) {
      return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
    }
    return <p key={index} className="my-1">{line}</p>;
  });


  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex-1 flex flex-col h-full min-h-[300px] lg:min-h-0">
      <div className="relative flex-grow flex items-center justify-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : result ? (
          <div className="w-full h-full overflow-y-auto pr-4">
             <div className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 max-w-none">
              {formattedResult}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}

        {result && !isLoading && (
          <button 
            onClick={handleCopy}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Copy result to clipboard"
          >
            {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};
