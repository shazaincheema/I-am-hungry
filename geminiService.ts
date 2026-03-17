
import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from './constants';

// Initialize the Google GenAI SDK strictly following the required configuration using the named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFoodRecommendation = async (mood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the user's mood: "${mood}", suggest 2-3 items from this menu: ${JSON.stringify(MENU_ITEMS)}. 
      Return a friendly response explaining why these items match the mood. 
      Limit to 100 words. Keep it very appetizing and Pakistani culture-friendly.`,
    });
    // Directly access the text property as per GenerateContentResponse definition guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble thinking of a recommendation right now, but our Chicken Biryani is always a hit in Lahore!";
  }
};
