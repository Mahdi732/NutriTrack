import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { insertAnalysisMeal, insertRocomondation } from "../repositories/analysisRepository.js";
import { getUserData } from "../repositories/profileRepository.js";

export const analyseMealService = async (file, userId) => {
  const imageBase64 = fs.readFileSync(path.resolve(file.path), {
    encoding: "base64",
  });

  let user = await getUserData(userId);

  const ai = new GoogleGenAI({});

  const prompt = `
  You are a nutrition expert. Analyse the uploaded food image carefully.

  1. Food Analysis:
  - Identify each food item in the image.
  - Estimate portion sizes.
  - Estimate nutritional values: calories, protein, carbs, fat, sugar, sodium.

  2. Profile-Based Estimation:
  Compare the meal with the user's profile:
  ${JSON.stringify(user)}

  IMPORTANT:
  - Separate what the meal contains (totals) and what the user SHOULD ideally have in ONE MEAL (adjustedEstimation) based on their profile and objective.
  - Example: if daily protein need is 120g and user eats 3 meals, then adjustedEstimation.protein ≈ 40g.
  - For weight gain: adjustedEstimation should be higher in protein & calories.
  - For weight loss: adjustedEstimation should be lower in calories, moderate protein.
  - For chronic patients: adjustedEstimation must respect safe ranges (low sodium for hypertensive, low sugar for diabetics).

  3. Dynamic Recommendations:
  - Compare totals vs adjustedEstimation.
  - Point out gaps (too high/too low).
  - For Athletes: include pre/post-training meal advice and hydration suggestions.
  - For Patients with chronic conditions: include medical alerts (e.g., too much salt for hypertensive, high sugar for diabetic).
  - For Weight loss/gain: suggest adjustments for the next meal if there is a significant surplus or deficit.

  STRICT RULES:
  - Respond ONLY with valid JSON, no markdown, no text.
  - Always follow this structure:

  {
    "foods": [
      {
        "item": "Pancakes ...",
        "estimated_quantity_g": 350,
        "calories": 700,
        "protein": 24,
        "carbs": 105,
        "fat": 28,
        "sugar": 21,
        "sodium": 700
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
      "gaps": ["string"],
      "fit": true
    },
    "advice": {
      "status": "excellent | good | bad | dangerous",
      "message": "string",
      "suggestions": [
        "string",
        "string"
      ],
      "prePostTraining": "string (if athlete)",
      "hydration": "string (if athlete)",
      "medicalAlerts": ["string"] (if chronic patient),
      "nextMealAdjustment": "string (if weight loss/gain)"
    }
  }
    IF user.type_pathologie != 'none' or 'null' THEN only send medical alerts for chronic patients.
    IF user.objectif != 'none' or 'null' THEN only send next meal adjustment.
    IF user.sport_discipline != 'None' THEN only send pre/post-training + hydration advice.

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
  console.log(data)
  let parseData = JSON.parse(data);
  const analysisData = {
  foods: parseData.foods,
  totals: parseData.totals,
  profileComparison: parseData.profileComparison
  };
  const analysisJson = JSON.stringify(analysisData);
  const rocomondationJson = JSON.stringify(parseData.advice);
  const mealId = await insertAnalysisMeal(userId, analysisJson);
  await insertRocomondation(userId, rocomondationJson);
  return parseData;
};
