import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export const analyseMealService = async (file, user) => {
  const imageBase64 = fs.readFileSync(path.resolve(file.path), {
    encoding: "base64",
  });

  const ai = new GoogleGenAI({});

  const prompt = `
    You are a nutrition expert. Analyse the uploaded food image carefully.

    1. Food Analysis:
    - Identify each food item in the image.
    - Estimate the portion size (simple format like "1 slice", "100g", "1 cup").
    - Estimate nutritional values: calories, protein, carbs, fat, sugar, sodium.

    2. Profile-Based Estimation:
    Compare the meal with the user's profile:
    ${JSON.stringify(user)}
    - Adjust the calorie and nutrient estimation according to the user’s objective:
      * Athletes: ensure enough protein, carbs for energy, hydration advice.
      * Weight loss: highlight excess calories or fat, suggest lighter options.
      * Weight gain: highlight if protein/calories are insufficient.
      * Chronic patients: warn about dangerous nutrients (sodium for hypertensive, sugar for diabetics).
    - Return both the raw estimation and the profile-adjusted evaluation.

    3. Dynamic Recommendations:
    - Provide short and simple recommendations.
    - If the meal is good: confirm why it’s good.
    - If not: explain what’s wrong and suggest 1–3 improvements.
    - Status must be one of: excellent, good, bad, dangerous.

    STRICT RULES:
    - Respond ONLY with valid JSON. 
    - NO explanations, NO markdown, NO extra text.
    - Always follow THIS structure exactly:
 
    {
      "foods": [
        { 
          "name": "string", 
          "quantity": "string", 
          "calories": number, 
          "protein": number, 
          "carbs": number, 
          "fat": number, 
          "sugar": number, 
          "sodium": number 
        }
      ],
      "totals": { 
        "calories": number, 
        "protein": number, 
        "carbs": number, 
        "fat": number, 
        "sugar": number, 
        "sodium": number 
      },
      "profileComparison": {
        "adjustedEstimation": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "sugar": number,
          "sodium": number
        },
        "gaps": ["string", "string"],
        "fit": true
      },
      "advice": { 
        "status": "excellent | good | bad | dangerous", 
        "message": "string", 
        "suggestions": ["string", "string"] 
      }
    }
  `;

  const contents = [
    {
      inlineData: {
        mimeType: file.mimetype,
        data: imageBase64,
      },
    },
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  let data = response.text.trim();
  data = data.replace(/```json|```/g, "").trim();

  return JSON.parse(data);
};
