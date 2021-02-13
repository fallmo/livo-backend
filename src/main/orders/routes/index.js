import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addOrderController,
  editOrderController,
  getOrderController,
  getOrdersController,
} from "../controllers";
import { requiresOwnerO } from "../middleware/requiresOwnerO";
import { requiresRelatedO } from "../middleware/requiresRelatedO";
import itemRoutes from "../_items/routes";

// base => /orders
const router = Router();
router.use(requiresAuth);
router.use(itemRoutes);

router.get(
  "/",
  requiresRoles(["warehouse", "deliverer", "client"]),
  getOrdersController
); // get list of orders

router.get(
  "/:id",
  requiresRoles(["warehouse", "deliverer", "client"]),
  requiresRelatedO,
  getOrderController
); // get an order

router.patch(
  "/:id",
  requiresRoles(["warehouse", "deliverer", "client"], true),
  requiresOwnerO,
  editOrderController
); // edit an order

router.post("/", requiresRoles(["client"], true), addOrderController);

export default router;
