import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export const analyseMeal = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const imageBase64 = fs.readFileSync(path.resolve(file.path), {
      encoding: "base64",
    });

    const ai = new GoogleGenAI({});

    const prompt = `
      You are a nutrition expert. Analyse the uploaded food image carefully.
      - Identify each food item in the image.
      - Estimate the portion size.
      - Estimate the calories, proteins, sodium, and anything else.
      - Return the result in JSON format with this structure:
      {
        "foods": [
          { "name": "Pizza", "quantity": "1 slice", "calories": 285 }
        ],
        "totalCalories": 285
          and anything else...
      }
    `;

    const contents = [
      {
        inlineData: {
        mimeType: file.mimetype,
        data: imageBase64
        }
      },
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents
    })

    console.log("Analysis Result:", response.text);

    const result = JSON.parse(response.text);
    
    res.json({
      image: file.path,
      analysis: 
    })
  } catch (error) {
    console.error("Error analysing meal:", error);
    res
      .status(500)
      .send(`Server error while analysing the meal: ${error.message}`);
  }
};
