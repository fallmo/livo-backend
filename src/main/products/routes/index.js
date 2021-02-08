import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addProductController,
  editProductController,
  getProductController,
  getProductsController,
} from "../controllers";
import { requiresOwnerP } from "../middleware/requiresOwnerP";
import { requiresRelatedP } from "../middleware/requiresRelatedP";
import itemRoutes from "../_items/routes";

// base => /products
const router = Router();
router.use(requiresAuth);
router.use(itemRoutes);

router.get(
  "/",
  requiresRoles(["client", "warehouse", "deliverer"]),
  getProductsController
); // get list of products

router.post("/", requiresRoles(["client"], true), addProductController); // add a product

router.get(
  "/:id",
  requiresRoles(["client", "warehouse", "deliverer"]),
  requiresRelatedP,
  getProductController
); // get a specific product

router.patch(
  "/:id",
  requiresRoles(["client"], true),
  requiresOwnerP,
  editProductController
); // edit a product

export default router;
