import { GoogleGenAI, Type } from "@google/genai";

// Initialize lazily to ensure process.env is available
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

export interface Shape {
  type: 'circle' | 'square' | 'triangle' | 'line';
  color: string;
  size: number;
  x: number;
  y: number;
  animation: 'pulse' | 'rotate' | 'float' | 'morph';
  blur?: number;
}

export interface Scene {
  text: string;
  imageKeyword: string;
  duration: number;
  themeColor: string;
  secondaryColor: string;
  shapes: Shape[];
  cameraEffect: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right';
}

export interface VideoScript {
  title: string;
  scenes: Scene[];
}

export async function generateVideoScript(prompt: string): Promise<VideoScript> {
  console.log("Generating high-end motion graphics script for prompt:", prompt);
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: `Act as a world-class Motion Graphics Director. Generate a cinematic video script for: "${prompt}". 
      
      Requirements:
      1. Each scene must feel like a high-end commercial or title sequence.
      2. Use sophisticated color palettes (themeColor and secondaryColor).
      3. Define 4-6 abstract shapes per scene with specific animations.
      4. Include a cameraEffect for each scene to create depth.
      5. The imageKeyword should describe atmospheric, high-contrast textures or environments.
      6. Text should be punchy and professional.
      
      Return JSON format.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  imageKeyword: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  themeColor: { type: Type.STRING },
                  secondaryColor: { type: Type.STRING },
                  cameraEffect: { type: Type.STRING, enum: ['zoom-in', 'zoom-out', 'pan-left', 'pan-right'] },
                  shapes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ['circle', 'square', 'triangle', 'line'] },
                        color: { type: Type.STRING },
                        size: { type: Type.NUMBER },
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        animation: { type: Type.STRING, enum: ['pulse', 'rotate', 'float', 'morph'] },
                        blur: { type: Type.NUMBER }
                      },
                      required: ["type", "color", "size", "x", "y", "animation"]
                    }
                  }
                },
                required: ["text", "imageKeyword", "duration", "themeColor", "secondaryColor", "shapes", "cameraEffect"]
              }
            }
          },
          required: ["title", "scenes"]
        }
      }
    });

    const text = response.text;
    console.log("Gemini response text:", text);

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as VideoScript;
  } catch (e) {
    console.error("Error in generateVideoScript:", e);
    throw e;
  }
}
