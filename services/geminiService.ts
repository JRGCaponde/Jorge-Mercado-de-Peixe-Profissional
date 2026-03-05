
import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketInsights = async (salesData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a business analyst for a high-end fish market, analyze this sales data and provide 3 actionable insights for inventory and pricing strategy: ${JSON.stringify(salesData)}. Return response in Markdown.`,
      config: {
        systemInstruction: "You are a professional retail and seafood market consultant. Keep advice practical and concise.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights at this time.";
  }
};
