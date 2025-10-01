import { analyseMealService } from "../services/mealService.js";

export const analyseMeal = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const user = {
      name: "Ahmed",
      age: 24,
      gender: "male",
      height: 178,
      weight: 68,
      malade: "none",
      allergies: ["none"],
      activityLevel: "high",
      type: "sportive",
      objective: "gain muscle",
      dietaryPreferences: ["high protein", "low sugar", "halal"],
    };

    const result = await analyseMealService(file, user);

    res.render("meal", {
      imagePath: file.path,
      data: result,
    });
  } catch (error) {
    console.error("Error analysing meal:", error);
    res
      .status(500)
      .send(`Server error while analysing the meal: ${error.message}`);
  }
};
