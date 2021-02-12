import { Router } from "express";
import { requiresRoles } from "../../../auth/middleware/requiresRoles";
import { requiresOwnerCo } from "../middleware/requiresOwnerCo";
import {
  addContainerController,
  delContainerController,
  editContainerController,
  getContainerController,
  getContainersController,
} from "../controllers";
import { requiresRelatedCo } from "../middleware/requiresRelatedCo";

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
  requiresRelatedCo,
  getContainerController
); // get one container;

router.patch(
  "/containers/:id",
  requiresRoles(["warehouse"], true),
  requiresRelatedCo,
  editContainerController
); // get one container;

router.delete(
  "/containers/:id",
  requiresRoles(["warehouse"]),
  requiresOwnerCo,
  delContainerController
);
router.post(
  "/containers",
  requiresRoles(["warehouse"], true),
  addContainerController
); // get one container;

export default router;
