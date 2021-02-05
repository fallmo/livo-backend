import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addUserController,
  editUserController,
  getUserController,
  getUsersController,
} from "../controllers";
import { requiresSelfU } from "../middleware/requiresSelfU";

// base => /users
const router = Router();
router.use(requiresAuth);

router.get("/", requiresRoles([]), getUsersController); // Only admin can see full list of users
router.get("/:id", requiresSelfU, getUserController); // User himself or admin can see his information

// allow warehouse to create deliverer user
router.post("/", requiresRoles([]), addUserController); // Only admin can create users
router.patch("/:id", requiresSelfU, editUserController); // User himself can edit some stuff

export default router;
