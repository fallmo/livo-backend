import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";

import {
  addDelivererController,
  editDelivererController,
  getDelivererController,
  getDeliverersController,
} from "../controllers";
import { requiresRelatedD } from "../middleware/requiresRelatedD";

// base => /deliverers
const router = Router();
router.use(requiresAuth);

router.get("/", requiresRoles(["warehouse"]), getDeliverersController); // get list of deliverers

router.get(
  "/:id",
  requiresRoles(["warehouse", "deliverer"]),
  requiresRelatedD,
  getDelivererController
); // get one deliverer

router.patch(
  "/:id",
  requiresRoles(["warehouse", "deliverer"]),
  requiresRelatedD,
  editDelivererController
); // edit a deliverer

// make sure warehouse can later
router.post("/", requiresRoles(["warehouse"]), addDelivererController); // add deliverer

export default router;
