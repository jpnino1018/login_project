import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "amociber"; // Replace with an environment variable

// Middleware to verify if the user is an ADMIN
export const isAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string }; // Decode and type the token payload
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access denied: Invalid token" });
  }
};

// Middleware to validate access for authenticated users
export const isAuthenticated = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied: Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { role: string }; // Decode and type the token payload
    req.body.role = decoded.role; // Optionally, attach the role to the request for later use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access denied: Invalid token" });
  }
};
