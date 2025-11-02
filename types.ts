
export interface SensorReading {
  lat: number;
  lon: number;
  PM2_5: number;
  timestamp: string;
}

export interface Hotspot {
  center: {
    lat: number;
    lon: number;
  };
  avg_PM2_5: number;
  sensors: SensorReading[];
  reason: string;
  recommended_action: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface DataSummary {
  most_recent_timestamp: string;
  num_sensors: number;
  overall_avg_PM2_5: number;
}

export interface AnalysisResponse {
  data_summary: DataSummary;
  hotspots: Hotspot[];
  warnings: string[];
}
