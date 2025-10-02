import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./routes/auth.js";
import profile from "./routes/profile.js"
import mealRouter from "./routes/meal.js";


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.render("index");
}); 

app.use('/auth', auth);

app.use('/profile', profile)

app.use('/meal', mealRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
