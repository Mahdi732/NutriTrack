import express, { Router } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("select_program");
});
router.get("/profile_athlete", (req, res) => {
  res.render("profile_athlete");
});
router.get("/profile_patient", (req, res) => {
  res.render("profile_patient");
})
router.get('/profile_massgane', (req, res) => {
  res.render("profile_massgane");
})
router.get('/profile_weightless', (req, res) => {
  res.render("profile_weightless");
})

export default router;
