import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Deliverer from "../../../_rest/models/Deliverer";
import Warehouse from "../../../_rest/models/Warehouse";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOptionPi = async (req, res, next) => {
  req.purpose = "Prove Rights to Pickup";
  try {
    if (req.user.role === "admin") return next();
    if (req.user.role === "client") return next();

    if (req.user.role === "deliverer") {
      // all deliverers can do pickups or only main?
      const deliverer = await Deliverer.findOne(
        { _id: req.user.deliverer },
        "warehouse options"
      ).populate("warehouse", "main");
      // @ts-ignore

      if (!deliverer.options || deliverer.options.pickups) {
        return next();
      }
    }

    if (req.user.role === "warehouse") {
      const exists = await Warehouse.exists({
        _id: req.user.warehouse,
        main: true,
      });
      if (exists) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
