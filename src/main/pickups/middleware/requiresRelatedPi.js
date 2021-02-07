import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Pickup from "../../../_rest/models/Pickup";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresRelatedPi = async (req, res, next) => {
  req.purpose = "Prove Rights to Pickup";
  try {
    if (req.user.role === "admin") return next();

    // if client
    if (req.user.role === "client") {
      const exists = await Pickup.exists({
        _id: req.params.id,
        client: req.user.client,
      });
      if (exists) return next();
    }

    // if warehouse
    if (req.user.role === "warehouse") {
      // return next(); only main will either way
      const exists = await Pickup.exists({
        _id: req.params.id,
        warehouse: req.user.warehouse,
      });
      if (exists) return next();
    }

    // if deliverer
    if (req.user.role === "deliverer") {
      const exists = await Pickup.exists({
        _id: req.params.id,
        type: "paid",
        $or: [
          { deliverer: { $exists: false } },
          { deliverer: req.user.deliverer },
        ],
      });
      if (exists) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
