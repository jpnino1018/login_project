import { Router } from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  deleteUserController,
  getAllUsersController,
  resetPasswordController,
  getLastLoginController
} from "../controllers/authController";
import { isAdmin, isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/users", isAdmin, getAllUsersController);
router.delete("/users/:username", isAdmin, deleteUserController);
router.post("/users/:username/reset-password", isAdmin, resetPasswordController);

router.get("/me/last-login", isAuthenticated, getLastLoginController);
router.put("/me/change-password", isAuthenticated, changePassword);

export default router;
