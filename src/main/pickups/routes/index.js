import { Router } from "express";
import { requiresAuth } from "../../auth/middleware/requiresAuth";
import { requiresRoles } from "../../auth/middleware/requiresRoles";
import {
  addPickupController,
  canPickupController,
  editPickupController,
  getPickupController,
  getPickupsController,
} from "../controllers";
import { requiresOptionPi } from "../middleware/requiresOptionPi";
import { requiresRelatedPi } from "../middleware/requiresRelatedPi";

// base => /pickups
const router = Router();
router.use(requiresAuth);
router.use(requiresOptionPi); // only main warehouse + only deliverers with options.pickups === true

router.get(
  "/",
  requiresRoles(["warehouse", "deliverer", "client"]),
  getPickupsController
); // get list of pickups

router.get(
  "/:id",
  requiresRoles(["warehouse", "deliverer", "client"]),
  requiresRelatedPi,
  getPickupController
); // get a specific pickup

router.post(
  "/",
  requiresRoles(["warehouse", "client"], true),
  addPickupController
); // add a pickup;

router.patch(
  "/:id",
  requiresRoles(["warehouse", "deliverer"], true),
  requiresRelatedPi,
  editPickupController
); // edit pickup deliverer or status;

router.delete(
  "/:id",
  requiresRoles(["warehouse", "client"]),
  canPickupController
); // cancels a pickup
export default router;

// performance double query with middlwares
