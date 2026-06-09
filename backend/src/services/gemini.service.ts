import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    'WARNING: GEMINI_API_KEY environment variable is not defined. The Gemini service will run in fallback mock mode.'
  );
}

export interface CarbonFootprintResult {
  energyEmission: number;
  transportEmission: number;
  foodEmission: number;
  suggestions: string[];
}

/**
 * Sends natural language text to Gemini model configured for structured JSON outputs.
 * Parses the response and extracts carbon footprint statistics.
 */
export const analyzeCarbonFootprintText = async (
  inputText: string
): Promise<CarbonFootprintResult> => {
  if (!aiClient) {
    console.warn('[Gemini Service]: Returning mock data because GEMINI_API_KEY is not configured.');
    return getMockEmissionData(inputText);
  }

  const systemInstruction = `
    You are an expert Sustainability and Environmental AI Assistant.
    Your task is to analyze user natural language input describing their actions, behaviors, or consumption.
    Estimate their carbon footprint emissions (in kilograms of CO2) across three sectors:
    1. energyEmission (e.g. electrical appliances, lighting, heating, air conditioning)
    2. transportEmission (e.g. driving, riding public transit, flights, trains)
    3. foodEmission (e.g. meat consumption, dairy, local or imported groceries, food waste)
    
    CRITICAL: If a specific category is not explicitly described or mentioned in the user's input text, set its emission value to 0. Do not estimate or carry over values for unmentioned categories.
    Additionally, generate 2 to 4 personalized, actionable suggestions to reduce their footprint.
    
    You must return a raw JSON response that strictly adheres to the requested schema.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: inputText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            energyEmission: {
              type: 'NUMBER',
              description: 'Carbon emissions from energy usage in kg CO2',
            },
            transportEmission: {
              type: 'NUMBER',
              description: 'Carbon emissions from transport in kg CO2',
            },
            foodEmission: {
              type: 'NUMBER',
              description: 'Carbon emissions from diet and food in kg CO2',
            },
            suggestions: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'List of 2-4 personalized footprint reduction recommendations',
            },
          },
          required: ['energyEmission', 'transportEmission', 'foodEmission', 'suggestions'],
        },
      },
    });

    const textOutput = response.text;

    if (!textOutput) {
      throw new Error('Received an empty response from Gemini API.');
    }

    const data = JSON.parse(textOutput);

    return {
      energyEmission: Math.max(0, Number(data.energyEmission) || 0),
      transportEmission: Math.max(0, Number(data.transportEmission) || 0),
      foodEmission: Math.max(0, Number(data.foodEmission) || 0),
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
    };
  } catch (error) {
    console.error('[Gemini Service Error]: Failed to analyze footprint via AI API:', error);
    return getMockEmissionData(inputText);
  }
};

/**
 * Fallback generator providing realistic estimations in testing/development
 * when API keys are not supplied.
 */
const getMockEmissionData = (inputText: string): CarbonFootprintResult => {
  const normalized = inputText.toLowerCase();
  
  let energyEmission = 0;
  let transportEmission = 0;
  let foodEmission = 0;

  if (normalized.includes('car') || normalized.includes('drive') || normalized.includes('flight') || normalized.includes('transport') || normalized.includes('bus') || normalized.includes('train')) {
    transportEmission = 15.6;
  }
  if (normalized.includes('ac') || normalized.includes('heater') || normalized.includes('electricity') || normalized.includes('energy') || normalized.includes('power') || normalized.includes('light')) {
    energyEmission = 10.0;
  }
  if (normalized.includes('meat') || normalized.includes('beef') || normalized.includes('pork') || normalized.includes('food') || normalized.includes('diet') || normalized.includes('eat') || normalized.includes('groceries')) {
    foodEmission = 6.2;
  }

  return {
    energyEmission: parseFloat(energyEmission.toFixed(2)),
    transportEmission: parseFloat(transportEmission.toFixed(2)),
    foodEmission: parseFloat(foodEmission.toFixed(2)),
    suggestions: [
      'Unplug power strips and electronics when not in use to reduce standby power consumption.',
      'Shift your transport choices toward walking, cycling, or public transit for short trips.',
      'Incorporate more plant-based alternatives into your diet to scale down food footprint.',
    ],
  };
};
