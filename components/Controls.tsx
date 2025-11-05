
import React, { useCallback, useRef } from 'react';
import { AnalysisMode, AnalysisType } from '../types';
import { PaperPlaneIcon, SummaryIcon, TopicsIcon, SentimentIcon, VideoIcon } from './icons';

interface ControlsProps {
  transcript: string;
  setTranscript: (value: string) => void;
  customPrompt: string;
  setCustomPrompt: (value: string) => void;
  onAnalyze: (type: AnalysisType) => void;
  isLoading: boolean;
  error: string | null;
  analysisMode: AnalysisMode;
  setAnalysisMode: (mode: AnalysisMode) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
}

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  Icon: React.ElementType;
  text: string;
}> = ({ onClick, disabled, Icon, text }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
  >
    <Icon className="w-5 h-5" />
    <span className="font-semibold">{text}</span>
  </button>
);

const TabButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'border-b-2 border-indigo-500 text-white'
        : 'border-b-2 border-transparent text-gray-400 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export const Controls: React.FC<ControlsProps> = ({
  transcript,
  setTranscript,
  customPrompt,
  setCustomPrompt,
  onAnalyze,
  isLoading,
  error,
  analysisMode,
  setAnalysisMode,
  videoFile,
  setVideoFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  }, [setVideoFile]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex flex-col gap-6 h-full">
      <div className="flex border-b border-gray-700">
        <TabButton isActive={analysisMode === 'transcript'} onClick={() => setAnalysisMode('transcript')}>
          Transcript Analysis
        </TabButton>
        <TabButton isActive={analysisMode === 'video'} onClick={() => setAnalysisMode('video')}>
          Video Analysis
        </TabButton>
      </div>

      {analysisMode === 'transcript' ? (
        <div>
          <label htmlFor="transcript" className="block text-lg font-semibold mb-2 text-gray-200">
            Paste Transcript Here
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Copy and paste the full transcript of the YouTube video..."
            className="w-full h-48 md:h-64 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
          />
        </div>
      ) : (
        <div>
           <label className="block text-lg font-semibold mb-2 text-gray-200">
            Upload Video
          </label>
          <div
            onClick={triggerFileSelect}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full h-48 md:h-64 p-4 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-colors duration-200"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            {videoFile ? (
              <div className='text-center'>
                 <VideoIcon className="w-12 h-12 mb-2 text-green-500" />
                <p className='font-semibold text-gray-200'>Selected: {videoFile.name}</p>
                <p className='text-sm'>(Click or drop another file to replace)</p>
              </div>
            ) : (
              <div className='text-center'>
                <VideoIcon className="w-12 h-12 mb-2" />
                <p className='font-semibold'>Click to upload or drag & drop</p>
                <p className='text-sm'>Maximum file size: 2GB</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">{error}</div>}

      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold text-gray-200">Choose an Analysis</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton onClick={() => onAnalyze('summary')} disabled={isLoading} Icon={SummaryIcon} text="Summarize" />
          <ActionButton onClick={() => onAnalyze('key_topics')} disabled={isLoading} Icon={TopicsIcon} text="Key Topics" />
          <ActionButton onClick={() => onAnalyze('sentiment')} disabled={isLoading} Icon={SentimentIcon} text="Sentiment" />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <label htmlFor="custom-prompt" className="block text-lg font-semibold text-gray-200">
          Or, Use a Custom Prompt
        </label>
        <div className="flex items-center gap-3">
          <input
            id="custom-prompt"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'What are the main arguments?'"
            className="flex-grow p-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
          <button
            onClick={() => onAnalyze('custom')}
            disabled={isLoading}
            className="p-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
            aria-label="Analyze with custom prompt"
          >
            <PaperPlaneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};