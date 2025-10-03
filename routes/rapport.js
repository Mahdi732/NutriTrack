import express from "express";
const router = express.Router();

router.get("/rapport", (req,res) => {
  res.render("rapport");
});

export default router;