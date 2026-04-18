import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface HobbyMatch {
  name: string;
  reason: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export async function matchHobby(answers: string[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these answers to a personal interest quiz, match the user with 3 hobbies.
    Answers: ${answers.join(', ')}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            reason: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] }
          },
          required: ['name', 'reason', 'difficulty']
        }
      }
    }
  });

  return JSON.parse(response.text) as HobbyMatch[];
}
