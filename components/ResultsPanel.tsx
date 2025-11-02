
import React from 'react';
import type { AnalysisResponse } from '../types';
import HotspotCard from './HotspotCard';
import { ChartIcon, ErrorIcon, WarningIcon, DataSummaryIcon } from './icons';

interface ResultsPanelProps {
  result: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

const SkeletonLoader: React.FC = () => {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded-lg animate-pulse">
                    <div className="h-5 bg-slate-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mt-2"></div>
                </div>
            ))}
        </div>
    );
};

const DataSummaryDisplay: React.FC<{ summary: AnalysisResponse['data_summary'] }> = ({ summary }) => (
    <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
            <DataSummaryIcon />
            <h3 className="text-lg font-semibold text-slate-300">Data Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
                <p className="text-slate-400">Sensors Analyzed</p>
                <p className="font-bold text-slate-200 text-lg">{summary.num_sensors}</p>
            </div>
            <div>
                <p className="text-slate-400">Overall Avg PM2.5</p>
                <p className="font-bold text-slate-200 text-lg">{summary.overall_avg_PM2_5.toFixed(1)} µg/m³</p>
            </div>
            <div>
                <p className="text-slate-400">Most Recent Reading</p>
                <p className="font-bold text-slate-200 text-lg">{new Date(summary.most_recent_timestamp).toLocaleString()}</p>
            </div>
        </div>
    </div>
);


const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 h-full">
      <h2 className="text-xl font-semibold mb-4 text-sky-300">Analysis Results</h2>
      
      {isLoading && <SkeletonLoader />}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-start gap-3">
          <ErrorIcon />
          <div>
            <h3 className="font-bold">Analysis Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && result && (
        <>
            {result.warnings && result.warnings.length > 0 && (
                <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-4 rounded-lg flex items-start gap-3 mb-6">
                    <WarningIcon />
                    <div>
                        <h3 className="font-bold">Analysis Warnings</h3>
                        <ul className="list-disc list-inside text-sm">
                            {result.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {result.data_summary && <DataSummaryDisplay summary={result.data_summary} />}
            
            <div className="space-y-4">
              {result.hotspots.length > 0 ? (
                result.hotspots.map((hotspot, index) => (
                  <HotspotCard key={index} hotspot={hotspot} index={index} />
                ))
              ) : (
                <div className="text-center text-slate-400 p-8">
                    <p>No significant hotspots were identified based on the provided data and criteria.</p>
                </div>
              )}
            </div>
        </>
      )}
      
      {!isLoading && !error && !result && (
         <div className="text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[200px]">
            <ChartIcon />
            <p className="mt-4">Your hotspot analysis will appear here.</p>
            <p className="text-sm text-slate-500">Enter data and click "Analyze" to begin.</p>
         </div>
      )}
    </div>
  );
};

export default ResultsPanel;
