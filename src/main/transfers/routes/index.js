import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addTransferController,
  delTransferController,
  editTransferController,
  getTransferController,
  getTransfersController,
} from "../controllers";
import { requiresOptionT } from "../middleware/requiresOptionT";
import { requiresOwnerT } from "../middleware/requiresOwnerT";
import { requiresRelatedT } from "../middleware/requiresRelatedT";
import containerRoutes from "../_containers/routes";
import itemRoutes from "../_items/routes";

//base => /transfers
const router = Router();
router.use(requiresAuth);
router.use(requiresOptionT); // only warehouses with options.transfer can access
router.use(containerRoutes);
router.use(itemRoutes);

router.get("/", requiresRoles(["warehouse", "client"]), getTransfersController); // get list of transfers;

router.get(
  "/:id",
  requiresRoles(["warehouse", "client"]),
  requiresRelatedT,
  getTransferController
); // get a transfer

router.patch(
  "/:id",
  requiresRoles(["warehouse"], true),
  requiresOwnerT,
  editTransferController
); // edit a transfer;

router.delete(
  "/:id",
  requiresRoles(["warehouse", "client"]),
  requiresOwnerT,
  delTransferController
);

router.post("/", requiresRoles(["client"], true), addTransferController); // add a transfer

export default router;
