import { Router } from "express";
import { requiresRoles } from "../../../auth/middleware/requiresRoles";
import { requiresOwnerO } from "../../middleware/requiresOwnerO";
import { requiresRelatedO } from "../../middleware/requiresRelatedO";
import {
  addOrderItemController,
  getOrderItemController,
  getOrderItemsController,
  getOrdersItemsController,
  remOrderItemController,
} from "../controllers";

// base => /orders
const router = Router();

router.get("/items", requiresRoles(["warehouse"]), getOrdersItemsController); // get list of items involved in orders

router.get(
  "/:id/items",
  requiresRoles(["warehouse", "deliverer"]),
  requiresOwnerO,
  getOrderItemsController
); // get list of items for an order

router.post(
  "/:id/items",
  requiresRoles(["deliverer"], true),
  requiresRelatedO,
  addOrderItemController
); // add an item to order;

router.get(
  "/:id/items/:id2",
  requiresRoles(["deliverer", "warehouse"]),
  requiresRelatedO,
  getOrderItemController
); // remove an item from order;

router.delete(
  "/:id/items/:id2",
  requiresRoles(["deliverer"], true),
  requiresOwnerO,
  remOrderItemController
); // remove an item from order;

export default router;
