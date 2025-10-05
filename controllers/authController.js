import { registerUser, loginUser } from "../services/authService.js";

export const showLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

export const showRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.render("auth/register", { error: "All fields are required" });
    }

    await registerUser(email, password, name);
    res.redirect("/auth/login");
  } catch (error) {
    res.render("auth/register", { error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", { error: "All fields are required" });
    }

    const user = await loginUser(email, password);
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    res.render("auth/login", { error: error.message });
  }6739173
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
