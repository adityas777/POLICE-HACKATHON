
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { OCRMode } from "../types";
import { getPrompt } from "../constants";

export const performOCR = async (
  base64Image: string,
  mode: OCRMode,
  sourceLang: string,
  targetLang: string,
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1] || base64Image,
      mimeType: mimeType,
    },
  };
  
  const prompt = getPrompt(mode, sourceLang, targetLang);
  const textPart = { text: prompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      temperature: 0.1,
      responseMimeType: (mode === OCRMode.BASE || mode === OCRMode.HANDWRITTEN) ? "text/plain" : "application/json"
    }
  });

  return response.text || '';
};
