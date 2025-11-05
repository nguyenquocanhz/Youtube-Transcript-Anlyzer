
import React from 'react';
import { YoutubeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="p-4 border-b border-gray-700/50">
      <div className="container mx-auto flex items-center gap-4">
        <YoutubeIcon className="w-10 h-10 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Transcript &amp; Video Analyzer
          </h1>
          <p className="text-sm text-gray-400">
            Get instant insights from YouTube transcripts &amp; videos
          </p>
        </div>
      </div>
    </header>
  );
};
