import express from "express";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";
import mealRouter from "./routes/meal.js";


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('uploads', path.join(__dirname, 'uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use('/meal', mealRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
