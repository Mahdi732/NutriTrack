import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import profile from "./routes/profile.js"
import mealRouter from "./routes/meal.js";
import authRouter from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'nutritrack-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Authentication routes
app.use('/auth', authRouter);

// Protected routes
app.get("/", requireAuth, (req, res) => {
  res.render("index");
}); 

app.use('/profile', requireAuth, profile);

app.use('/meal', requireAuth, mealRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
