import { Response, NextFunction } from "express";
import { PermissionError } from "../../../_rest/misc/errors";
import Warehouse from "../../../_rest/models/Warehouse";

/**
 * @param {import("../../../_rest/types/request").xRequest} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const requiresOptionT = async (req, res, next) => {
  req.purpose = "Prove Rights to Transfer";
  try {
    if (req.user.role === "admin") return next();
    if (req.user.role === "client") return next();

    if (req.user.role === "warehouse") {
      const exists = await Warehouse.exists({
        _id: req.user.warehouse,
        $or: [
          { "options.transfer_in": true },
          { "options.transfer_out": true },
        ],
      });
      if (exists) return next();
    }

    throw new PermissionError("you cannot access this resource");
  } catch (err) {
    next(err);
  }
};
