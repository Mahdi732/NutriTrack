import express from "express";
import multer from "multer";
import { analyseMeal } from "../controllers/mealController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
});

const uplaod = multer({ storage: storage })

router.get("/", (req, res) => {
  res.render("meal", { data: null, imagePath: null });
});
router.post('/', uplaod.single("mealImage"), analyseMeal);

export default router;