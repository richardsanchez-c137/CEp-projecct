
import React, { useState } from 'react';
import { analyzeSensorData } from './services/geminiService';
import type { AnalysisResponse } from './types';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [csvData, setCsvData] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!csvData.trim()) {
      setError('Please paste sensor data before analyzing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSensorData(csvData);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="p-4 border-b border-slate-700/50">
        <div className="container mx-auto flex items-center gap-3">
            <LogoIcon />
            <h1 className="text-xl md:text-2xl font-bold text-emerald-400">Environmental Hotspot Analyzer</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <InputPanel
            csvData={csvData}
            setCsvData={setCsvData}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
          <ResultsPanel
            result={analysisResult}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>

      <footer className="text-center p-4 mt-8 text-sm text-slate-500">
        <p>Powered by Air Cleaners. For analytical purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
