
import React from 'react';
import { AnalyzeIcon, LoaderIcon } from './icons';

interface InputPanelProps {
  csvData: string;
  setCsvData: (data: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const placeholderData = `lat,lon,PM2_5,PM10,timestamp
34.0522,-118.2437,155.6,180.2,2023-10-27T10:00:00Z
34.0525,-118.2440,160.1,185.5,2023-10-27T10:05:00Z
40.7128,-74.0060,45.2,55.1,2023-10-27T10:00:00Z
34.0530,-118.2435,140.3,165.8,2023-10-27T11:00:00Z
48.8566,2.3522,120.8,140.9,2023-10-27T09:30:00Z
48.8569,2.3525,125.3,145.2,2023-10-27T09:35:00Z
40.7135,-74.0065,48.9,58.3,2023-10-27T10:15:00Z
48.8560,2.3518,115.0,135.5,2023-10-27T10:00:00Z`;


const InputPanel: React.FC<InputPanelProps> = ({ csvData, setCsvData, onAnalyze, isLoading }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-3 text-emerald-300">Sensor Data Input</h2>
      <p className="text-slate-400 mb-4 text-sm">
        Paste your sensor data in CSV format below. The table must include columns for `lat`, `lon`, `PM2_5`, `PM10`, and `timestamp`.
      </p>
      <textarea
        className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200 resize-none min-h-[300px] lg:min-h-0"
        placeholder={placeholderData}
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-200"
      >
        {isLoading ? (
            <>
                <LoaderIcon />
                Analyzing...
            </>
        ) : (
            <>
                <AnalyzeIcon />
                Analyze Data
            </>
        )}
      </button>
    </div>
  );
};

export default InputPanel;
