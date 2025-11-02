
import React from 'react';
import type { Hotspot } from '../types';
import { LocationIcon, ReasoningIcon, ActionIcon, SensorIcon, ConfidenceIcon } from './icons';

interface HotspotCardProps {
  hotspot: Hotspot;
  index: number;
}

const ConfidenceBadge: React.FC<{ level: 'low' | 'medium' | 'high' }> = ({ level }) => {
    const styles = {
        low: 'bg-red-500/20 text-red-300',
        medium: 'bg-yellow-500/20 text-yellow-300',
        high: 'bg-green-500/20 text-green-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
};

const HotspotCard: React.FC<HotspotCardProps> = ({ hotspot, index }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 transition-all hover:border-sky-500 hover:shadow-lg hover:shadow-sky-900/20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
            <span className="flex-shrink-0 bg-sky-500/20 text-sky-300 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {index + 1}
            </span>
            <h3 className="text-lg font-bold text-sky-300">Hotspot Details</h3>
        </div>
        <div className="text-2xl font-bold text-orange-300">
            {hotspot.avg_PM2_5.toFixed(1)} <span className="text-base text-slate-400 font-normal">µg/m³</span>
        </div>
      </div>
      
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400"><LocationIcon /></div>
            <div>
                <p className="font-semibold text-slate-300">Center Location</p>
                <p className="text-slate-400 font-mono">{`Lat: ${hotspot.center.lat.toFixed(4)}, Lon: ${hotspot.center.lon.toFixed(4)}`}</p>
            </div>
        </div>

        <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400"><SensorIcon /></div>
            <div>
                <p className="font-semibold text-slate-300">Contributing Sensors</p>
                <p className="text-slate-400">{hotspot.sensors.length} readings</p>
            </div>
        </div>

        <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400"><ConfidenceIcon /></div>
            <div>
                <p className="font-semibold text-slate-300">Confidence</p>
                <ConfidenceBadge level={hotspot.confidence} />
            </div>
        </div>
        
        <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400"><ReasoningIcon /></div>
            <div>
                <p className="font-semibold text-slate-300">Reasoning</p>
                <p className="text-slate-400">{hotspot.reason}</p>
            </div>
        </div>

        <div className="flex items-start gap-3">
            <div className="mt-1 text-slate-400"><ActionIcon /></div>
            <div>
                <p className="font-semibold text-slate-300">Suggested Action</p>
                <p className="text-slate-400">{hotspot.recommended_action}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotCard;
