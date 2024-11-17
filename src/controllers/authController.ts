import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
const SECRET_KEY = 'amociber';
import { hashPassword } from "../utils/password";

import {
  getUserByUsername,
  createUser,
  updateUserLogin,
  updatePassword,
  deleteUser,
  getAllUsers,
  resetPassword,
  getLastLogin
} from "../models/user";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const user = await getUserByUsername(username);
  if (user) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const hashedPassword = hashPassword(password);
  await createUser(username, hashedPassword);
  return res.status(201).json({ message: "User created successfully" });
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  try{
    if (!username || !password) {
     return res.status(400).json({ error: 'Username and password are required.' });
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [salt, hashedPassword] = user.password.split(":");
    const isPasswordValid = bcrypt.compareSync(password + salt, hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' } // Token valid for 1 hour
    );

    await updateUserLogin(username);
    return res.json({ message: "Login successful", token });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server error" });
}
};


export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Token is missing or invalid" });
      return;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
    const username = decoded.username;

    // Validate the new password from the request body
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ message: "New password must be at least 6 characters long" });
      return;
    }
    const hashedPassword = hashPassword(newPassword);
    await updatePassword(username, hashedPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  await deleteUser(username);
  res.json({ message: "User deleted successfully" });
};

export const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
}

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    await resetPassword(username);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
}

export const getLastLoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.body.username; // O extraer de la sesión/token
    const lastLogin = await getLastLogin(username);
    res.status(200).json({ last_login: lastLogin });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving last login" });
  }
}