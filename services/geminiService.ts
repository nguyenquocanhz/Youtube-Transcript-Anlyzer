
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Utility to convert file to a base64 string for the API
function fileToGenerativePart(file: File): Promise<{mimeType: string, data: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes the full data URL prefix, so we split it to get only the base64 part
      const data = result.split(',')[1];
      resolve({
        mimeType: file.type,
        data,
      });
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}

export async function analyzeTranscript(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for transcript:", error);
    throw new Error("Failed to get response from AI. Please check your API key and network connection.");
  }
}

export async function analyzeVideo(prompt: string, videoFile: File): Promise<string> {
    try {
        const videoPart = await fileToGenerativePart(videoFile);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }, videoPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for video:", error);
        throw new Error("Failed to get response from AI for video analysis. The file might be too large or in an unsupported format.");
    }
}
