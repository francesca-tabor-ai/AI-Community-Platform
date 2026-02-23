import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async generateEventDescription(title: string, category: string, keyPoints: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling, high-conversion event description for an event titled "${title}" in the category "${category}". 
      Include these key points: ${keyPoints.join(", ")}. 
      Format: A catchy hook, a brief overview, what to expect (bullet points), and a clear call to action.`,
    });
    return response.text;
  },

  async getPersonalizedRecommendations(userInterests: string[], availableEvents: any[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's interests: ${userInterests.join(", ")}, 
      recommend the top 3 events from this list: ${JSON.stringify(availableEvents)}.
      Return the response as a JSON array of event IDs with a brief "reason" for each.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              eventId: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["eventId", "reason"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async chatWithAssistant(message: string, context: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: `You are Nexus AI, an intelligent assistant for the Nexus AI Community Platform. 
        Your goal is to help users find events, communities, and networking opportunities. 
        Current Context: ${context}. 
        Be professional, helpful, and concise.`,
      }
    });
    return response.text;
  }
};
