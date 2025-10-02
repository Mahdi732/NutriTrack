import express, { Router } from "express";

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
})
router.get('/signup', (req, res) => {
  res.render('signup');
})

export default router;