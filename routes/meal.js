import express from "express";
import multer from "multer";
import { analyseMeal } from "../controllers/mealController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/uplaods")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now + "-" + file.originalname)
  }
});

const uplaod = multer({ storage: storage })

router.post('/analyse', uplaod.single("mealImage"), analyseMeal);

export default router;