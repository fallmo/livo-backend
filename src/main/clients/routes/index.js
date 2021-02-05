import { Router } from "express";
import {
  addClientController,
  editClientController,
  getClientController,
  getClientsController,
} from "../controllers";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import { requiresOwnerC } from "../middleware/requiresOwnerC";

// base => /clients
const router = Router();
router.use(requiresAuth);

router.post("/", requiresRoles([]), addClientController); // create a client
router.get("/", requiresRoles([]), getClientsController); // get a list of clients

router.get(
  "/:id",
  requiresRoles(["client"]),
  requiresOwnerC,
  getClientController
); // get a specific client

router.patch(
  "/:id",
  requiresRoles(["client"]),
  requiresOwnerC,
  editClientController
); // edit a client

export default router;
