
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeTranscript, analyzeVideo } from './services/geminiService';
import { AnalysisType, AnalysisMode } from './types';

export default function App() {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('transcript');
  const [transcript, setTranscript] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (type: AnalysisType) => {
    if (analysisMode === 'transcript' && !transcript.trim()) {
      setError('Please paste a transcript first.');
      return;
    }
    if (analysisMode === 'video' && !videoFile) {
        setError('Please upload a video file first.');
        return;
    }
    if (type === 'custom' && !customPrompt.trim()) {
      setError('Please enter a custom prompt to continue.');
      return;
    }

    setIsLoading(true);
    setResult('');
    setError(null);

    let analysisPrompt = '';
    const target = analysisMode === 'video' ? 'video' : 'transcript';

    switch (type) {
      case 'summary':
        analysisPrompt = `Provide a concise, easy-to-read summary of the following YouTube ${target}. The summary should capture the main points and key takeaways in a few bullet points or a short paragraph.`;
        break;
      case 'key_topics':
        analysisPrompt = `List the key topics and main ideas discussed in the following YouTube ${target}. Use a clear, structured format like bullet points.`;
        break;
      case 'sentiment':
        analysisPrompt = `Analyze the sentiment of the following YouTube ${target}. Describe the overall tone (e.g., positive, negative, neutral, enthusiastic, critical) and identify any significant shifts in sentiment. Provide specific examples or quotes to support your analysis.`;
        break;
      case 'custom':
        analysisPrompt = customPrompt;
        break;
    }

    try {
      let analysis = '';
      if (analysisMode === 'transcript') {
        const fullPrompt = `${analysisPrompt}\n\n---\n\nTRANSCRIPT:\n\n${transcript}`;
        analysis = await analyzeTranscript(fullPrompt);
      } else if (videoFile) {
        analysis = await analyzeVideo(analysisPrompt, videoFile);
      }
      setResult(analysis);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred during analysis: ${errorMessage}. Please try again.`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, customPrompt, analysisMode, videoFile]);
  
  const handleSetAnalysisMode = (mode: AnalysisMode) => {
      setAnalysisMode(mode);
      setError(null); // Clear errors when switching modes
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
          <div className="flex flex-col gap-6">
            <Controls
              analysisMode={analysisMode}
              setAnalysisMode={handleSetAnalysisMode}
              transcript={transcript}
              setTranscript={setTranscript}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className="flex flex-col">
            <ResultDisplay result={result} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
}