import bcrypt from 'bcryptjs';
import crypto from "crypto";

export const hashPassword = (password: string): string => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = bcrypt.hashSync(password + salt, 10);
    return `${salt}:${hashedPassword}`;
  };