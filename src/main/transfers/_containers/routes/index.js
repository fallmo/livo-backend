import { Router } from "express";
import { requiresRoles } from "../../../auth/middleware/requiresRoles";
import {
  addContainerController,
  editContainerController,
  getContainerController,
  getContainersController,
} from "../controllers";

// base => /transfers
const router = Router();

router.get(
  "/containers",
  requiresRoles(["warehouse"]),
  getContainersController
); // get list of containers;

router.get(
  "/containers/:id",
  requiresRoles(["warehouse"]),
  getContainerController
); // get one container;

router.patch(
  "/containers/:id",
  requiresRoles(["warehouse"], true),
  editContainerController
); // get one container;

router.post(
  "/containers",
  requiresRoles(["warehouse"], true),
  addContainerController
); // get one container;

export default router;
