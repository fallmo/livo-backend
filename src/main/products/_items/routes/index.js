import { Router } from "express";
import {
  getItemController,
  getItemsController,
  getProductItemsController,
} from "../controllers";
import { requiresRoles } from "../../../auth/middleware/requiresRoles";
import { requiresRelatedI } from "../middleware/requiresRelatedI";
import { requiresRelatedP } from "../../middleware/requiresRelatedP";

// base => /products
const router = Router();

router.get(
  "/items",
  requiresRoles(["warehouse", "deliverer", "client"]),
  getItemsController
); // get list of items

router.get(
  "/items/:id",
  requiresRoles(["warehouse", "deliverer", "client"]),
  requiresRelatedI,
  getItemController
); // get an item

router.get(
  "/:id/items",
  requiresRoles(["warehouse", "client", "deliverer"]),
  requiresRelatedP,
  getProductItemsController
); // get items for a product

export default router;
