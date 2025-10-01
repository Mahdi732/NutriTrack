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
    - Estimate the main nutritional values: calories, protein, carbs, fats, sugar, sodium.
    - Return the analysis in clean JSON format like this:
    {
      "foods": [
        { "name": "Pizza", "quantity": "1 slice", "calories": 285, "protein": 12, "carbs": 36, "fat": 10, "sugar": 3, "sodium": 640 }
      ],
      "totals": {
        "calories": 285,
        "protein": 12
      }
    }

    2. Profile Comparison:
    Compare the meal with the user's profile:
    ${JSON.stringify(user)}
    - Check if the meal fits the user’s daily goal and health condition.
    - Detect gaps for user profile (e.g. not enough protein for an athlete, too much sugar for diabetic, too much sodium for hypertensive).

    3. Tailored Advice:
    - If the meal is good: confirm it’s a good choice and explain briefly why.
    - If not: explain the problem clearly and suggest simple improvements or alternatives (max 2–3 suggestions).
    - Mark the status as: excellent, good, bad, or dangerous.

    STRICT RULE: Respond ONLY with valid JSON. No explanations, no markdown, no extra text.
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
