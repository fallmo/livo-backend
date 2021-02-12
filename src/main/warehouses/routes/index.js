import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addWarehouseController,
  editWarehouseController,
  getWarehouseController,
  getWarehousesController,
} from "../controllers";
import { requiresOwnerW } from "../middleware/requiresOwnerW";

// base => /warehouses
const router = Router();
router.use(requiresAuth);

router.get("/", requiresRoles(["warehouse"]), getWarehousesController); // get list of warehouses;

router.get(
  "/:id",
  requiresRoles(["warehouse"]),
  requiresOwnerW,
  getWarehouseController
); // get a specific warehouse;

router.patch("/:id", requiresRoles([]), editWarehouseController); // edit a warehouse

router.post("/", requiresRoles([]), addWarehouseController); // edit a warehouse

export default router;
