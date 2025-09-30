import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import auth from "./routes/auth.js";
import selectprogram from "./routes/select_program.js"

dotenv.config()
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use('/auth', auth);

app.use('/selectprogram', selectprogram)

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
