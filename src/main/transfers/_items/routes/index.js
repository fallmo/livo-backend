import { Router } from "express";
import { requiresRelatedT } from "../../middleware/requiresRelatedT";
import { requiresRoles } from "../../../auth/middleware/requiresRoles";
import {
  addTransferItemController,
  getTransferItemController,
  getTransferItemsController,
  getTransfersItemsController,
  remTransferItemController,
} from "../controllers";
import { requiresOwnerTCo } from "../middleware/requiresOwnerTCo";

// base => /transfers
const router = Router();

router.get("/items", requiresRoles(["warehouse"]), getTransfersItemsController); // get Items Currently involved in transfers;

router.get(
  "/:id/items",
  requiresRoles(["warehouse"]),
  requiresRelatedT,
  getTransferItemsController
); // get the Items for a transfer;

router.get(
  "/:id/items/:id2",
  requiresRoles(["warehouse"]),
  requiresRelatedT,
  getTransferItemController
); // get an Item of Transfer

router.post(
  "/:id/items",
  requiresRoles(["warehouse"], true),
  requiresOwnerTCo,
  addTransferItemController
); // add an Item to Transfer

router.delete(
  "/:id/items/:id2",
  requiresRoles(["warehouse"], true),
  requiresOwnerTCo,
  remTransferItemController
); // remove an Item from Transfer

export default router;
