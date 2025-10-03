import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

export const registerUser = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const userId = await createUser(email, hashedPassword, name);
  return userId;
};

export const loginUser = async (email, password) => {
  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, email: user.email, name: user.name };
};
