import express from "express";
import { addProfilController } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", (req, res) => {
  const user = req.session.user;
  res.render("profile", {user});
});
router.post('/', addProfilController);

export default router;
