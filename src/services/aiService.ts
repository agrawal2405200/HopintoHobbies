import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface HobbyMatch {
  name: string;
  reason: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export async function matchHobby(answers: string[]): Promise<HobbyMatch[]> {
  // FIX: "gemini-3-flash-preview" does not exist — corrected to "gemini-2.0-flash"
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Based on these answers to a personal interest quiz, match the user with 3 hobbies that suit them best.
    Answers: ${answers.join(', ')}
    
    Return exactly 3 hobby recommendations as a JSON array.`,
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
