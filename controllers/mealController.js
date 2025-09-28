import fs from "fs";
import path from "path";
import { ImageAnalysisChain } from "langchain/chains";
import { GeminiFlashModel } from "langchain/llms";
import { PromptTemplate } from "langchain/prompts";

export const analyseMeal = async (req, res) => {
  try {
    const file = req.file;
    const imagePath = file.path;
    if (!file) {
      return res.status(400).send("there's problelem with aploading the file please try again.");
    }

    console.log(imagePath);
    const imagebuffer = fs.readFileSync(path.resolve(imagePath));

    const gemini = new GeminiFlashModel({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemeni-flash-1.5"
    });

    const chain = new ImageAnalysisChain({ llm: gemini });

    const prompt = new PromptTemplate({
      template: `
        You are a nutrition expert. Analyse the uploaded food image carefully.
        - Identify each food item in the image.
        - Estimate the portion size.
        - Estimate the calories, protiens, sodums and anything else.
        - Return the result in JSON format with this structure:
        {{
          "foods": [
            {{ "name": "Pizza", "quantity": "1 slice", "calories": 285 }}
          ],
          "totalCalories": 285
        }}
      `,
      inputVariables: []
    });

    const analysisResult = await chain.call({
      image: imagebuffer,
      prompt: await prompt.format({})
    });

    console.log("analyse result", analysisResult);
  }catch (e) {
    console.error(error);
    res.status(500).send("Server error while analysing the meal");
  }
}