import express from "express";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(config.server.port, () => {
  console.log(`Server running on http://localhost:${config.server.port}`);
});
