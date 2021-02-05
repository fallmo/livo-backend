import { Router } from "express";
import {
  getStateController,
  loginController,
  logoutController,
  registerController,
} from "../controllers";
import { requiresAuth } from "../middleware/requiresAuth";

// base => /auth
const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/state", requiresAuth, getStateController);
router.post("/logout", requiresAuth, logoutController);

export default router;
