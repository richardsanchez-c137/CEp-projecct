
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        data_summary: {
            type: Type.OBJECT,
            properties: {
                most_recent_timestamp: { type: Type.STRING },
                num_sensors: { type: Type.INTEGER },
                overall_avg_PM2_5: { type: Type.NUMBER },
            },
            required: ["most_recent_timestamp", "num_sensors", "overall_avg_PM2_5"],
        },
        hotspots: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    center: {
                        type: Type.OBJECT,
                        properties: {
                            lat: { type: Type.NUMBER },
                            lon: { type: Type.NUMBER },
                        },
                        required: ["lat", "lon"],
                    },
                    avg_PM2_5: { type: Type.NUMBER },
                    sensors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                lat: { type: Type.NUMBER },
                                lon: { type: Type.NUMBER },
                                PM2_5: { type: Type.NUMBER },
                                timestamp: { type: Type.STRING },
                            },
                            required: ["lat", "lon", "PM2_5", "timestamp"],
                        },
                    },
                    reason: { type: Type.STRING },
                    recommended_action: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: ["low", "medium", "high"] },
                },
                required: ["center", "avg_PM2_5", "sensors", "reason", "recommended_action", "confidence"],
            },
        },
        warnings: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
    },
    required: ["data_summary", "hotspots", "warnings"],
};


export const analyzeSensorData = async (csvData: string): Promise<AnalysisResponse> => {
    const prompt = `
You are an expert environmental data analyst. Analyze the provided sensor CSV and return exactly one JSON object (no extra text, no markdown) that identifies geographic hotspots of elevated PM2.5 over the last 24 hours.

INSTRUCTIONS:
1. Input CSV will have these headers (exact): lat,lon,PM2_5,PM10,timestamp
2. Consider only rows whose timestamp is within the last 24 hours of the most recent timestamp present in the CSV.
3. Identify up to 3 hotspots. A hotspot = cluster of sensors where average PM2_5 is in the top 10% and at least 2 nearby sensors within 1.5 km have elevated readings.
4. For each hotspot, compute:
   - center: { "lat": number, "lon": number } (centroid of cluster)
   - avg_PM2_5: number (rounded to 1 decimal)
   - sensors: array of objects [{ "lat":..., "lon":..., "PM2_5":..., "timestamp":... }]
   - reason: short string (max 20 words) describing why it's a hotspot (e.g., "persistent high PM2.5 at multiple nearby sensors")
   - recommended_action: one sentence (max 20 words) with a community action (e.g., "targeted leafleting and temporary vehicle restrictions")
   - confidence: "low"|"medium"|"high"

5. Also return these top-level fields:
   - data_summary: { "most_recent_timestamp": "...", "num_sensors": n, "overall_avg_PM2_5": number }
   - warnings: array of strings (e.g., missing columns, not enough data)

OUTPUT SCHEMA (return only JSON, exactly this structure):
{
  "data_summary": {"most_recent_timestamp": string, "num_sensors": int, "overall_avg_PM2_5": number},
  "hotspots": [
    {
      "center": {"lat": number, "lon": number},
      "avg_PM2_5": number,
      "sensors": [{"lat":number,"lon":number,"PM2_5":number,"timestamp":string}],
      "reason": string,
      "recommended_action": string,
      "confidence": "low"|"medium"|"high"
    }
  ],
  "warnings": [string]
}

USER INPUT CSV:
\`\`\`csv
${csvData}
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.1,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: AnalysisResponse = JSON.parse(jsonText);
        
        if (!parsedResponse.hotspots) {
            throw new Error("AI analysis did not return a valid hotspots array.");
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI's response. The data might be malformed or the model is unable to process the request.");
        }
        throw new Error("Failed to get a valid analysis from the AI. Please check your data format and try again.");
    }
};
